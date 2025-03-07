# DailyCoding

# Understanding JavaScript's Event Loop

## Introduction

This repository demonstrates how asynchronous operations work in JavaScript through Node.js's event loop. The event loop is a fundamental concept that enables JavaScript to perform non-blocking operations despite being single-threaded.

## Basic Concept

JavaScript executes code in a single thread, which means it can only do one thing at a time. However, operations like reading files or making network requests can take a long time to complete. Instead of blocking the entire program while waiting, JavaScript uses an asynchronous approach.

## Example Code

Here's a simple example demonstrating asynchronous file reading:

```javascript
const { readFile } = require('fs');

console.log('started a first task');

readFile('./content/first.txt', 'utf8', (err, result) => {
    if(err) {
        console.log(err);
        return
    }
    console.log(result);
    console.log('completed first task');
})
console.log('starting next task');
```

## Output

When you run this code, you'll see:

```
started a first task
starting next task
Hello this is first text file
completed first task
```

## How It Works

### 1. Synchronous Execution
First, JavaScript executes the code line by line:

```javascript
console.log('started a first task');
```

This outputs "started a first task" immediately.

### 2. Asynchronous Operations
When JavaScript encounters an asynchronous operation like `readFile()`:

```javascript
readFile('./content/first.txt', 'utf8', (callback function))
```

It doesn't wait for the file reading to complete. Instead:
- The operation is delegated to the operating system
- JavaScript continues executing the next lines of code
- The callback function is registered to be executed later

### 3. Continued Execution
JavaScript continues to the next line:

```javascript
console.log('starting next task');
```

This outputs "starting next task" while the file is still being read.

### 4. Event Loop
After the main code finishes executing, the event loop starts monitoring for completed asynchronous operations:
- When the file reading finishes, its callback function is placed in the callback queue
- The event loop checks if the call stack is empty
- If the call stack is empty, it takes the callback from the queue and puts it on the stack for execution

### 5. Callback Execution
The callback function runs, outputting:

```
Hello this is first text file
completed first task
```

## Key Takeaways

1. **Non-blocking I/O**: JavaScript doesn't halt execution while waiting for I/O operations.
2. **Single-threaded but concurrent**: JavaScript can handle multiple operations concurrently through the event loop.
3. **Execution order**: Code outside callbacks runs before code inside callbacks, regardless of how fast the asynchronous operation completes.
4. **Call stack & callback queue**: The event loop monitors these to manage execution flow.

## Visualization

The JavaScript runtime can be visualized with these components:

```
┌─────────────────────────┐
│        Call Stack       │
└─────────────────────────┘
          ↑    ↓
┌─────────────────────────┐
│        Event Loop       │
└─────────────────────────┘
          ↑    ↓
┌─────────────────────────┐
│      Callback Queue     │
└─────────────────────────┘
```

## Further Learning

To deepen your understanding of the event loop:
- Explore Node.js documentation on asynchronous programming
- Learn about Promises and async/await syntax
- Study the differences between microtasks and macrotasks


-------------------------------------------------------------------------

# Understanding JavaScript's Event Loop with setTimeout

## Introduction

This document explores how JavaScript's event loop handles the `setTimeout` function, even with a zero-millisecond delay. Understanding this behavior is crucial for grasping JavaScript's asynchronous nature.

## Example Code

```javascript
// started operating system process
console.log('first');

setTimeout(() => {
    console.log('second');
}, 0);

console.log('third');
// completed and exited operating system process
```

## Output

When you run this code, you'll see:

```
first
third
second
```

Despite setting a timeout of 0 milliseconds, "second" is printed last. Let's understand why.

## How It Works

### 1. Synchronous Execution Begins

The JavaScript engine starts executing the script line by line:

```javascript
console.log('first');
```

This immediately outputs "first" to the console.

### 2. setTimeout Encountered

When the engine encounters `setTimeout`:

```javascript
setTimeout(() => {
    console.log('second');
}, 0);
```

Even though the timeout is set to 0ms:
- The callback function is not executed immediately
- It's sent to the Web APIs environment (in browsers) or the C++ APIs (in Node.js)
- After the minimum delay (0ms in this case), it's moved to the callback queue
- It waits in the queue until the call stack is empty

### 3. Execution Continues

The engine continues with the next line:

```javascript
console.log('third');
```

This immediately outputs "third" to the console.

### 4. Main Thread Completes

Now the main thread's execution is complete.

### 5. Event Loop Takes Over

The event loop checks if:
- The call stack is empty (it is)
- There are callbacks in the queue (there is one)

It then moves the callback from the queue to the call stack.

### 6. Callback Execution

The callback function runs, finally outputting:

```
second
```

## Key Insights

1. **setTimeout(fn, 0) is not immediate**: Even with a 0ms timeout, the callback goes through the event loop.

2. **Minimum delay, not exact timing**: The 0ms represents a minimum delay, not an exact time when the callback will execute.

3. **Call stack priority**: All synchronous code in the call stack executes before any callbacks in the queue.

4. **Event loop's role**: The event loop only processes callbacks from the queue when the call stack is empty.

## Visualization

```
┌─────────────────────────┐      ┌───────────────────┐
│ console.log('first');   │─────>│ Output: "first"   │
└─────────────────────────┘      └───────────────────┘
             │
             ▼
┌─────────────────────────┐      ┌───────────────────┐
│ setTimeout(callback, 0) │─────>│ Web/C++ APIs      │
└─────────────────────────┘      └───────────────────┘
             │                            │
             ▼                            ▼
┌─────────────────────────┐      ┌───────────────────┐
│ console.log('third');   │─────>│ Output: "third"   │
└─────────────────────────┘      └───────────────────┘
             │                            │
             ▼                            ▼
┌─────────────────────────┐      ┌───────────────────┐
│ Call Stack Empty        │      │ Callback Queue    │
└─────────────────────────┘      └───────────────────┘
             ▲                            │
             │                            │
             └────────────────────────────┘
                     Event Loop
                           │
                           ▼
                  ┌───────────────────┐
                  │ Output: "second"  │
                  └───────────────────┘
```

## Applications

Understanding this behavior is critical when:
- Debugging timing issues in JavaScript
- Working with user interactions and UI updates
- Optimizing performance in JavaScript applications
- Managing execution order in complex asynchronous code

## Summary

Even though `setTimeout` with a 0ms delay might look like it should execute immediately, JavaScript's event loop ensures that it only runs after all synchronous code completes. This demonstrates the fundamental asynchronous nature of JavaScript, where the event loop continuously checks for tasks to execute once the call stack is clear.

--------------------------------------------------------------------------------------
# Understanding JavaScript's Event Loop with setInterval

## Introduction

This document explains how JavaScript's event loop handles the `setInterval` function and why the Node.js process continues running indefinitely when using timer functions.

## Example Code

```javascript
setInterval(() => {
    console.log('hello world')
}, 2000)

console.log('I will run first')
// process stays alive unless killed with ctrl+c
// or an unexpected error occurs
```

## Output

When you run this code, you'll see:

```
I will run first
hello world  // appears after 2 seconds
hello world  // appears after 4 seconds
hello world  // appears after 6 seconds
...continues indefinitely
```

## How It Works

### 1. Initial Execution

JavaScript begins executing the code line by line:

```javascript
setInterval(() => {
    console.log('hello world')
}, 2000)
```

When the engine encounters `setInterval`:
- It registers the callback function with the timer mechanism (part of the Node.js C++ APIs)
- It sets up a recurring timer that will fire every 2000 milliseconds (2 seconds)
- It does NOT wait for the timer to complete before moving on
- The JavaScript engine continues to the next line immediately

### 2. Synchronous Code Executes

The next line executes right away:

```javascript
console.log('I will run first')
```

This immediately outputs "I will run first" to the console.

### 3. Main Script Completes

At this point, the main script has finished executing all synchronous code.

### 4. Process Stays Alive

Unlike with a script that only has synchronous code, the Node.js process **does not exit**. This is because:
- The `setInterval` function has registered an active timer
- Node.js knows there is a recurring callback that needs to be executed
- The event loop stays active, waiting for the timer to trigger

### 5. Event Loop Continues Running

Every 2 seconds:
- The timer triggers and places the callback in the callback queue
- The event loop checks if the call stack is empty
- If it's empty, the callback is moved to the call stack and executed
- "hello world" is printed to the console
- The process repeats indefinitely

### 6. Process Termination

The only ways the process will terminate are:
- Manual termination with Ctrl+C
- An unhandled exception occurs in the callback
- The process is killed externally

## Key Insights

1. **Persistent Timers**: `setInterval` creates a persistent timer that keeps the Node.js process alive.

2. **Event Loop Never Empties**: With `setInterval`, there's always another callback waiting to be executed in the future, so the event loop never completely empties.

3. **Asynchronous vs. Main Thread**: The "I will run first" message demonstrates how synchronous code always executes before the asynchronous callbacks.

4. **Process Lifecycle**: Understanding why the process stays alive is crucial for server applications and background tasks.

## Visualization

```
┌─────────────────────────┐      ┌───────────────────────────┐
│ setInterval(cb, 2000)   │─────>│ Timer (Node.js C++ APIs)  │
└─────────────────────────┘      └───────────────────────────┘
             │                                 │
             ▼                                 │ (after 2000ms)
┌─────────────────────────┐                    ▼
│ console.log('I will...  │      ┌───────────────────────────┐
└─────────────────────────┘      │ Callback Queue            │
             │                    └───────────────────────────┘
             ▼                                 │
┌─────────────────────────┐                    │
│ Main Script Complete    │                    │
└─────────────────────────┘                    │
             │                                 │
             ▼                                 │
┌─────────────────────────┐                    │
│ Event Loop Active       │<───────────────────┘
└─────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│ Execute Callback        │
└─────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│ Output: "hello world"   │
└─────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│ Timer Resets (2000ms)   │
└─────────────────────────┘
             │
             └─────────────► (Process repeats)
```

## Differences from setTimeout

Unlike `setTimeout` which executes once and is done, `setInterval`:
- Continues to trigger at regular intervals
- Keeps the Node.js process alive indefinitely 
- Must be explicitly cleared with `clearInterval()` if you want it to stop

## Practical Applications

This behavior is essential for:
- Creating server applications that need to stay running
- Implementing polling mechanisms that check for changes periodically
- Scheduling recurring tasks (like cleanup operations)
- Building applications that need to perform operations at regular intervals

## Summary

When using `setInterval`, the JavaScript event loop remains active, keeping the process alive until explicitly terminated. The callback function executes repeatedly at the specified interval, with each execution following the standard event loop rules - waiting for the call stack to be empty before executing.

-------------------------------------------------------------------

# Event Loop and HTTP Server in Node.js

## Introduction

This document explains how Node.js uses the event loop to handle HTTP requests in a non-blocking manner, allowing it to serve multiple clients concurrently despite running on a single thread.

## Example Code

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    console.log('request event');
    res.end('Hello World');
})

server.listen(5000, () => {
    console.log('Server listening on port: 5000...');
})
```

## How It Works

### 1. Server Creation and Initialization

When you execute this code:

```javascript
const http = require('http');
```
- Node.js loads the HTTP module, which provides functionality for creating and managing HTTP servers.

```javascript
const server = http.createServer((req, res) => {
    console.log('request event');
    res.end('Hello World');
})
```
- This creates an HTTP server object
- The callback function is registered to handle any incoming HTTP requests
- The function is not executed immediately - it's stored for future execution

### 2. Server Starts Listening

```javascript
server.listen(5000, () => {
    console.log('Server listening on port: 5000...');
})
```

- This tells Node.js to start listening for HTTP connections on port 5000
- The callback function runs once the server has successfully started
- "Server listening on port: 5000..." is printed to the console
- The server is now active and waiting for connections

### 3. Event Loop Keeps the Process Alive

At this point:
- The main script has finished executing
- However, the Node.js process **does not exit**
- The server's active listener keeps the event loop running
- Node.js continues to wait for incoming HTTP requests

### 4. Handling Incoming Requests

When an HTTP request comes in:
- The operating system accepts the connection
- Node.js creates `request` and `response` objects
- The callback function is placed in the callback queue
- The event loop moves the callback to the call stack when it's empty
- The callback executes, logging "request event" and sending "Hello World" to the client
- After handling the request, the server continues listening for more requests

## Event Loop Flow Visualization

```
┌─────────────────────────┐
│ Script Execution        │
│ (Create server)         │
└─────────────────────────┘
             │
             ▼
┌─────────────────────────┐      ┌───────────────────────────┐
│ server.listen(5000)     │─────>│ Output: "Server listening  │
└─────────────────────────┘      │ on port: 5000..."         │
             │                    └───────────────────────────┘
             ▼
┌─────────────────────────┐
│ Main Script Complete    │
└─────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│ Event Loop Active       │◄──────────┐
└─────────────────────────┘            │
             │                         │
             │                         │
             │     ┌───────────────────┘
             │     │ (keeps server alive)
             ▼     │
┌─────────────────────────┐      ┌───────────────────────────┐
│ Wait for Events         │◄─────┤ HTTP Connection Received  │
└─────────────────────────┘      └───────────────────────────┘
             │                              │
             ▼                              │
┌─────────────────────────┐                 │
│ Execute Request Handler │◄────────────────┘
└─────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│ Output: "request event" │
└─────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│ Send "Hello World"      │
└─────────────────────────┘
             │
             └─────────────► (Return to waiting)
```

## Key Concepts

### 1. Server is Event-Driven

The HTTP server in Node.js is fundamentally event-driven. It:
- Sets up event listeners for incoming connections
- Processes each request as an asynchronous event
- Returns to a waiting state after handling each request

### 2. Single-Threaded but Concurrent

Despite running on a single thread, Node.js can handle multiple concurrent connections because:
- I/O operations (like network connections) are non-blocking
- The event loop efficiently processes events as they complete
- While waiting for one client, it can serve others

### 3. Process Longevity

The HTTP server keeps the Node.js process alive indefinitely because:
- The server's listener represents an active operation
- The event loop continues running as long as there are potential future events
- Unlike scripts that exit when done, servers are designed to run continuously

## Practical Implications

1. **Scalability**: A single Node.js server can handle thousands of concurrent connections.

2. **Resource Efficiency**: Unlike traditional servers that might create a new thread per connection, Node.js manages multiple connections on a single thread.

3. **Responsiveness**: The non-blocking nature ensures the server remains responsive even under high load.

4. **Long-Running Applications**: This model is ideal for web servers, API servers, and other services that need to run continuously.

## Summary

Node.js's HTTP server demonstrates the power of the event loop for creating efficient network services. The server initializes, starts listening, and then enters an event-driven mode where it continuously processes incoming requests as they arrive, all without blocking the single JavaScript thread.
