import type { Client } from 'soap';
import { z } from 'zod';

const KareoRequestSchema = z.object({
	User: z.string(),
	Password: z.string(),
	CustomerKey: z.string(),
})
export type KareoRequest = z.infer<typeof KareoRequestSchema>;

const createKareoMethodSchema = <Request, Response>(args: z.ZodType<Request>, returnType: z.ZodType<Response>): z.ZodFunction<z.ZodTuple<[z.ZodType<Request>], z.ZodUnknown>, z.ZodPromise<z.ZodType<Response>>> => {
	return z.function().args(args).returns(z.promise(returnType));
}

/* GetAppointment */
const GetAppointmentRequestSchema = KareoRequestSchema.extend({
	AppointmentId: z.string()
})

/* There are many more fields that can be added to this response. */
const GetAppointmentResponseSchema = z.object({
	PracticeId: z.string(),
	ServiceLocationId: z.string(),
	AppointmentStatus: z.string(),
	StartTime: z.string(),
	EndTime: z.string(),
	IsRecurring: z.boolean(),
	OccurrenceId: z.string()
})
export type GetAppointmentRequest = z.infer<typeof GetAppointmentRequestSchema>;
export type GetAppointmentResponse = z.infer<typeof GetAppointmentResponseSchema>;
const getAppointmentSchema = createKareoMethodSchema(GetAppointmentRequestSchema, GetAppointmentResponseSchema);

/* GetAppointments */
/* Additional optional fields exist for this request */
const GetAppointmentsRequestSchema = KareoRequestSchema.extend({
	PracticeName: z.string(),
	Type: z.string(),
	ConfirmationStatus: z.string(),
	ServiceLocationName: z.string(),
	PatientID: z.string(),
	PatientFulName: z.string(),
	AppointmentReason: z.string()
})

/* There are many more fields that can be added to this response. */
const GetAppointmentsResponseSchema = z.object({
	Id: z.string(),
	CreatedDate: z.date(),
	LastModifiedDate: z.date(),
	PracticeName: z.string(),
	Type: z.string(),
})
export type GetAppointmentsRequest = z.infer<typeof GetAppointmentsRequestSchema>;
export type GetAppointmentsResponse = z.infer<typeof GetAppointmentsResponseSchema>;
const getAppointmentsSchema = createKareoMethodSchema(GetAppointmentsRequestSchema, GetAppointmentsResponseSchema);

/* Get Charges */
const GetChargesRequestSchema = KareoRequestSchema.extend({
	PracticeName: z.string(),
})

const GetChargesResponseSchema = z.object({
	PracticeName: z.string(),
})
export type GetChargesRequest = z.infer<typeof GetChargesRequestSchema>;
export type GetChargesResponse = z.infer<typeof GetChargesResponseSchema>;
const getChargesSchema = createKareoMethodSchema(GetChargesRequestSchema, GetChargesResponseSchema);

/** Get Patient */
const GetPatientRequestSchema = KareoRequestSchema.extend({
	PatientId: z.string(),
})

const GetPatientResponseSchema = z.object({
	PracticeName: z.string(),
})
export type GetPatientRequest = z.infer<typeof GetPatientRequestSchema>;
export type GetPatientResponse = z.infer<typeof GetPatientResponseSchema>;
const getPatientSchema = createKareoMethodSchema(GetPatientRequestSchema, GetPatientResponseSchema);

/** Get Patients */
const GetPatientsRequestSchema = KareoRequestSchema.extend({
	PracticeName: z.string(),
})

const GetPatientsResponseSchema = z.object({
	PracticeName: z.string(),
})
export type GetPatientsRequest = z.infer<typeof GetPatientsRequestSchema>;
export type GetPatientsResponse = z.infer<typeof GetPatientsResponseSchema>;
const getPatientsSchema = createKareoMethodSchema(GetPatientsRequestSchema, GetPatientsResponseSchema);

export const KareoClientSchema = z.object({
	GetAppointment: getAppointmentSchema,
	GetAppointments: getAppointmentsSchema,
	GetCharges: getChargesSchema,
	GetPatient: getPatientSchema,
	GetPatients: getPatientsSchema
})
type KareoClientMethods = z.infer<typeof KareoClientSchema>;

export interface KareoClient extends KareoClientMethods, Client {}
