import type {Stream} from 'node:stream';
import Imap from 'imap';
import type {ParsedMail} from 'mailparser';
import { simpleParser} from 'mailparser';
import type { Contact } from 'model/src/patient';

const buildXOAuth2Token = (user: string, accessToken: string): string => Buffer
    .from([`user=${user}`, `auth=Bearer ${accessToken}`, '', '']
    .join('\x01'), 'utf-8')
    .toString('base64');

export interface Attachment {
	content: Buffer,
	filename: string
}

export interface AttachmentJSON {
	content: {type: 'Buffer', data: Uint8Array},
	filename: string
}

export interface ScrapedEmail {
	id: string,
	replyId: string | undefined,
	reply: ScrapedEmail | undefined,
	date: Date,
	from: Contact,
	to: Contact,
	attachments: Attachment[],
	text: string,
	subject: string,
}

export class EmailScraper {
	private imap: Imap;
	constructor(userId: string, accessToken: string) {
		const imapConfig = {
			xoauth2: buildXOAuth2Token(userId, accessToken),
			host: process.env.IMAP_HOST || '',
			port: 993,
			tls: true,
			tlsOptions: {
				rejectUnauthorized: false,
			}
		};

		this.imap = new Imap(imapConfig as Imap.Config);
	}

	public getEmails(): Promise<ScrapedEmail[]> {
		let emails: ScrapedEmail[] = [];
		return new Promise((resolve, reject) => {
			this.imap.once('ready', async () => {
					emails = emails.concat(await this.openBox('[Gmail]/Sent Mail'))
					emails = emails.concat(await this.openBox('INBOX'));
	
					//Add the necessary reply email objects
					const emailIds = emails.reduce<Record<string, ScrapedEmail>>((prev, curr) => {
						prev[curr.id] = curr;
		
						return prev;
					}, {});
					for (const email of emails) {
						if (email.replyId) {
							const reply = emailIds[email.replyId] as ScrapedEmail | undefined;
							if (reply !== undefined) {
								reply.reply = email;
							}
						}
					}
					//console.log(emails);
					this.imap.end();
				//})
			});
	
			this.imap.once('error', (err: Error) => {
				reject(err);
			});
	
			this.imap.once('end', () => {
				resolve(emails);
			});
	
			this.imap.connect();
		});
	}

	public getEmail(messageId: string): Promise<ScrapedEmail | undefined> {
		return new Promise<ScrapedEmail | undefined>((resolve, reject) => {
			this.imap.once('ready', () => {
				this.imap.openBox('Inbox', false, () => {
					this.imap.search([['HEADER', 'Message-ID', messageId]], (err, results) => {
						const f = this.imap.fetch(results, {bodies: ''});
						f.on('message', msg => {
							msg.on('body', (stream: Stream) => {
								simpleParser(stream, (parsedErr, parsed) => {
									if (parsedErr) {
										reject(parsedErr);
									}

									const scrapedEmail = this.parsedToScrapedEmail(parsed);
									resolve(scrapedEmail);
								})
							})
						})
						f.once('error', ex => {
							reject(ex);
						});
					})
				})
			})

			this.imap.once('error', (err: Error) => {
				reject(err);
			});

			this.imap.connect();
		})
	}

	private parsedToScrapedEmail(parsed: ParsedMail): ScrapedEmail | undefined {
		const {text, subject, date, to, from, attachments, messageId, inReplyTo} = parsed;
		//TODO: deal with undefined better
		if (!text || !date || !to || !from || Array.isArray(to) || !subject || !messageId) {
			return undefined;
		}
		return {
			attachments: attachments.map(attachment => ({content: attachment.content, filename: attachment.filename || ''})), 
			date,
			from: {
				id: '',
				name: from.value[0].name,
				email: from.value[0].address || ''
			},
			to: {
				id: '',
				name: to.value[0].name,
				email: to.value[0].address || ''										
			},
			text,
			subject,
			id: messageId,
			replyId: inReplyTo,
			reply: undefined
		};
	}

	private openBox(boxName: string): Promise<ScrapedEmail[]> {
		return new Promise<ScrapedEmail[]>((resolve, reject) => {
			this.imap.openBox(boxName, false, () => {
				this.imap.search(['SEEN', ['SINCE', new Date(2023, 10, 4)]], (err, results) => {
					const f = this.imap.fetch(results, {bodies: ''});
					const promises: Promise<ScrapedEmail>[] = [];
					f.on('message', msg => {
						promises.push(new Promise<ScrapedEmail>((resolveMessage, rejectMessage) => {
							msg.on('body', (stream: Stream) => {
								simpleParser(stream, (parsedErr, parsed) => {
									if (parsedErr) {
										rejectMessage(parsedErr);
										return;
									}
									const scrapedEmail = this.parsedToScrapedEmail(parsed);
									//TODO: deal with undefined better
									if (scrapedEmail === undefined) {
										rejectMessage(Error('Invalid email contents'));
										return;
									}
									resolveMessage(scrapedEmail);
								});
							});
						}));
					});
					f.once('error', ex => {
						reject(ex);
					});
					f.once('end', () => {
						Promise.all(promises).then(emails => {
							resolve(emails)
						}).catch((errEnd: Error) => {
							reject(errEnd)
						});
					});
				});
			});
		});
	}
}