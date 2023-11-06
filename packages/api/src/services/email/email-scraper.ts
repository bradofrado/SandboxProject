import type {Stream} from 'node:stream';
import Imap from 'imap';
import {simpleParser} from 'mailparser';

const buildXOAuth2Token = (user: string, accessToken: string): string => Buffer
    .from([`user=${user}`, `auth=Bearer ${accessToken}`, '', '']
    .join('\x01'), 'utf-8')
    .toString('base64');

export interface Attachment {
	content: Buffer,
	filename: string
}

export interface Contact {
	name: string;
	email: string;
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



export const getEmails = (userId: string, accessToken: string): Promise<ScrapedEmail[]> => {
	const imapConfig = {
		xoauth2: buildXOAuth2Token(userId, accessToken),
		host: process.env.IMAP_HOST || '',
		port: 993,
		tls: true,
		tlsOptions: {
			rejectUnauthorized: false,
		}
	};

	const openBox = (boxName: string, imap: Imap): Promise<ScrapedEmail[]> => {
		return new Promise<ScrapedEmail[]>((resolve, reject) => {
			imap.openBox(boxName, false, () => {
				imap.search(['SEEN', ['SINCE', new Date(2023, 10, 4)]], (err, results) => {
					const f = imap.fetch(results, {bodies: ''});
					const promises: Promise<ScrapedEmail>[] = [];
					f.on('message', msg => {
						promises.push(new Promise<ScrapedEmail>((resolveMessage, rejectMessage) => {
							msg.on('body', (stream: Stream) => {
								simpleParser(stream, (parsedErr, parsed) => {
									if (parsedErr) {
										rejectMessage(parsedErr);
										return;
									}
									const {text, subject, date, to, from, attachments, messageId, inReplyTo} = parsed;
									//console.log(parsed);
									//TODO: deal with undefined better
									if (!text || !date || !to || !from || Array.isArray(to) || !subject || !messageId) {
										rejectMessage(Error('Invalid email contents'));
										return;
									}
									resolveMessage({
										attachments: attachments.map(attachment => ({content: attachment.content, filename: attachment.filename || ''})), 
										date,
										from: {
											name: from.value[0].name,
											email: from.value[0].address || ''
										},
										to: {
											name: to.value[0].name,
											email: to.value[0].address || ''
										},
										text,
										subject,
										id: messageId,
										replyId: inReplyTo,
										reply: undefined
									});
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

	const imap = new Imap(imapConfig as unknown as Imap.Config);
	let emails: ScrapedEmail[] = [];
	return new Promise((resolve, reject) => {
		imap.once('ready', async () => {
			//imap.getBoxes((err, mailboxes) => {
			// 	console.log(mailboxes);
				emails = emails.concat(await openBox('Sent', imap))
				emails = emails.concat(await openBox('INBOX', imap));

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
				imap.end();
			//})
		});

		imap.once('error', (err: Error) => {
			reject(err);
		});

		imap.once('end', () => {
			resolve(emails);
		});

		imap.connect();
	});
};