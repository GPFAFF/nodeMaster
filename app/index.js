/*
* Primary file for API
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
// const _data = require('./lib/data');

// // Testiing
// _data.delete('test', 'newFile', (error) => {
//   console.log(`this was the error - ${error}`);
// });

// Instatitating the server should respond to all requests with a string.
const httpServer = http.createServer((req, res) => {
  unifiedServers(req, res);
});

// Start the server, and have it listen on port.
httpServer.listen(config.httpPort, () => {
  console.log(`Server is listening on ${config.httpPort} in ${config.envName} mode`);
});

const httpsServerOptions = {
  'certificate': fs.readFileSync('./https/cert.pem'),
  'key': fs.readFileSync('./https/key.pem'),
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServers(req, res);
})

httpsServer.listen(config.httpsPort, () => {
  console.log(`Server is listening on ${config.httpsPort} in ${config.envName} mode`);
});

// Unify servers
const unifiedServers = (req, res) => {
  // Grab URL and parse it.
  const parsedURL = url.parse(req.url, true);
  // Get path from URL.
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get query string as object
  const queryStringObject = parsedURL.query;

  // Get HTTP Method
  const method = req.method.toLowerCase();

  // Get headers as an object
  const headers = req.headers;

  // Get payload, if user sends one
  const decoder = new StringDecoder('utf-8');
  let payLoadData = '';
  req.on('data', (data) => {
    payLoadData += decoder.write(data);
  });
  req.on('end', () => {
    payLoadData += decoder.end();

    // Route proper handler, if one is not found go to NotFound Handler
    const selectedHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct data object to send to handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(payLoadData)
    }

    // Route the request to the handler specified in router
    selectedHandler(data, (statusCode, payLoad) => {
      // Use status code called back by handler, or default to 200
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

      // Use the payload called back by the handler or default to empty object.
      payLoad = typeof (payLoad) === 'object' ? payLoad : {};

      // Convert payLoad to string
      const payLoadString = JSON.stringify(payLoad);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payLoadString);
      console.log('Returning this response', statusCode, payLoadString);
    });
  });

}

// Define a request router
const router = {
  'ping': handlers.ping,
  'users': handlers.users,
}
