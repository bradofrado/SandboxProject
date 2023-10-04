import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const getPatientsRequestSchema = z.object({
	firmId: z.string()
})

const getPatientRequestSchema = getPatientsRequestSchema.extend({
	patientId: z.string()
})

export const patientsRouter = createTRPCRouter({
	getPatients: publicProcedure
		.input(getPatientsRequestSchema)
		.query(async ({input, ctx}) => {
			const practiceName = 'SpinalRehab';
			const patients = await ctx.medicalService.getPatients(practiceName);
			console.log(patients);

			return patients;
		}),
	
	getPatient: publicProcedure
		.input(getPatientRequestSchema)
		.query(async ({input, ctx}) => {
			//const practiceName = 'SpinalRehab';
			const patient = await ctx.medicalService.getPatient(input.patientId);

			return patient;
		})
})