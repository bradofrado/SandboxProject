import type {Stream} from 'node:stream';
import Imap from 'imap';
import {simpleParser} from 'mailparser';

const _build_XOAuth2_token = (user='', access_token='') => Buffer
    .from([`user=${user}`, `auth=Bearer ${access_token}`, '', '']
    .join('\x01'), 'utf-8')
    .toString('base64');

const imapConfig = {
  user: 'bradofrado@gmail.com',//process.env.SMTP_EMAIL || '',
  password: 'uazkrgfcxhdfmlro',//process.env.SMTP_KEY || 'uazkrgfcxhdfmlro',
	//xoauth: 'asdfsadfs',
	//xoauth2: //'asdfasdfoCsL1fS6DxY7tD+Eau6fpgmnb8Fzzo/XtJ9NA6ExzqeoWR+mI6dkqMb2cw4rsoaNPXaPAC3+530u8ExYV5mjjPmF9I2KaQ7TyzQtu1xKxvKcofzustZb/fFIlPafseoUD7m3TYO6RWvfIzUXUqd6LiMuqEJzi642lvInOPtsTA0UQVsM+I/6EqXYtgNCt83Swk2kDgnoAClsFibpQUzwo28hBdr/4EZQAhaNwKquyAZNSt6YnPn7Qlx42wVIkGvBtDzAIrtKHQOdEL1KjKDzXWPxx0ojGppijzraSLVbx1DBBk6jGIbB3Uxx1LEV4nICxErpj/b+zM9xcCn0y881fgjaqRKu6BCI/kkNT4kVGds8JKljnrkNb9N4Lix6vmffHMxOYajUF1lXMIafRsjN0Cf5T8nrnqVron9jmrwr0zbiMUVRaE1sAWPXG8OkqomzOq3ZojV7tVbwgSHcUEwdOBmePwofwzlQL5iFwIrzpjuYjVS8FdtvLmhEivBS3EGavFCyT2b4UC',
	//_build_XOAuth2_token('bradofrado@gmail.com', 
	//),
  host: 'imap.gmail.com',//process.env.IMAP_HOST || '',
  port: 993,
  tls: true,
	debug: console.log,
	tlsOptions: {
		rejectUnauthorized: false,
		//servername: 'outlook.office365.com'
	}
};

const getEmails = () => {
  try {
    const imap = new Imap(imapConfig as unknown as Imap.Config);
		imap.once('ready', () => {
			imap.openBox('INBOX', false, () => {
        imap.search(['SEEN', ['SINCE', new Date('11/4/2023')]], (err, results) => {
					
          const f = imap.fetch(results, {bodies: ''});
          f.on('message', msg => {
            msg.on('body', (stream: Stream) => {
              simpleParser(stream, (err, parsed) => {
                const {from, subject, textAsHtml, text, inReplyTo} = parsed;
								if (subject?.toLowerCase().includes('medical request'))
                console.log(parsed);
                /* Make API call to save the data
                   Save the retrieved data into a database.
                   E.t.c
                */
              });
            });
            // msg.once('attributes', (attrs: {uid: string}) => {
            //   const {uid} = attrs;
            //   imap.addFlags(uid, ['\\Seen'], () => {
            //     // Mark the email as read after reading it
            //     console.log('Marked as read!');
            //   });
            // });
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