import { Container } from "inversify";
import { prisma } from "db/lib/prisma";
import type { PrismaClient } from "db/lib/prisma";
import { MedicalService, TestMedicalService } from "../services/medical/medical-service";
import { AttorneyService, TestAttorneyService } from "../services/attorney/attorney-service";
import { DocumentService, TestDocumentService } from "../services/documents/document-service";
import 'reflect-metadata'
import { PatientService, TestPatientService } from "../services/patient/patient-service";
import { PatientLinkingRepository, PrismaPatientLinkingRepository } from "../repository/patient-linking";
import { PrismaProviderAccount, ProviderAccountRepository } from "../repository/provider-account";
import { AttorneyRegistry, TestAttorneyRegistry } from "../services/attorney/attorney-registry";
import { MedicalRegistry, TestMedicalRegistry } from "../services/medical/medical-registry";
import { PatientFeedRepository, TestPatientFeedRepository } from "../repository/patient-feed";
import { DocumentRepository, PrismaDocumentRepository } from "../repository/document-repository";



const testContainer = new Container();
testContainer.bind<PrismaClient>('Prisma').toConstantValue(prisma);
testContainer.bind<AttorneyRegistry>(AttorneyRegistry.$).to(TestAttorneyRegistry);
testContainer.bind<MedicalRegistry>(MedicalRegistry.$).to(TestMedicalRegistry);
testContainer.bind<MedicalService>(MedicalService.$).to(TestMedicalService);
testContainer.bind<AttorneyService>(AttorneyService.$).to(TestAttorneyService);
testContainer.bind<DocumentService>(DocumentService.$).to(TestDocumentService);
testContainer.bind<PatientService>(PatientService.$).to(TestPatientService);
testContainer.bind<PatientLinkingRepository>(PatientLinkingRepository.$).to(PrismaPatientLinkingRepository);
testContainer.bind<ProviderAccountRepository>(ProviderAccountRepository.$).to(PrismaProviderAccount);
testContainer.bind<PatientFeedRepository>(PatientFeedRepository.$).to(TestPatientFeedRepository);
testContainer.bind<DocumentRepository>(DocumentRepository.$).to(PrismaDocumentRepository);
export {testContainer};