import type { interfaces } from 'inversify';
import { injectable } from 'inversify';
import type {Transporter} from 'nodemailer';
import { createTransport} from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { File } from '../../storage/storage';
import 'reflect-metadata';
import type { ScrapedEmail} from './email-scraper';
import { EmailScraper } from './email-scraper';

export interface MailOptions {
	to: string,
	subject: string,
	body: string,
	attachments?: File[]
}

export interface EmailService {
	sendMail: (options: MailOptions) => Promise<void>
	getMessages: (userEmail: string, accessToken: string) => Promise<ScrapedEmail[]>
	getMessage: (messageId: string, userEmail: string, accessToken: string) => Promise<ScrapedEmail | undefined>
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace EmailService {
	export const $: interfaces.ServiceIdentifier<EmailService> = Symbol('EmailService');
}

@injectable()
export class NodeMailerEmailService implements EmailService {
	private transporter: Transporter<SMTPTransport.SentMessageInfo>
	constructor() {
		this.transporter = createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
					user: process.env.SMTP_EMAIL,
					pass: process.env.SMTP_KEY
			}
	});
	}
	public async sendMail({to, subject, body, attachments}: MailOptions): Promise<void> {
		await this.transporter.sendMail({
			from: 'Nexa <bradofrado@gmail.com>', 
			to, 
			subject, 
			html: body, 
			attachments: attachments?.map(file => ({content: file.body, filename: file.name, contentType: file.type}))
		})
	}

	public async getMessages(userEmail: string, accessToken: string): Promise<ScrapedEmail[]> {
		const emailScraper = new EmailScraper(userEmail, accessToken);
		try {
			const emails = await emailScraper.getEmails(userEmail, accessToken);
			return emails;
		} catch(err) {
			console.log(err);
			return []
		}
	}

	public async getMessage(messageId: string, userEmail: string, accessToken: string): Promise<ScrapedEmail | undefined> {
		const emailScraper = new EmailScraper(userEmail, accessToken);
		const email = await emailScraper.getEmail(messageId);

		return email;
	}
}