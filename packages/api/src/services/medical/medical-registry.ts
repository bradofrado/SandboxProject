import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { ProviderIntegration } from "model/src/patient";
import { MedicalService } from "./medical-service";
import 'reflect-metadata'

export interface MedicalRegistry {
	getService: (name: ProviderIntegration) => MedicalService
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

export class RealMedicalRegistry implements MedicalRegistry {
	constructor(kareoService: MedicalService) {
		this.services = {
			'kareo': kareoService,
			//'jane': janeService
		}
	}

	private services!: Record<ProviderIntegration, MedicalService>;

	public getService(name: ProviderIntegration): MedicalService {
		const service = this.services[name];

		return service;
	}
}