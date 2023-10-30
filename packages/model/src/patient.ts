import { z } from "zod";
import { stringUnionSchema } from "./utils";

export interface PatientBase {
	id: string;
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	dateOfLoss: Date;
	incidentType: string;
	email: string;
	phone: string;
}

export interface Patient extends PatientBase {
  notes: string;
  lawFirm: string;
  primaryContact: string;
  lastUpdateDate: Date | undefined;
  outstandingBalance: number;
	status: PatientStatusType | undefined;
}

export type PatientFeedType = 'request' | 'send' | 'appointment' | 'comment' | 'status'
export interface PatientFeed {
	id: string,
  patientId: string;
  date: Date;
	note: string;
	person: {
		name: string,
		imageUrl?: string
	};
	type: PatientFeedType
}

export const patientStatuses = [
  "File Setup",
  "Treatment",
  "Demand",
  "Negotiation",
	"Litigation",
  "Settlement",
] as const;
export type PatientStatusType = (typeof patientStatuses)[number] | 'Referral' | 'Document Requested';

export interface PatientDocument {
  patientId: string;
  name: string;
  path: string;
  lastUpdate: Date;
  size: number;
  type: "pdf" | "img" | "folder";
}

export interface PatientFinanceProvider {
  patientId: string;
  name: string;
  status: PatientFinanceStatus;
  amount: number;
}
export type PatientFinanceStatus = "Paid" | "Unpaid";

const accountTypes = ['provider', 'firm'] as const;
export type AccountType = typeof accountTypes[number];
export const accountTypeSchema = stringUnionSchema(accountTypes)

export const providerIntegrations = ['kareo'] as const;
export const firmIntegrations = ['smartAdvocate'] as const;
export type ProviderIntegration = typeof providerIntegrations[number];
export type FirmIntegration = typeof firmIntegrations[number];
export type IntegrationType = ProviderIntegration | FirmIntegration;
export const providerIntegrationSchema = stringUnionSchema(providerIntegrations);
export const integrationTypeSchema = stringUnionSchema((providerIntegrations as readonly IntegrationType[]).concat(firmIntegrations));

export interface ProviderAccount {
	id: string,
	name: string,
	integration: IntegrationType,
	accountType: AccountType
}

