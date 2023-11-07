import fs from 'node:fs';
import path from 'node:path';
import { clerkClient } from "@clerk/nextjs";
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { DocumentRequest, Email, PatientRequest } from "model/src/patient";
import type { Attachment, ScrapedEmail } from "../email/email-scraper";
import { EmailService } from "../email/email-service";
import { _documentRequests } from "../patient/patient-tracking-service";
import fetch from 'node-fetch';

export interface DocumentRequestService {
	getRequests: (userId: string, userEmail: string) => Promise<DocumentRequest[]>
	downloadDocumentRequest: (documentRequestId: string, userId: string, userEmail: string) => Promise<Attachment[]>
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace DocumentRequestService {
	export const $: interfaces.ServiceIdentifier<DocumentRequestService> = Symbol('DocumentRequestService');
}

@injectable()
export class TestDocumentRequestService implements DocumentRequestService {
	public getRequests(): Promise<DocumentRequest[]> {
		return Promise.resolve<DocumentRequest[]>(_documentRequests);
	}

	public async downloadDocumentRequest(): Promise<Attachment[]> {
		const response = await fetch('http://localhost:3000/pdf-file.pdf', {method: 'GET'});

		return [{
			content: Buffer.from(await response.arrayBuffer()),
			filename: 'pdf-file.pdf'
		}]
	}
}

@injectable()
export class ScraperDocumentRequestService implements DocumentRequestService {
	constructor(@inject(EmailService.$) private emailService: EmailService) {}

	public async getRequests(userId: string, userEmail: string): Promise<DocumentRequest[]> {
		const accessToken = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_microsoft');
		const emails = await this.emailService.getMessages(userEmail, accessToken[0].token);
		const documentRequests: DocumentRequest[] = [];
		const parseField = (label: string, str: string): string | undefined => {
			const result = new RegExp(`${label}: (?<name>.*)`).exec(str);
			if (result === null) {
				return undefined;
			}

			return result[1];
		}

		const isMedicalRequestEmail = (email: ScrapedEmail): boolean => {
			return email.subject.toLowerCase().includes('medical request');
		}

		const isReplyEmail = (email: ScrapedEmail): boolean => {
			//TODO: Deal with case where you can change the subject line
			return Boolean(email.replyId);
		}

		const parsePatient = (email: ScrapedEmail): PatientRequest | undefined => {
			const firstName = parseField('First Name', email.text);
			const lastName = parseField('Last Name', email.text);
			const dateOfBirth = parseField('Date of Birth', email.text);
			const dateOfLoss = parseField('Date of Loss', email.text);

			return firstName && lastName && dateOfBirth && dateOfLoss ? {
				id: '',
				firstName,
				lastName,
				dateOfBirth: new Date(dateOfBirth),
				dateOfLoss: new Date(dateOfLoss),
				requests: []
			} : undefined;
		}

		for (const email of emails) {
			if (isMedicalRequestEmail(email) && !isReplyEmail(email)) {
				const patient = parsePatient(email);
				if (patient === undefined) {
					//throw new Error('Invalid medical request parsing');
					//TODO: Log this instance
					continue;
				}
				let currEmail = email;
				const replies: Email[] = []
				while (currEmail.reply) {
					currEmail = currEmail.reply;
					replies.push({
						id: currEmail.id,
						date: currEmail.date,
						from: currEmail.from,
						to: currEmail.to,
						attachments: currEmail.attachments.map(att => att.filename),
						text: currEmail.text,
						subject: currEmail.subject
					});
				}

				
				documentRequests.push({
					id: '',
					patient,
					replies,
					sentEmail: {
						id: email.id,
						date: email.date,
						from: email.from,
						to: email.to,
						attachments: email.attachments.map(att => att.filename),
						text: email.text,
						subject: email.subject
					}
				});
			}
		}
		console.log(documentRequests);
		return documentRequests;
	}

	public async downloadDocumentRequest(documentRequestId: string, userId: string, userEmail: string): Promise<Attachment[]> {
		const accessToken = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_microsoft');
		const email = await this.emailService.getMessage(documentRequestId, userEmail, accessToken[0].token);
		if (email === undefined) {
			throw new Error(`Cannot find email with id ${documentRequestId}`);
		}

		return email.attachments;
	}
}