import { z } from "zod";
import { providerIntegrationSchema } from "model/src/patient";
import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { MedicalService } from "../services/medical/medical-service";
import type { ProviderAccountRepository } from "../repository/provider-account";
import type { MedicalRegistry } from "../services/medical/medical-registry";
import type { ScrapedEmail } from "../services/email/email-scraper";

//Encrypting: Bcrypt
//Liability: Prove that a hack wasn't us


const getPatientRequestSchema = z.object({
	patientId: z.string()
});

interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	dateOfLoss: Date;
}

interface DocumentRequest {
	sentEmail: Email,
	patient: Patient,
	replies: Email[]
}

type Email = Omit<ScrapedEmail, 'replyId' | 'reply'>

export const patientsRouter = createTRPCRouter({
	getPatients: protectedProcedure
		.query(async ({ctx}) => {
			const firmId = ctx.auth.userId;
			return ctx.patientService.getPatients(firmId);
		}),
	
	getPatient: protectedProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			const firmId = ctx.auth.userId;
			return ctx.patientService.getPatient(firmId, input.patientId);
		}),

	getAppointments: protectedProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			const appointments = await ctx.patientFeedRepository.getFeedsForPatient(input.patientId);

			return appointments;
		}),

	getCharges: protectedProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			const firmId = ctx.auth.userId;
			const medicalService = await getMedicalServiceFromId(firmId, ctx.providerAccountRepository, ctx.medicalRegistry);
			const charges = await medicalService.getCharges(firmId, input.patientId);

			return charges;
		}),

	testGetRequests: protectedProcedure
		.mutation(async ({ctx}) => {
			// const firmId = ctx.auth.userId;
			// const attorneyService = await getAttorneyServiceFromId(firmId, ctx.providerAccountRepository, ctx.attorneyRegistry);
			// const documentRequests = await attorneyService.getRequests(firmId);

			// for (const req of documentRequests) {
			// 	const patient: Patient = {...req.patient, notes: '', dateOfLoss: req.dateOfLoss, lawFirm: undefined, incidentType: req.incidentType.toLowerCase().includes('auto') ? 'AUTO' : 'WORKERS_COMP', primaryContact: 'Jeremy', lastUpdateDate: new Date(), outstandingBalance: 0, status: 'File Setup', policyLimit: 0, id: ''};
			// 	const provider: ProviderAccount = {name: req.provider.name, integration: 'kareo', id: '', accountType: 'provider'};

			// 	const {id} = await ctx.patientService.createPatient(firmId, patient, {email: '', phone: '', firstName: patient.primaryContact, lastName: ''});
				
			// 	await ctx.patientService.createProviderForPatient(id, provider);
			// }

			const userEmail = ctx.auth.user.email;
			const accessToken = await clerkClient.users.getUserOauthAccessToken(ctx.auth.userId, 'oauth_microsoft');
			const emails = await ctx.emailService.getMessages(userEmail, accessToken[0].token);
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

			const parsePatient = (email: ScrapedEmail): Patient | undefined => {
				const firstName = parseField('First Name', email.text);
				const lastName = parseField('Last Name', email.text);
				const dateOfBirth = parseField('Date of Birth', email.text);
				const dateOfLoss = parseField('Date of Loss', email.text);

				return firstName && lastName && dateOfBirth && dateOfLoss ? {
					firstName,
					lastName,
					dateOfBirth: new Date(dateOfBirth),
					dateOfLoss: new Date(dateOfLoss)
				} : undefined;
			}

			// const emailIds = emails.reduce<Record<string, Email>>((prev, curr) => {
			// 	prev[curr.id] = curr;

			// 	return prev;
			// }, {});
			// const emailReplies: Email[] = [];
			// for (const id in emailIds) {
			// 	const email = emailIds[id];
			// 	if (email.replyToId) {
			// 		const replyTo = emailIds[email.replyToId];
			// 		if (replyTo === undefined) {
			// 			console.log(`Id: ${email.replyToId}`)
			// 			continue;
			// 		}
			// 		replyTo.reply = email;
			// 	} else {
			// 		emailReplies.push(email);
			// 	}
			// }

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
							attachments: currEmail.attachments,
							text: currEmail.text,
							subject: currEmail.subject
						});
					}

					
					documentRequests.push({
						patient,
						replies,
						sentEmail: {
							id: email.id,
							date: email.date,
							from: email.from,
							to: email.to,
							attachments: email.attachments,
							text: email.text,
							subject: email.subject
						}
					});
				}
			}
			return documentRequests;
		})
})

const getMedicalServiceFromId = async (firmId: string, providerAccountRepository: ProviderAccountRepository, medicalRegistry: MedicalRegistry): Promise<MedicalService> => {
	const account = await providerAccountRepository.getAccountById(firmId);
	if (!account) {
		throw new Error(`Cannot find account ${firmId}`);
	}
	const integration = providerIntegrationSchema.parse(account.integration);
	const medicalService = medicalRegistry.getService(integration);

	return medicalService;
}

// const getAttorneyServiceFromId = async (firmId: string, providerAccountRepository: ProviderAccountRepository, attorneyRegistry: AttorneyRegistry): Promise<AttorneyService> => {
// 	const account = await providerAccountRepository.getAccountById(firmId);
// 	if (!account) {
// 		throw new Error(`Cannot find account ${firmId}`);
// 	}
// 	const integration = firmIntegrationSchema.parse(account.integration);
// 	const attorneyService = attorneyRegistry.getService(integration);

// 	return attorneyService;
// }