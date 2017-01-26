var Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: '...',
    secretAccessKey: '...'
});

var listenerCount = 4;
var queueUrl = '...';

var pushMessage = function (postData) {

    var params = {
        QUERY_STRING: '',
        REQUEST_METHOD: 'POST',
        CONTENT_TYPE: '',
        CONTENT_LENGTH: '',
        SCRIPT_FILENAME: '/var/www/html/queue.php',
        SCRIPT_NAME: '/queue.php',
        REQUEST_URI: '/queue.php',
        DOCUMENT_URI: '/queue.php',
        DOCUMENT_ROOT: '/var/www/m2',
        SERVER_PROTOCOL: 'HTTP/1.1',
        GATEWAY_INTERFACE: 'CGI/1.1',
    };
    var fcgi = require('fastcgi-client');
    var client = fcgi({
        host: "localhost",
        port: 9000
    });
    params.CONTENT_LENGTH = postData.length;
    var worker = function (client) {
        client.on('ready', function () {
            console.log("ready");
            client.request(params, function (err, request) {
                request.stdin.write(postData);
                request.stdout.on('data', function (data) {
                    console.log("receiving");
                    var str = data.toString('utf8');
                    console.log(str);
                });
            });
        });

    };
    console.log("Creating worker");
    worker(client);
}

var configure = function() {
    var app = Consumer.create({
        queueUrl: queueUrl,
        handleMessage: function (message, done) {
            console.log(message);
            pushMessage(message.Body);
            done();
        }
    });

    app.on('error', function (err) {
        console.log(err.message);
    });

    app.start();
};

var listeners = 0;

while (listeners++ < listenerCount) {
    configure();
}