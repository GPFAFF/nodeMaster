/*
* Primary file for API
*
*/

// Dependencies
const http = require('http');

// The server should respond to all requests with a string.

const server = http.createServer((req, res) => {
  res.end('Yo dude\n');
});

// Start the server, and have it listen on port.
server.listen(4444, () => {
  console.log('Server is listening on PORT 4444');
});

