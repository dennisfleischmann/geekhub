# geekhub

## Run geekhub as standalone locally
```
git clone
docker-compose up
nodejs ./geekhub-restapi/server.js
```

## Ingest some records into geekhub
```
curl -H "Content-Type: application/json" -X POST localhost:5000/hubs/localhost:9092/topics/orders -d '{"orderid":"4"}'

```

## Use the data from geekhub
```
# stat from beginning
curl localhost:5000/hubs/localhost:9092/topics/orders -H offset:start


# start from ending
curl localhost:5000/hubs/localhost:9092/topics/orders -H offset:end

```

## Use the same data from different clients
```
curl localhost:5000/hubs/localhost:9092/topics/orders  -H groupid:tableclient
curl localhost:5000/hubs/localhost:9092/topics/orders  -H groupid:mapviewer


```