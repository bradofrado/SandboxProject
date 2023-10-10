import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import 'reflect-metadata'

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
			const firmId = ctx.auth.userId;
			const medicalService = ctx.medicalRegistry.getService(firmId);
			const appointments = await medicalService.getAppointments(firmId, input.patientId);

			return appointments;
		}),

	getCharges: protectedProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			const firmId = ctx.auth.userId;
			const medicalService = ctx.medicalRegistry.getService(firmId);
			const charges = await medicalService.getCharges(firmId, input.patientId);

			return charges;
		}),
})