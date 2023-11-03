import type {Stream} from 'node:stream';
import Imap from 'imap';
import {simpleParser} from 'mailparser';

const imapConfig = {
  user: process.env.SMTP_EMAIL || '',
  password: process.env.SMTP_KEY || '',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
	tlsOptions: {
		rejectUnauthorized: false
	}
};

const getEmails = () => {
  try {
    const imap = new Imap(imapConfig);
		imap.once('ready', () => {
			imap.openBox('INBOX', false, () => {
        imap.search(['SEEN', ['SINCE', new Date()]], (err, results) => {
					
          const f = imap.fetch(results, {bodies: ''});
          f.on('message', msg => {
            msg.on('body', (stream: Stream) => {
              simpleParser(stream, (err, parsed) => {
                // const {from, subject, textAsHtml, text} = parsed;
                console.log(parsed);
                /* Make API call to save the data
                   Save the retrieved data into a database.
                   E.t.c
                */
              });
            });
            msg.once('attributes', (attrs: {uid: string}) => {
              const {uid} = attrs;
              imap.addFlags(uid, ['\\Seen'], () => {
                // Mark the email as read after reading it
                console.log('Marked as read!');
              });
            });
          });
          f.once('error', ex => {
            void Promise.reject(ex);
          });
          f.once('end', () => {
            console.log('Done fetching all messages!');
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err: Error) => {
      console.log(err);
    });

    imap.once('end', () => {
      console.log('Connection ended');
    });

    imap.connect();
  } catch (ex) {
    console.log('an error occurred');
  }
};

getEmails();