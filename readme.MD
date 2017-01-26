# Node.js SQS to FastCGI worker/daemon/background process

Welcome to this silly little utility program.  It provides an intermediary link between an SQS message queue and a backend FastCGI system.  It is *very* simple.  All you do is push a message to an SQS queue and this program will receive it and forward it to a FastCGI server, presumably PHP-FPM.  Just plop this handy little program on the server with PHP-FPM, change some of the settings in the source code and run it.  The message retrieved from SQS is POSTed to FastCGI.  Given that SQS allows you to send a million messages per month, this could be a very cheap, simple, means of having a worker queue in PHP without having any infrastructure to manage.

Also, I'm not a node.js developer.  If I totally messed this up feel free to rewrite it with a pull request.

Don't forget to 

```
npm install
```

Then 

```
node bin/start.js
```