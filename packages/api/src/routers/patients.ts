import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import 'reflect-metadata'

const getPatientsRequestSchema = z.object({
	firmId: z.string()
})

const getPatientRequestSchema = getPatientsRequestSchema.extend({
	patientId: z.string()
});

export const patientsRouter = createTRPCRouter({
	getPatients: publicProcedure
		.input(getPatientsRequestSchema)
		.query(async ({input, ctx}) => {
			return ctx.patientService.getPatients(input.firmId);
		}),
	
	getPatient: publicProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			return ctx.patientService.getPatient(input.firmId, input.patientId);
		}),

	getAppointments: publicProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			const medicalService = ctx.medicalRegistry.getService(input.firmId);
			const appointments = await medicalService.getAppointments(input.firmId, input.patientId);

			return appointments;
		}),

	getCharges: publicProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			const medicalService = ctx.medicalRegistry.getService(input.firmId);
			const charges = await medicalService.getCharges(input.firmId, input.patientId);

			return charges;
		}),
})