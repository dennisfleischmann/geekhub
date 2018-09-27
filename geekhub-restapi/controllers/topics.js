var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Producer = kafka.Producer;

const _ = require('lodash');

exports.allTopics = function(req, res){
  params = {
    broker: req.params.topic
  }

  client = new kafka.KafkaClient(params.broker);
  client.once('connect', function () {
      client.loadMetadataForTopics([], function (error, results) {
        if (error) {
          return console.error(error);
        }
        meta = _.get(results, '1.metadata')

        for (var t in meta ){
          console.log(t)
          res.write(
            `${t}\n`
          );
        }
        res.end()

      });
  });


};
exports.consume =  function(req, res){
  console.log(req.url)

  params = {
    broker: req.params.hub,
    topic: req.params.topic
  }

  console.log( params )

  res.writeHead(200, {
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
      groupId: "test1",
      autoCommit: true,
      autoCommitIntervalMs: 100,
      fetchMaxWaitMs: 100,
      fromOffset: "earliest"
    }
  );

  consumer.on('error', function (error) {
    res.write(
      `${error.message}`
    );
    res.write('\n');
    console.log('ERROR: '+error.message);
  })

  consumer.on('message', function (message) {
    res.write(
      `${message.value}`
    );
    res.write('\n');

  });


};
exports.produce = function(req, res){

  params = {
    broker: req.params.hub,
    topic: req.params.topic,
    message: req.body
  }

  console.log (req.body )

  var KeyedMessage = kafka.KeyedMessage,
      client = new kafka.KafkaClient({kafkaHost: params.broker });
      producer = new Producer(client),

  payloads = [
      { topic: params.topic, messages: [ JSON.stringify( params.message) ] },
  ];

  producer.on('ready', function () {
      producer.send(payloads, function (err, data) {
          res.end()
      });
  });


  producer.on('error', function (err) {})


};
exports.delete = function(req, res){
};