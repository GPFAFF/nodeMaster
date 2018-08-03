/*
* Primary file for API
*
*/

// Dependencies
const http = require('http');
const url = require('url');

// The server should respond to all requests with a string.
const server = http.createServer((req, res) => {
  console.log(req);
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

  // Send response from URL.
  res.end('Yo dude\n');
  // Log what path the person was asking for.
  console.log(`Request is received on this path: ${trimmedPath} with this method: ${method} and with this queryString`, queryStringObject);
  console.log('Header requests', headers)
});

// Start the server, and have it listen on port.
server.listen(4444, () => {
  console.log('Server is listening on PORT 4444');
});

