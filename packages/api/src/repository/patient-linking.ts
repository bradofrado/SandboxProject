import { PrismaClient } from "db/lib/prisma";
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

export interface PatientLinkingRepository {
	getLinking: (medicalId: string, medicalPatientId: string) => Promise<PatientLinking | undefined>
	createLinking: (patientLinking: PatientLinking) => Promise<PatientLinking>
}

export interface PatientLinking {
	medicalId: string; //Medical provider's account id
	attorneyId: string; //Attorney's account id
	medicalPatientId: string; //Patient id in medical provider's api system
	attorneyPatientId: string //Client id in attorney's api system
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace PatientLinkingRepository {
	export const $: interfaces.ServiceIdentifier<PatientLinkingRepository> = Symbol('PatientLinkingRepository');
}

@injectable()
export class PrismaPatientLinkingRepository implements PatientLinkingRepository {
	constructor(@inject('Prisma') private prisma: PrismaClient) {}
	public async getLinking(medicalId: string, medicalPatientId: string): Promise<PatientLinking | undefined> {
		const linking = await this.prisma.patientLinking.findFirst({
			where: {
				medicalId,
				medicalPatientId
			}
		});

		return linking ?? undefined;
	}

	public async createLinking(patientLinking: PatientLinking): Promise<PatientLinking> {
		const newLinking = await this.prisma.patientLinking.create({
			data: patientLinking
		});

		return newLinking;
	}
}