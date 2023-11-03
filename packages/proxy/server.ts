import express from "express";
import path from "node:path";

const app = express();
const port = 8080; // default port to listen

interface DocumentRequest {
	patient: {
		firstName: string,
		lastName: string,
		middleName: string,
		dateOfBirth: Date,
		phone: string,
		email: string,
	},
	provider: {
		name: string,
		phone: string,
		fax: string,
		email: string
	},
	documents: {
		description: string,
		category: string,
		subCategory: string,
		name: string,
		mimeType: string,
	}[],
	dateOfLoss: Date,
	incidentType: string
}

const clients = [
	{
    id: "0",
    firstName: "Maria",
    lastName: "Abarca",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 7, 23),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Document Requested',//'Negotiation',
		policyLimit: 1000000,
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Clinical Care",
    primaryContact: "Clint Peterson",
    lastUpdateDate: new Date(2023, 8, 2),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "layne.abbott@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Litigation',
		policyLimit: 1000000
  },
  {
    id: "2",
    firstName: "Ola",
    lastName: "Abdullatif",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Becca Johnson",
    lastUpdateDate: undefined,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "ola.abdullatif@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: undefined,
		policyLimit: 1000000
  },
  {
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Jeb Joe",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 5, 18),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "abe.emmanuel@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Referral',//'Litigation',
		policyLimit: 1000000
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "John Cena Care",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 6, 30),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "claudia.acero@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Demand',
		policyLimit: 1000000
  },
]

const usedClients: string[] = [];
let readyDocuments: DocumentRequest[] = [];

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
	res.sendFile("./index.html", {
		root: path.resolve('.')
});
});

app.get('/requests', (req, res) => {
	console.log('GET /requests');

	const toSend = readyDocuments.slice();
	readyDocuments = [];

	res.send(toSend);
})

app.post("/request", (req, res) => {
	console.log('POST /request');

	const availableClients = clients.filter(c => !usedClients.includes(c.id));
	if (availableClients.length === 0) return Promise.resolve([]);
	const client = availableClients[Math.round(Math.random() * 10) % availableClients.length];
	usedClients.push(client.id);

	readyDocuments.push({
		patient: {
			firstName: client.firstName,
			middleName: 'M',
			lastName: client.lastName,
			dateOfBirth: client.dateOfBirth,
			email: client.email,
			phone: client.phone,
		},
		provider: {
			email: 'spinalrehab@gmail.com',
			fax: '',
			phone: '801-999-1929',
			name: client.medicalProvider
		},
		documents: [
			{
				description: "(PDF version of) ",
				category: "Appeals",
				subCategory: "Memo of Law",
				name: "Advise of Defendant Physical Exam Date.pdf",
				mimeType: "application/pdf"
			}
		],
		dateOfLoss: client.dateOfLoss,
		incidentType: client.incidentType
	});
});

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
});