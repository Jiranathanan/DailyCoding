const { readFile } = require('fs');

// This line executes first in the main thread
console.log('started a first task');

// readFile is an asynchronous operation
// When Node.js sees this, it delegates the file reading to the operating system
// Then it continues executing the rest of the code WITHOUT waiting for the file read to complete
readFile('./content/first.txt', 'utf8', (err, result) => {
    // This callback function is placed in the "callback queue"
    // It will only execute after:
    // 1. The file is completely read
    // 2. The call stack is empty (main program finished)
    // 3. The event loop picks it up from the queue
    
    if(err) {
        console.log(err);
        return
    }
    
    // These lines only execute after the file is successfully read
    // By this time, the other console.log statements have already executed
    console.log(result);
    console.log('completed first task');
})

// This executes immediately after the readFile line
// It doesn't wait for the file reading to complete
console.log('starting next task');

/* Output explanation:
1. "started a first task" - Prints first (synchronous code in main thread)
2. "starting next task" - Prints second (still synchronous code in main thread)
3. [At this point, Node.js is still waiting for the file to be read by the OS]
4. "Hello this is first text file" - Prints third (after file is read and callback executes)
5. "completed first task" - Prints last (part of the same callback)

This demonstrates how Node.js doesn't block execution while waiting for I/O operations.
The event loop allows Node.js to perform non-blocking I/O operations despite JavaScript
being single-threaded.
*/