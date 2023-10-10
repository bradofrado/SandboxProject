import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ProviderAccount } from "model/src/patient";

const createProviderAccountSchema = z.object({
	integration: z.string()
})

export const setupRoute = createTRPCRouter({
	getProviderAccount: protectedProcedure
		.query(async ({ctx}) => {
			const account = await ctx.providerAccountRepository.getAccountById(ctx.auth.userId);

			return account ?? null;
		}),

	createProviderAccount: protectedProcedure
		.input(createProviderAccountSchema)
		.mutation(async ({ctx, input}) => {
			const newAccount: ProviderAccount = {id: ctx.auth.userId, name: ctx.auth.user.name, integration: input.integration};
			console.log(newAccount);
			const account = await ctx.providerAccountRepository.createAccount(newAccount);

			return account;
		})
})