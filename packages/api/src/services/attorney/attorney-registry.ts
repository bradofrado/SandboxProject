import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import { AttorneyService } from "./attorney-service";
import 'reflect-metadata'

export interface AttorneyRegistry {
	getService: (name: string) => AttorneyService
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace AttorneyRegistry {
	export const $: interfaces.ServiceIdentifier<AttorneyRegistry> = Symbol('AttorneyRegistry');
}

@injectable()
export class TestAttorneyRegistry implements AttorneyRegistry {
	constructor(@inject(AttorneyService.$) private attorneyService: AttorneyService) {}

	public getService(): AttorneyService {
		return this.attorneyService
	}
}