# geekhub

## Run geekhub as standalone locally
```
git clone https://github.com/kfleischmann/geekhub.git
cd geekhub
npm install
docker-compose up
nodejs ./geekhub-restapi/server.js
```

## Ingest some records into geekhub
```
curl -H "Content-Type: application/json" -X POST localhost:5000/hubs/localhost:9092/topics/test1 -d '{"test":"4"}'

```

## Use the data from geekhub
```
curl localhost:5000/hubs/localhost:9092/topics/test1

```
