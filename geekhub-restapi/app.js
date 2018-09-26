var kafka = require('kafka-node'),
    Consumer = kafka.Consumer;

const http = require('http');

http.createServer((request, response) => {
  console.log(request.url)

  params = {
    broker: "localhost:9092",
    topic: request.url.split("/")[2]
  }

  console.log( params )

  response.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  client = new kafka.KafkaClient({kafkaHost: params.broker });
  consumer = new Consumer(
        client,
        [
            { topic: params.topic },
        ],
        {
          // Auto commit config
          autoCommit: true,
          autoCommitIntervalMs: 5000,
          // The max wait time is the maximum amount of time
          // in milliseconds to block waiting if insufficient
          // data is available at the time the request is issued, default 100ms
          fetchMaxWaitMs: 100
        }
      );


  consumer.on('error', function (error) {
    response.write(
      `${error.message}`
    );
    response.write('\n');
    console.log('ERROR: '+error.message);
  })

  consumer.on('message', function (message) {
    response.write(
      `${message.value}`
    );
    response.write('\n');
    console.log("MSG: "+ message.value);
  });


}).listen(5000);