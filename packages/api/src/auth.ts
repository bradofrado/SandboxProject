import { type Session } from "model/src/auth";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { clerkClient } from "@clerk/nextjs";
import { getAuth } from '@clerk/nextjs/server';
import type { Container } from "inversify";
import { ProviderAccountRepository } from "./repository/provider-account";
import { testContainer } from "./containers/inversify.test.config";

export const getServerAuthSession = async ({req}: CreateNextContextOptions, container?: Container): Promise<Session | undefined> => {
	const {userId} = getAuth(req);
	const user = userId ? await clerkClient.users.getUser(userId) : undefined;
	const ourAuth = !userId || !user ? null : {userId, user: {id: user.id, name: `${user.firstName} ${user.lastName}`, image: user.imageUrl}}
	
	const providerAccountRepository = (container || testContainer).get<ProviderAccountRepository>(ProviderAccountRepository.$);
	const account = ourAuth ? await providerAccountRepository.getAccountById(ourAuth.userId) : undefined;

	return {
		auth: ourAuth,
		account
	}
}
