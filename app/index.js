/*
* Primary file for API
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a string.
const server = http.createServer((req, res) => {
  // Grab URL and parse it.
  const parsedURL = url.parse(req.url, true);
  // Get path from URL.
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get query string as object

  const queryStringObject = parsedURL.query;

  // Get HTTP Method
  const method = req.method.toLowerCase();

  // Get headers as an object
  const headers = req.headers;

  // Get payload, if user sends one
  const decoder = new StringDecoder('utf-8');
  let payLoad = '';
  req.on('data', (data) => {
    payLoad += decoder.write(data);
  });
  req.on('end', () => {
    payLoad += decoder.end();

    // Route proper handler, if one is not found go to NotFound Handler

    const selectedHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct data object to send to handler

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payLoad
    }

    // Route the request to the handler specified in router
    selectedHandler(data, (statusCode, payLoad) => {
      // Use status code called back by handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler or default to empty object.
      payLoad = typeof(payLoad) == 'object' ? payLoad : {};

      // Convert payLoad to string
      const payLoadString = JSON.stringify(payLoad);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payLoadString);
      console.log('Returning this response', statusCode, payLoadString);
    });
  });
});

// Start the server, and have it listen on port.
server.listen(config.port, () => {
  console.log(`Server is listening on ${config.port} in ${config.envName} mode`);
});

// Define handlers

var handlers = {};

// Sample Handler
handlers.sample = (data, callback) => {
  // Callback and HTTP status code and a payload object
  callback(406, {'name' : 'My name is Sample Handler'});

}

// 404 Handler
handlers.notFound = (data, callback) => {
  callback(404);
}
// Define a request router
const router = {
  'sample': handlers.sample
}
