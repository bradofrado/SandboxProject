import { Container } from "inversify";
import { prisma } from "db/lib/prisma";
import type { PrismaClient } from "db/lib/prisma";
import { MedicalService, TestMedicalService } from "../services/medical/medical-service";
import { AttorneyService, SmartAdvocateService } from "../services/attorney/attorney-service";
import { DocumentService, TestDocumentService } from "../services/documents/document-service";
import { PatientService, PatientServiceInstance } from "../services/patient/patient-service";
import { PatientLinkingRepository, PrismaPatientLinkingRepository } from "../repository/patient-linking";
import { PrismaProviderAccount, ProviderAccountRepository } from "../repository/provider-account";
import { AttorneyRegistry, TestAttorneyRegistry } from "../services/attorney/attorney-registry";
import { MedicalRegistry, TestMedicalRegistry } from "../services/medical/medical-registry";
import { PatientFeedRepository, TestPatientFeedRepository } from "../repository/patient-feed";
import { DocumentRepository, PrismaDocumentRepository } from "../repository/document-repository";
import { EmailService, NodeMailerEmailService } from "../services/email/email-service";
import 'reflect-metadata';
import { DocumentRequestService, TestDocumentRequestService } from "../services/documents/document-request-service";
import { PatientTrackingService, TestPatientTrackingService } from "../services/patient/patient-tracking-service";


const testContainer = new Container();
testContainer.bind<PrismaClient>('Prisma').toConstantValue(prisma);
testContainer.bind<AttorneyRegistry>(AttorneyRegistry.$).to(TestAttorneyRegistry);
testContainer.bind<MedicalRegistry>(MedicalRegistry.$).to(TestMedicalRegistry);
testContainer.bind<MedicalService>(MedicalService.$).to(TestMedicalService);
testContainer.bind<AttorneyService>(AttorneyService.$).to(SmartAdvocateService);
testContainer.bind<DocumentService>(DocumentService.$).to(TestDocumentService);
testContainer.bind<PatientService>(PatientService.$).to(PatientServiceInstance);
testContainer.bind<PatientTrackingService>(PatientTrackingService.$).to(TestPatientTrackingService);
testContainer.bind<PatientLinkingRepository>(PatientLinkingRepository.$).to(PrismaPatientLinkingRepository);
testContainer.bind<ProviderAccountRepository>(ProviderAccountRepository.$).to(PrismaProviderAccount);
testContainer.bind<PatientFeedRepository>(PatientFeedRepository.$).to(TestPatientFeedRepository);
testContainer.bind<DocumentRepository>(DocumentRepository.$).to(PrismaDocumentRepository);
testContainer.bind<EmailService>(EmailService.$).to(NodeMailerEmailService);
testContainer.bind<DocumentRequestService>(DocumentRequestService.$).to(TestDocumentRequestService);

export {testContainer};