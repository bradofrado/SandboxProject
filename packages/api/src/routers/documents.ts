import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const getDocumentsSchema = z.object({
	path: z.string()
})
export const documentRouter = createTRPCRouter({
	getDocuments: publicProcedure
		.input(getDocumentsSchema)
		.query(async ({input, ctx}) => {
			console.log(input.path);
			const documents = await ctx.documentService.getDocuments(input.path);

			return documents;
		})
})