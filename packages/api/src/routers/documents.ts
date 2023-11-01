import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const getDocumentsSchema = z.object({
	path: z.string()
})
export const documentRouter = createTRPCRouter({
	getDocuments: protectedProcedure
		.input(getDocumentsSchema)
		.query(async ({input, ctx}) => {
			const documents = await ctx.documentService.getDocuments(input.path);

			return documents;
		}),

	deleteDocument: protectedProcedure
		.input(z.object({documentIds: z.array(z.string())}))
		.mutation(async ({input, ctx}) => {
			await ctx.documentService.deleteDocuments(input.documentIds);
		})
})