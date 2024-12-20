const https = require('https');
const fs = require('fs');
const util = require('util');
const http = require('http');
const httpProxy = require('http-proxy');
const tls = require('tls');
require('dotenv').config();


let connection_index=0;
const log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
const log_stdout = process.stdout;

const customLog = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};



process.on('uncaughtException', (err, origin) => {
	connection_index++
	customLog(err)
	customLog(`Caught exception: ${err}\n` +
	        `Exception origin: ${origin}`);
    customLog('connection index : ' + connection_index);
});

const certPath = process.env.CERT_PATH;
console.log(certPath)



const options = {
    SNICallback: function (servername, cb) {
        customLog(`Server name from SNI: ${servername}`);
        if (servername.includes('deskflot.com')) {
            cb(null, tls.createSecureContext({
                key: fs.readFileSync(`${certPath}privatekey_deskflotcom.pem`),
                cert: fs.readFileSync(`${certPath}certificate_deskflotcom.pem`),
                minVersion: 'TLSv1.2'
            }));
        } else if (servername.includes('deskflot.cc')) {
            cb(null, tls.createSecureContext({
                key: fs.readFileSync(`${certPath}privatekey_deskflotcc.pem`),
                cert: fs.readFileSync(`${certPath}certificate_deskflotcc.pem`),
                minVersion: 'TLSv1.2'
            }));
        } else {
            cb(new Error('No suitable certificate.'));
        }
    }
};



const proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong.');
});

const server = https.createServer(options, (req, res) => {
    
    let now = new Date();
    
    customLog('NEW CONNECTION');
    customLog(now.toUTCString());
    customLog('device : ' + req.headers['user-agent']);
    customLog('country code : ' + req.headers['cf-ipcountry']);
    customLog('url authority : ' + req.headers.host);
    customLog('connection index : ' + connection_index);
  
    const ip = req.connection.remoteAddress;
    customLog('ip address : ' + ip );
  
    // Log the referer URL
    const referer = req.headers['referer'] ? req.headers['referer'] : 'No referer';
    customLog('referer url : ' + referer);
    if (req.headers.host.includes('deskflot.com')) {
        proxy.web(req, res, { target: 'http://localhost:3000' });
    } else if(req.headers.host.includes('deskflot.cc')) {
        proxy.web(req, res, { target: 'http://localhost:4000' }); // replace with actual target
    } else {
        res.writeHead(200);
        res.end("hello world\n");
    }
  customLog('***************************');

});

server.listen(443, () => {
  customLog('Reverse proxy server running on http://localhost:443');
});



// this event is emitted on creation of the secure context, before the handshake
server.on('secureConnection', (tlsSocket) => {
	let now = new Date();
	customLog('A new secure connection was made.'+connection_index);
	customLog(now.toUTCString());
    const localAddressInfo = tlsSocket.address();
	customLog(`Local IP: ${localAddressInfo.address}`);
	customLog(`IP Family: ${localAddressInfo.family}`);
	customLog(`Local Port: ${localAddressInfo.port}`);
    customLog(`Client IP: ${tlsSocket.remoteAddress}`);

    connection_index++;

});
  
// this event is emitted when the handshake has been successfully completed
server.on('tlsClientError', (err, tlsSocket) => {
	let now = new Date();
	customLog('An error occurred during the handshake.' +connection_index );
	customLog(now.toUTCString());
	const localAddressInfo = tlsSocket.address();
	customLog(`Local IP: ${localAddressInfo.address}`);
	customLog(`IP Family: ${localAddressInfo.family}`);
	customLog(`Local Port: ${localAddressInfo.port}`);

	customLog(`Client IP: ${tlsSocket.remoteAddress}`);
	// customLog(tlsSocket)
	customLog(err.code);
	connection_index++;
});


/* reference */

/* https://nodejs.org/api/tls.html */