import { z } from "zod";
import { providerIntegrationSchema } from "model/src/patient";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { MedicalService } from "../services/medical/medical-service";
import type { ProviderAccountRepository } from "../repository/provider-account";
import type { MedicalRegistry } from "../services/medical/medical-registry";

//Encrypting: Bcrypt
//Liability: Prove that a hack wasn't us


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