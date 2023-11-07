import { createTRPCRouter, protectedProcedure } from "../trpc";

export const trackingRouter = createTRPCRouter({
	getPatients: protectedProcedure
		.query(async ({ctx}) => {
			const patients = await ctx.patientTrackingService.getPatients(ctx.auth.userId);

			return patients;
		}),

	getRequests: protectedProcedure
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

			return ctx.documentRequestService.getRequests(ctx.auth.userId, ctx.auth.user.email);
		})
})