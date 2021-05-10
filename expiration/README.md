This service has only job: It is going to listen for order-created-event coming in. After specific timer, however how long we set up, expiration service will publish "expiration-complete" event. The goal is to tell Order Serice that one of the orders has expired.

When expireation service receives "order-created-event", inside this event "expiresAt" is already set. Expiration Service will be wathing this this property.

- We could not use setTimeOut because timer is stored in memory. If Expiration Service restarts for any reason, all the timers that we have been running are going to be lost.
- we are going to use the "bull.js" library. It allows us essentially setup a timer and store it in redis which is in-memory database.

## Bull Js

Here is an example what Bull is used for:

- Converting file from mp4 to MKV requres alot of processing power. Since it needs alot of processing power, we set up a worker server inside of our app that is completely standalone and separate from the web server. The goal of this worker server is to have some actual video conversion process
- Whenever someone makes a request to webserver, Bull inside webserver is going to enque something called "Job" which a plain js object similar to an event inside nats-streaming world. It describes some amount of processing that needs to be done on some particular thing. "BUll" is going to send the "JOb" object over to the Redis Server where redis stores list of jobs. We might have multiple worker services and each of those different worker servers are going to consitently pull that redis server and wait for some job appear. As soon as some job shows up, worker will pull that job off, do some processing on it and send a message back to the redis to say that the processing is complete.

Bull JS is inside the webserver and worker server as well. Bull is handling the entire process, setting up the initial JOb, processing it and send notification to redis server to say that the job is complete.

We are making use of Bull for delayed messaging aspect and to make sure that if the expiration service ever goes down, redis server will not go down.
