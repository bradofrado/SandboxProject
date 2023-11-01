import { PrismaClient } from "db/lib/prisma"
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { ProviderAccount } from "model/src/patient";

export interface ProviderAccountRepository {
	getAccount: (name: string) => Promise<ProviderAccount | undefined>
	getAccountById: (id: string) => Promise<ProviderAccount | undefined>
	createAccount: (providerAccount: ProviderAccount) => Promise<ProviderAccount>
	updateAccount: (id: string, providerAccount: ProviderAccount) => Promise<ProviderAccount>
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace ProviderAccountRepository {
	export const $: interfaces.ServiceIdentifier<ProviderAccountRepository> = Symbol('ProviderAccount');
}

@injectable()
export class PrismaProviderAccount implements ProviderAccountRepository {
	constructor(@inject('Prisma') private primsa: PrismaClient) {}
	public async getAccount(name: string): Promise<ProviderAccount | undefined> {
		const account = await this.primsa.providerAccount.findFirst({
			where: {
				name
			}
		});

		return account ?? undefined;
	}

	public async getAccountById(id: string): Promise<ProviderAccount | undefined> {
		const account = await this.primsa.providerAccount.findFirst({
			where: {
				id
			}
		});

		return account ?? undefined;
	}

	public async createAccount(providerAccount: ProviderAccount): Promise<ProviderAccount> {
		const newAccount = await this.primsa.providerAccount.create({
			data: providerAccount
		});

		return newAccount;
	}

	public async updateAccount(id: string, providerAccount: ProviderAccount): Promise<ProviderAccount> {
		const newAccount = await this.primsa.providerAccount.update({
			data: providerAccount,
			where: {
				id
			}
		});

		return newAccount;
	}
}