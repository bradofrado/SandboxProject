import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import { MedicalService } from "./medical-service";
import 'reflect-metadata'

export interface MedicalRegistry {
	getService: (name: string) => MedicalService
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace MedicalRegistry {
	export const $: interfaces.ServiceIdentifier<MedicalRegistry> = Symbol('MedicalRegistry');
}

@injectable()
export class TestMedicalRegistry implements MedicalRegistry {
	constructor(@inject(MedicalService.$) private medicalService: MedicalService) {}

	public getService(): MedicalService {
		return this.medicalService
	}
}