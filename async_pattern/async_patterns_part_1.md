# Asynchronous Patterns in Node.js - Part 1: Understanding the Problem

## Introduction to Asynchronous vs Synchronous Approaches

All right, and up next I would wanna talk about asynchronous patterns in Node.js.

If we remember, when we were setting up the file system module, we covered how we have two flavors:
- We have the synchronous one
- And the asynchronous one

While a synchronous approach is great since we're not blocking the event loop, the problem is that if we're using this callback approach, it gets messy pretty quickly. We end up nesting one callback inside of the other one.

In the following videos, I would want to show you the alternative that we'll use throughout the course, and why in my opinion, it is much cleaner syntax and that's why of course we'll use it.

## Setting Up Our Environment

First what I would want is just to kill everything here. I'll start with the nodemon, since I'm done showing you the event loop. And we're just gonna go with `npm start`.

Now I'll delete everything that I currently have. I'll leave the async one, but I would wanna remove everything in the app.js.

## Demonstrating Event Loop Blocking

Now I just want to quickly show you the code that would block that event loop. Again, this is gonna be the video where if you don't wanna code along, you don't have to. You can just sit back and relax, and effectively you'll be in good shape.

Again, we'll set up the server. Like I mentioned before, already 20,000 times, don't worry about specific commands. We have rest of the course where we'll be building servers. So, trust me, you'll get sick of it.

```javascript
const http = require('http');

const server = http.createServer((request, response) => {
  // Request handling logic will go here
});

server.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
```

Then, of course, in my callback function, I would wanna check all the URLs. I would wanna show you how even if we try to get a different resource, we're still blocked by other users if they are requesting some kind of resource where we have the blocking code.

Don't worry if this sounds like gibberish, you'll see what I mean in a second.

## Handling Different Routes

On the request object we could check for the URL. So, effectively you could check what is the resource that the user is requesting. For example, homepage would be forward slash, and then the about page would be forward slash and about.

This is sitting in the property by the name of `request.url`.

```javascript
const server = http.createServer((request, response) => {
  if (request.url === '/') {
    response.end('homepage');
  } else if (request.url === '/about') {
    // Blocking code will go here
    response.end('about page');
  } else {
    response.end('error page');
  }
});
```

## Demonstrating Blocking Code

Now, the problem is gonna be if I go to 'about', and if I set up some kind of blocking code.

What would be a blocking code? Well, that could be a nested for loop:

```javascript
else if (request.url === '/about') {
  // Blocking code!!!
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      console.log(i, j);
    }
  }
  response.end('about page');
}
```

Now, million dollar question, what do you think is gonna happen? If the user navigates to about, we can kind of see that this will take some time. 

You would expect that only the user who navigates here gets blocked and you'd be wrong. We'll also block the other users who are just trying to get to the homepage.

So, I run this one and notice how we're loading. Now, the same thing happens here now, and here. And only when we are done with the blocking code, then these other requests can get the resource again.

Now of course, if I go to my project, I can see that in the console, I have all these values, right? Because I have this blocking code. I have the synchronous code that just takes a long time.

## The Case for Asynchronous Code

This is just a representation of why we prefer asynchronous code. Now yes, at the moment this is messy, and don't worry, in the next videos we'll fix it. But this hopefully gives you an idea why you should always strive for setting up your code asynchronously.

Because, what we've learned in the previous videos, if we do that, then those tasks are offloaded. And then, only when the data is back, only when it's ready, then we invoke it. And that way, we're not blocking the other users.

Hopefully, it is clear. And now of course, let's take a look at some other patterns we can use. So, we still get the benefits, so we're not blocking that event loop, but we also have a cleaner code, where we don't have this nested callback mess.