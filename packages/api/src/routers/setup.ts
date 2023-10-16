import { z } from "zod";
import { accountTypeSchema, integrationTypeSchema, type ProviderAccount } from "model/src/patient";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createProviderAccountSchema = z.object({
	integration: integrationTypeSchema,
	name: z.string(),
	accountType: accountTypeSchema,
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
			const newAccount: ProviderAccount = {id: ctx.auth.userId, name: input.name, integration: input.integration, accountType: input.accountType};
			const account = await ctx.providerAccountRepository.createAccount(newAccount);

			return account;
		})
})