// started operating system process
console.log('first'); // this runs immediately in the main thread

setTimeout( () => {
    console.log('second') // this callback goes to the callback queue, even with 0ms timeout
}, 0) // 0ms timeout doesn't mean immediate execution - it still follows event loop rules

console.log('third'); // this runs immediately after setTimeout in the main thread
// completed and exited operating system process


/*
first
third
second
*/