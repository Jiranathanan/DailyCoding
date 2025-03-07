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
