import { Container } from "inversify";
import { MedicalService, TestMedicalService } from "../services/medical/medical-service";
import { AttorneyService, TestAttorneyService } from "../services/attorney/attorney-service";
import { DocumentService, TestDocumentService } from "../services/documents/document-service";
import 'reflect-metadata'
import { PatientService, TestPatientService } from "../services/patient/patient-service";

const testContainer = new Container();
testContainer.bind<MedicalService>(MedicalService.$).to(TestMedicalService);
testContainer.bind<AttorneyService>(AttorneyService.$).to(TestAttorneyService);
testContainer.bind<DocumentService>(DocumentService.$).to(TestDocumentService);
testContainer.bind<PatientService>(PatientService.$).to(TestPatientService);

export {testContainer};