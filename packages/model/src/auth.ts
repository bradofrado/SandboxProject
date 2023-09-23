import { z } from "zod"

export interface Login {
	email: Email,
	password: string
}

export type Email = `${string}@${string}`
export const EmailSchema = z.custom<Email>((val) => {
	if (!(typeof val === 'string')) return false;

	const indexOfAt = val.indexOf('@');

	//The @ symbol is not at the start or the end
	return indexOfAt > 0 && indexOfAt < val.length - 1;
})