const http = require('http');  // Import Node.js HTTP module

// Create an HTTP server
// The callback function is registered to run whenever an HTTP request is received
// This is an event-driven, asynchronous approach
const server = http.createServer((req, res) => {
    console.log('request event');  // Log when request is received
    res.end('Hello World');  // Send response back to client
    // After sending the response, this function completes
    // But the server continues listening for more requests
})

// Start the server on port 5000
// The second argument is a callback that runs when server is ready
server.listen(5000, () => {
    console.log('Server listening on port: 5000...');
})

// IMPORTANT EVENT LOOP CONCEPTS:
// 1. This process doesn't exit after the code runs
// 2. The server.listen() creates a persistent listener
// 3. The event loop keeps running, waiting for HTTP requests
// 4. Each request is handled as an event through the callback
// 5. Node can handle many concurrent connections through this mechanism