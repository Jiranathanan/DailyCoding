// setInterval registers a callback function to run repeatedly at the specified interval
setInterval(() => {
    console.log('hello world')
    // This callback will be executed every 2000ms (2 seconds)
    // Each time the timer triggers, this callback is placed in the callback queue
    // When the call stack is empty, the event loop moves it to the stack for execution
}, 2000)

// This synchronous code runs immediately
console.log('I will run first')

// Important Node.js behavior notes:
// 1. The process stays alive because setInterval is an active timer
// 2. The event loop keeps running, waiting for the next interval
// 3. Process will only terminate if:
//    - Manually killed (ctrl+c)
//    - An unexpected error occurs
//    - clearInterval() is called on the interval ID