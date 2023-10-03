import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const patientRouter = createTRPCRouter({
    patientList: publicProcedure
    .query(() => {
        // How to connect to other API endpoints?
        const patients = "This will be a list of all patients."
        return patients
    }),

    patient: publicProcedure
    .input(z.string())
    .query(({ input }) => {
        // Get patient info where patientId = input
        const patient = "This will be one specific patient's information." 
        return patient
    }),
});