var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Producer = kafka.Producer;

const _ = require('lodash');
const uuidgen = require('uuid/v4');

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

  offset = false;

  switch (req.headers['cursor']){
    case "start": offset="erliest"; break;
    case "end": offset=false; break;
  }

  client = new kafka.KafkaClient({kafkaHost: params.broker });
  consumer = new Consumer(
    client,
    [
        { topic: params.topic },
    ],
    {
      groupId: req.headers['groupid'],
      autoCommit: true,
      autoCommitIntervalMs: 100,
      fetchMaxWaitMs: 100,
      fromOffset: offset
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
  }

  const fields = Object.keys(req.headers)
  .filter(key => key.charAt(0) == 'f')
  .reduce((obj, key) => {
      return {
        ...obj,
        [key]: req.headers[key]
      };
    }, {});

  console.log(fields)

  message = {
    uuid:     uuidgen(),
    hubid:    req.params.hub,
    topic:    req.params.topic,
    type:     req.headers['content-type'],
    metadata: fields
  }

  var client = new kafka.KafkaClient({kafkaHost: params.broker })
      producer = new Producer(client);

  kafka_payloads = []

  switch(req.headers['content-type']) {
    case "application/json": {
        message.payload = req.body
        kafka_payloads = [
             { topic: params.topic, messages: [ JSON.stringify( message) ] },
        ];
      break;
    }
    case "application/raw": {
        message.payload = req.body.toString('base64')
        kafka_payloads = [
             { topic: params.topic, messages: [ JSON.stringify( message ) ] },
        ];
      break;
    }
    case "text/html": {
        message.payload = req.body.toString()
        kafka_payloads = [
             { topic: params.topic, messages: [ JSON.stringify( message ) ] },
        ];
      break;
    }
    default:
      console.log("Error: Not supported content-type")
      res.write("Not supported content-type")
      res.end()
      return 0;
      break;
  }
  producer.on('ready', function () {
      producer.send(kafka_payloads, function (err, data) {
          res.end()
      });
  });
  producer.on('error', function (err) {
     console.err("ERROR: producer send")
  })
};
exports.delete = function(req, res){
};