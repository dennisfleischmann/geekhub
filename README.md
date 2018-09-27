# geekhub

## Run geekhub as standalone locally
```
git clone
docker-compose up
```

## Ingest some records into geekhub
```
curl -H "Content-Type: application/json" -X POST localhost:5000/hubs/localhost:9092/topics/test1 -d '{"test":"4"}'

```


## Use the data from geekhub
```
curl localhost:5000/hubs/localhost:9092/topics/test1

```
