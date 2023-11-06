import type {Stream} from 'node:stream';
import Imap from 'imap';
import {simpleParser} from 'mailparser';

const _build_XOAuth2_token = (user='', access_token='') => Buffer
    .from([`user=${user}`, `auth=Bearer ${access_token}`, '', '']
    .join('\x01'), 'utf-8')
    .toString('base64');

const imapConfig = {
  //user: 'bradofrado@gmail.com',//process.env.SMTP_EMAIL || '',
  //password: 'eBay12345',//process.env.SMTP_KEY || 'uazkrgfcxhdfmlro',
	//xoauth: 'asdfsadfs',
	xoauth2: //'asdfasdfoCsL1fS6DxY7tD+Eau6fpgmnb8Fzzo/XtJ9NA6ExzqeoWR+mI6dkqMb2cw4rsoaNPXaPAC3+530u8ExYV5mjjPmF9I2KaQ7TyzQtu1xKxvKcofzustZb/fFIlPafseoUD7m3TYO6RWvfIzUXUqd6LiMuqEJzi642lvInOPtsTA0UQVsM+I/6EqXYtgNCt83Swk2kDgnoAClsFibpQUzwo28hBdr/4EZQAhaNwKquyAZNSt6YnPn7Qlx42wVIkGvBtDzAIrtKHQOdEL1KjKDzXWPxx0ojGppijzraSLVbx1DBBk6jGIbB3Uxx1LEV4nICxErpj/b+zM9xcCn0y881fgjaqRKu6BCI/kkNT4kVGds8JKljnrkNb9N4Lix6vmffHMxOYajUF1lXMIafRsjN0Cf5T8nrnqVron9jmrwr0zbiMUVRaE1sAWPXG8OkqomzOq3ZojV7tVbwgSHcUEwdOBmePwofwzlQL5iFwIrzpjuYjVS8FdtvLmhEivBS3EGavFCyT2b4UC',
	_build_XOAuth2_token('bradofrado@gmail.com', 
	'EwBAA+l3BAAUshnlKUacyQdQKOqcUGR00eGLdnwAAZ9+lpfGyPVjRXilBdLG6nuy+o/mLSOQzxSaZskzKrtyXxbSvpWaxd4M47/Ap2qOv0t6AxqgqNMdhLE6gWAf0hPgWf8q0My+QOhw6M3qxAM2TRCZSps54zOstZB1BpnhOQbQghiMF8dDnZOK8RVuphgHarV0j8+E1pYKKll+H9BRSH8HB1n97FbDRfRr1q0vKnm7dC8seEG+LuLjukT8hrb8o/6fErBFOsghyybLBclbQ+D55tU/EW/hjpQ3D3XT24wKgkD7SWDPqnpdMiZOWVExe9PjjqprAEgqpJ/wgKSsLvkkfesQy3j2aAuuzzs+RW4FJmWtLVv9SiXQhmezekQDZgAACLaF5c2TDdw8EALLp/tHm4Q0D6ytY9ALLiqeglQLIyk3elFvoqiF9ni6wzm29qs/AuAbupDbmB9juioP6bHZF1nL7fSg1SDUhNo170WknP9RvIijXgesXQTqsCK2qY5QdYhLQqQjvhinnAcKQYJsJBE5TYUq7byJmgPEk+JKVi6LJwjn7FKT8vkb4+rVb6lRC1xAwmb99n72wFpEeiU2yEcSMPQUFThee5bC2GWShG3Fugss/WWGpF55zlGFchww9Sh5NG0LUx0kW0JlueAqC5IvwE53P1NoUhld0ovDkSJ0ecQbxtKw0CTyPlP8CXtOPimfRnrg5+YGEDWdV7TSQxmSz9rTXXES8DLQ8ws6C5cf5n29CB32LV1dfUpInuFlBlkOpBc6fgtpwznohyX6mVGUZBcG9SNia0W7kM/86Nv2wP18ikV7PsfAzzRez7mN40ex8s942QbSWI89wT8zq/LKgjO09BTrPAQQcTec5PjWA/vNj2xNGSo58caDYMttqk6EtoCzhzzDPdW9NeP7CQRoxlhLMlLUt96TirgQvN7KcgThE+ATw1oQylqnMsHrSzbYJhlmWZg54tXAAD+c0vcwVnbUKOfq1qmlnyzyIHlCRRVxVCrUNIeA6X2qb25d2YPpJ+3m+AmGiBYAhXr/QhppI5vMKfYSLwlXDdOQolSs/sr3ncwHIb58aCxx9nZJR/Helz2iGenZDYREAg=='
	//'EwBAA+l3BAAUshnlKUacyQdQKOqcUGR00eGLdnwAAS1Iun1Es2q0birc9OA0gRbURgQfXv3/WTH0bTDgtqT2qesFJUMNzC6x0AkOWvGCIQ3mjg/4ZtTEk2QYWjwSmBxF6eqg8Aw5q0Xk9IaaUlrnPQsBfmBfbv52Zb9QXxwgcisCGnirhYROeTlsWA1WjDU8eFW1+YqgJmqAsdBFqSQbfodcbv2SrAEX0lADl+iR9U36uEA2wKzJAm3jEP6+lQsiWdyrqs46J2eyW8yMtsT2GGcr4FkVGfuOYgDxIrMqMMSxiHFciDYILxiWd7MrzCO5+Zyd6PGoD8SwCCy/cHQjTXcMSY40u+IVyvCE8MYLOqtVoOrRXBz4yBzWQxl23h0DZgAACEtRg4vjmD/AEAJY14wToH/uq5I+GdzCzLfbFYhjmpMvM6ucP3DQYQRFO05IuiFUr7f0oKwB3fgcNWkyMf8GzR+VlqTxRdHM3C/6dn4nzqkVuCZwPzTdA/wpW8xNulNC0/9OxQPVjk3LUs4YfwjhzzC0r9/rimnHt+7sqrxFUWBb0cp+XdutNGdjGJynqtvYK9Npl/I1aX8ooqzA7tqQg/OS3lIgOZQgYqsx8BC3WstssOJi8KsLMSG02oroNmXgwjLu9yMT8R3blqNwkdQNfpYpeKu+XyhUmj82fN9sx0Tapc0O/f4Q2zpEK0Faazmio7x2w2jTOoORR7ohO7p7W0VqA4LZglBITas6JS6UPkgpPWWHV+yCFi84eF/yworp43V2flA/N3SzR2BKX+CwxVXhzHNMEJID2J017VNoVrmg0DVmfjA3PVMfkKi7apoxSzdZ2V7tiJpdwM11wZZv2h+64EiH0xXYDBZSPZuw0iPjpj9mSxEGE4ptfSOTLEo/79W91gqFzAxy4m+oMZZxbZPmfhEEA/0FDb/geR7spBiWVq1oiI6JQbdQNX+VF4RKh2BzUl3woRUz+cBwEE2zdV6QUMGuzNrZdMrAev6MCE1aHo7Nctow6BZRtFuyiIJIrT9szeOhBpmn4586sAOyOfYVKDd1L5RVRFiKu9PO3XrcQOuylo1jDwe/Pt/hBBrafqo5MRGhOjfHbFFEAg=='
	//'EwBwA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAATmIW7GCaAK/xE2AwIu0IZ4llWgHde6jumyRRiVYNjVvXl+Wype1B3rsBXCB7pzQEQ9Zfep2CqTQ2uUctIBavFflpP2rmNAnfYnoReXlfrDfP+yMQi39D/WL2Xi85ZADUQQ3+KbtsWtRGiyFUyJwVFhgzWKarb60FCo5/GA+asImvlCwST2x677V4NLBNIhzCEQpR9u5Rul9b7NFFIRjXjzY5B4THNrs5QcZPgfe8WXJnZz1f5XZJ6Cr+gg6aCRHlbw8wOgfKlNGqv5jDkeUE/jUi2nsPksv5XANZzQnJuMKBeMEdxJWCSDvbCryhSHew1LHKAppREJcSI2AoVd0OIkDZgAACIcrmkr/XSgJQALDDSJNVpVi5bAaFABkSyc8AGl0wZLf6RyBLk9dVHFNSTKnQB7vx8YeRy4s1uGnN611Jfr9I2MNc745Xm/2UxDpWevPHTkcuqfgUQX1Bc/qFhxU3oGaq1CnlONYiI7xZQEExTeKGOMPj8dVZ0ccFvdGeGtLYyPOamvRfInPzKtRjTBQQ2Q3RWuKkvli4d8JD6D1Vka11T8dk0P1H581Mpqtk5oqKGpp1Efwc9qpFVCGnsHL3z9VCT9aYn+L0U2KESrDl/DvGlkSJdUrh17Phw7YbAR8M0ifwmHQJDZzDgHFz+Hod4Ng6BgxdclY4JaxUa4yV3A3hjp+6QHJrkHWsXdqKQ1d9cbs0sMyAGchmf0YraNwj/mekkS4FzeqdTMAfxf4zdnMy7jEH47uoqcD6VRXJoKxn4rGUrfs1N43n43BWrmATmu8NjllYfbTwJPn/vrFFePay+QE394o2x6nL3gf6bKer8DbLvhrr0wqF8unyiVdv7NIA8MKWvr3PYwE00AhdtUD+Lbmltasfzk4W9/adVrQDUzoG1YcmIxBh7kpx/ca4tTzwOrcNkQXDW8+Gg1CsLwjJLbsJapR2r/I8Njp7Z+PHBZ3CuplCYH1t30P1x1+EfPd38ISqh2zTfyRkEyyxLvzbWr+rr2xFNa9eveQM/8sv7yOmA0d2oxwcFJ+FjMpsqiDfg8Is0Da4a673c8Z7U5JfuLd8G0MYNJpLNrjysodngeXgGyHI5qov2e4R1adALt0PcszVGlIZbPz53GBAg=='
	//'EwB4A8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAAb9GPBSNlPSZnOsGP2X/KyxGtDGj8FHN12148R3k7Dq61UhLtvX5TSugJmGsOsETMaYIj1zwWRtLq23l0+GFrO/BboW9dEZkONJq5Nxi5gBUN/TwxWZUt6cDFoMDGa0PXfSKZl13gdFipd3FCc5F/HJ7HPVTDLCeJOIaojIHMAWGhh3vIwDIAlS3I6PtPbxe5SVnjrq7yJl9s46JeJSnvb+BOE0kH4R4SBAElgfNOpc86ky2pY8ujRT1yVcEHvNHE1XYsCRgvSM7b6vwnODxHky0g5O6jCWgbhkoBgPfuDWjaFyo1sWvXYiaQDXMNUIXkpdb5Y+6OOo552Lbkg6gfDoDZgAACC/yXOPfl5OrSAJd3Kj3kddc+nDmcMQgDESAtIljyj4JmwLFBcL62T0mnyrOyfqixeyWQ35pT1/gGdkO0updozwqL4vFhVm8HBBpZs9kc25QanaJztCZ4oX6poMi+OtA8RS+kDbWQFYjohDDtP2xtf/ZpmJ/aajpTBz0QKteEvb7KCjrWeGCVA4Www0xroMWSmN9Z/9/xZEhjxJzNdC/TAnh3dcYURX2ocpMjj0A7HwIaGN5e2lsuswhv6L4otvAcHvFruU47yu1S/qXdp3TBUwcPmtan3Bjy9yRR0A8LzzFzi5DTsOzjfQyEmykBCC+wW4YonYzGEgC166ca0FVySxGeiYG2on4/jZd7vSd/KPmNJIZsnse5Jwdoi1Gsw9OP3y80zD/QYpB7BmIbas+auvg7vqsbvhKCEssfuocZHf7f0mUwGQDmd112V7KKE1Opdq7WxkEDIC54Tue/U+sqiilO7GEInyp/kD+hlB3XS+FnedsDqgRx6ijk+fX1tNWIwK+/GF/BwC2OP5e2prBKrfQmHCQJXCgyU4w3cg7A/8PncYAoilADTDCJk/4k0cGJP7EWvWqrXmKYIJBWf8mlYbpyjiGu4AJ3wLLwvMu6LAeEXILHPn6yJt5ucQJ2wOCup+6t1h/sK91SMJszWmYgOuBYBZlxLbfhbFTONvAaFNPEEB30iaPUXvl9esYBIeIopkMgLLkxdiIzWeglAW5+MSGOeoa5pghAKIbvIBkE1PHZvkqFhwFL1eV5ZVR2p066H1wBkVDqzIYxm8Y2ESNj2gfooUC',
	//'EwBoA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAASczbt6zpPg1BetX3Of/Z4ceFvJlOBB3mf22nJGN7F35XuEVjwNsbfOOPyRsHziSbUP6UKG7EwJgQBOO2zebsgcsGxIOkPUaQMUSQolZfaLNpadk1tuIy62yfn/ahK42AELDjIglCUHQyS59yyq0+vgmTEaSC1mFjE3MIgs7nkdqNlUIjp/QJDATQe4zQcO9Ep6GRuGF9uTELWmVCrZhqAu5TCsaQh+aLExJP8D0BkbUno6Puu8+7Xs4aXX/kB/B93t9EfKKZxEOXqq1uOZZmDQNmIoDjtahXh/uTJ4jl5SdFRzvEVGZ8IlNdPUIXUVmie/v/XsWXQRWjdFLIDMw7j8DZgAACDbvcG1YuR6bOAL14M/xI9ajOcEhrZf6x+PPCRXlK7Flw6wqbcXNTP9rsqGzGYk7OnouD/JEyyEKXZS1zw1t4Rz9Fm+pdpT5pdNAgA7QRirVATHW6Jbcze2kKYjWe/sgkpl3HZoZuhT3V46TznWj0hzOWvpQecxLkkfvgGj1Q7z070FP02b4Ap9gxIyze3eyZOU+VjMpiBdefjnotPNuKFVY1JD3/1n2SWYsy07AJjhYG82wniG8tU/T3IoJ0lpoqVHOKsCNr86kog6Zr++lI4VkvFeleSgX7KH/VEQNal+mHGuzTxeQEPQIH/7fpYgv/mf1JS95ZGicPEVwN8CtSNk0nT60tDRU4rNZIeDyjvUqwVeWzyRUz3Jhq4g0R15EC1uAjo6Ao1KVaWUvZddi0jczGeyHTRTslFtDG7jQubwBK9v9Wu8H4rNtpcVSFJFC0RQPgfWoIJsXA0ZdTAvXytkwJPnjVqz8kahK44r33zt0+UzcNnxr3pXqUTCSnqx/l2JJnMMZVw+2i99As2OwWJlZb8Ut9HPbXz6ky6HCbWffjYIlZSJWvLKMX7tX/o0GNt8WHfjIYbndyKB/hchIsT6KncFD6UDOunS6LHysv4WzYNTxgSvX4xFJs3AFXi3YzGljXj8wxyc4/oql7vboL5m4yay1G49xIg4bwjz6UBmFlfoPPsH8VJqzG51ZyUcXLhUFaXzciuqmAs9mfas8lnPHh+UEHXGyK6UgPPNzuYPmrlha6Vfy914KOrDley+MUrbPfgI=',
	//'EwB4A8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAAagJY0G9oPWvmpdOJJ3UyEXqnKKCAYEkfqvA+M4a64yt3Nld0Kb6fWYi9cnCUGRNydJI2aKfpU92y+oEk1eFIlR0CpwJX0OlHP4TOhbmrnJJHOYvFp5NCms++T73Uw2dKwD7exKjEuSHRYgvMAjImZ56YrZrFqo2OP1PJtIzX/o7Zi1GPEfS4ccygnYnDqiNj7gn7TUFosuC2C1F5JeJO8DLzHJCf0q1ONYSWjOofHK9Z8J1U2ujxFcCuY6tqkjsrUfxXdOuWsUwLTSAP/pMnX8QsqQhJqLDYEpMVCpYoxSx44s+G2COsspQOvpeWJGMd9i45x0WOtwj/pAIjV7Ed5EDZgAACIP7LPDFUYn9SAL4yWamtJA8zLXHNkHzzlGfe714pbP6LUOpjdfrgBKnTH7VsI5rxC6jbcEhst5XIQDT4ljw4bIVyHVmXwBct6XkRymS6kpBkkVx16iLPmEX9gWwFUsXjD6SMX7B+kOZdoFnK9HLbZlEn0QGAUq5am9HS5hrSVR6dfYIPYCLDxR9+K+xmyKyZ+CBlw8LIk414otgFrdh33EId6roUlYfEnv0dZEKhiDU/b+FZBVmS5lp0nlUe2h/ilG+D5G8EPC+z/2k+AoCsL1fS6DxY7tD+Eau6fpgmnb8Fzzo/XtJ9NA6ExzqeoWR+mI6dkqMb2cw4rsoaNPXaPAC3+530u8ExYV5mjjPmF9I2KaQ7TyzQtu1xKxvKcofzustZb/fFIlPafseoUD7m3TYO6RWvfIzUXUqd6LiMuqEJzi642lvInOPtsTA0UQVsM+I/6EqXYtgNCt83Swk2kDgnoAClsFibpQUzwo28hBdr/4EZQAhaNwKquyAZNSt6YnPn7Qlx42wVIkGvBtDzAIrtKHQOdEL1KjKDzXWPxx0ojGppijzraSLVbx1DBBk6jGIbB3Uxx1LEV4nICxErpj/b+zM9xcCn0y881fgjaqRKu6BCI/kkNT4kVGds8JKljnrkNb9N4Lix6vmffHMxOYajUF1lXMIafRsjN0Cf5T8nrnqVron9jmrwr0zbiMUVRaE1sAWPXG8OkqomzOq3ZojV7tVbwgSHcUEwdOBmePwofwzlQL5iFwIrzpjuYjVS8FdtvLmhEivBS3EGavFCyT2b4UC',
	//'EwBoA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAAQR4dqlsu1/UMWUVV5YBzTfnOKdZ5mnTd1tj9gPR4J3VdM+BEPTj0CEKOTAVsw6G2xhLcNCSBGu4gib8lJQaaDUsQfrxkD3ujldG2GemqsVSqLcuukiniSHX2SLwm+uBBK1V2483K+HIrFWdTHI60c7kpCUd5Qt5XBSYN1InP5/zJIWF26us/30q98XZ8kaM2KN1nFFZMuRuQsF0I6alT9987a5tEADOZyiQ5CJb27dTLF0BJKhvmnd6nXXkVVi3dxG9pLByz47fXOoKSRqIiUPHWmaabaf1sZmKXCZzRusVFfcLcll+MWbacZ1ZQMMANatmbcLxo1UXMrbC6jYyxHIDZgAACICWpWO3zW8oOAJDGWzb0MWOZZigrZoH6Fo/80lTXnwKVA2lv74CBimVHPh+/elPwRNZ8yq4FApowNrN/7Dpiq54t5fDfBqB+8M062y2SqsCfj0XCEijy5HHSeI8tq20NE2Oa+licZu+W/uxgLMNYbKSfRwGymPA7coIytFbeKfI5g3uN5+mEE/t0qFi29vpuJE3Lx7RgdmCztCC7hTJhPUD9mz1GOD/4+QWUNd33nAVb2tB0lYPnUGSOj0NG+RvJaiyOd+q7w1D84VUVLh51fvLd1MwcscgtHvDiYBlcSgijrY6GDbviwRcQ2E1xMBr2n14sAmPI/iXFydcUm51s8ZZHKIdl4BVd5bPLHAKCim5mihBAFU+i8jF63+TUp6UJoZ45P1Qpz5LQa6klqgaH+4ABVd34Dxd9dlDGFGvpeVxaTTyN8+HNYcXIcLQNbqVAP5jGCnAPcdo39j/dRokdJNzqRDtkx4Jqswq2CXAyYfJlaWLj5mvW80yR51SU8g/9gkSV/o0ogSjuUMy9nJEgsFIc4Z0xiy9D7TBB2qHIQsLeQem92HedBVVLuJAIE7xIjd+E7+nJQsq7x1v/jchDXbugDU7Ykgb68vYhqk4pf2Uy1r1QsUXg5KxYIuvA57XiydX7H5iRgISxkOXR0rBjgZ83ASWLeEwaCON9JiYkckLF2r/Yr8NxnGoP7y8uC5dYG9SI9adEw8CO0sKJlZmh5XvgIiglZdc7/l1mIN4Wdpf1rgamGkbJAAvOO+G8e/14cSHfgI=',
	),
  host: process.env.IMAP_HOST || '',
  port: 993,
  tls: true,
	debug: console.log,
	tlsOptions: {
		rejectUnauthorized: false,
		servername: 'outlook.office365.com'
	}
};

const getEmails = () => {
  try {
    const imap = new Imap(imapConfig as unknown as Imap.Config);
		imap.once('ready', () => {
			imap.openBox('INBOX', false, () => {
        imap.search(['SEEN', ['SINCE', new Date()]], (err, results) => {
					
          const f = imap.fetch(results, {bodies: ''});
          f.on('message', msg => {
            msg.on('body', (stream: Stream) => {
              simpleParser(stream, (err, parsed) => {
                const {from, subject, textAsHtml, text, inReplyTo} = parsed;
                console.log(inReplyTo);
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