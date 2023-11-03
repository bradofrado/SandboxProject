import { z } from "zod";
import { Patient, ProviderAccount, firmIntegrationSchema, providerIntegrationSchema } from "model/src/patient";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { MedicalService } from "../services/medical/medical-service";
import type { ProviderAccountRepository } from "../repository/provider-account";
import type { MedicalRegistry } from "../services/medical/medical-registry";
import { AttorneyRegistry } from "../services/attorney/attorney-registry";
import { AttorneyService } from "../services/attorney/attorney-service";

const getPatientRequestSchema = z.object({
	patientId: z.string()
});

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
			try {
			const firmId = ctx.auth.userId;
			const attorneyService = await getAttorneyServiceFromId(firmId, ctx.providerAccountRepository, ctx.attorneyRegistry);
			const documentRequests = await attorneyService.getRequests(firmId);

			for (const req of documentRequests) {
				const patient: Patient = {...req.patient, notes: '', dateOfLoss: req.dateOfLoss, lawFirm: undefined, incidentType: req.incidentType.toLowerCase().includes('auto') ? 'AUTO' : 'WORKERS_COMP', primaryContact: 'Jeremy', lastUpdateDate: new Date(), outstandingBalance: 0, status: 'File Setup', policyLimit: 0, id: ''};
				const provider: ProviderAccount = {name: req.provider.name, integration: 'kareo', id: '', accountType: 'provider'};

				const {id} = await ctx.patientService.createPatient(firmId, patient, {email: '', phone: '', firstName: patient.primaryContact, lastName: ''});
				
				await ctx.patientService.createProviderForPatient(id, provider);
			}}catch(err){console.log(err)}
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

const getAttorneyServiceFromId = async (firmId: string, providerAccountRepository: ProviderAccountRepository, attorneyRegistry: AttorneyRegistry): Promise<AttorneyService> => {
	const account = await providerAccountRepository.getAccountById(firmId);
	if (!account) {
		throw new Error(`Cannot find account ${firmId}`);
	}
	const integration = firmIntegrationSchema.parse(account.integration);
	const attorneyService = attorneyRegistry.getService(integration);

	return attorneyService;
}