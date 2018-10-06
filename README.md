# geekhub

# Tested
Docker = 17.12.1
Docker-Compose = 1.17.1

## Run geekhub locally as an standalone
```
git clone
docker-compose up
nodejs ./geekhub-restapi/server.js
```

## Message structure
```
{
  "uuid":"278cdec3-f602-4914-8552-cf12862904cb",
  "hubid":"localhost:9092",
  "topic":"blub4",
  "type":"text/html",
  "metadata":{},
  "payload": PAYLOAD
}
```


## Ingest some data into geekhub

```
curl -H "Content-Type: application/json" -X POST localhost:5000/hubs/localhost:9092/topics/orders -d '{"orderid":"4"}'

```

## Add some more metadata fields
```
curl -H "Content-Type: application/json" -X POST localhost:5000/hubs/localhost:9092/topics/orders -d '{"orderid":"4"}' \
  -H Fmyfield:"test asdsa" -H Fmysecondfield:5

```

## Use geekhub and transfer texts, json, xml, ..

### Use a cursor
```
curl localhost:5000/hubs/localhost:9092/topics/orders -H cursor:start
curl localhost:5000/hubs/localhost:9092/topics/orders -H cursor:end

```

### Use geekhub with different devices with their cursor
```
curl localhost:5000/hubs/localhost:9092/topics/orders  -H groupid:tableclient
curl localhost:5000/hubs/localhost:9092/topics/orders  -H groupid:mapviewer

```

## Use geekhub to transfer images

```
# write
cat ~/Pictures/Hamburg_Hafen_3.jpg | \
  base64 -w 0 | \
  curl -H "Content-Type: application/raw" \
  -X POST localhost:5000/hubs/localhost:9092/topics/myimage_stream --data-binary @-


# read images and write files
curl localhost:5000/hubs/localhost:9092/topics/myimage_stream -N | \
 while read -r l; do echo $l|base64 -d > image_$(date +%s+%3N.jpg) ; done

```

## Use geekhub to transfer webcam images

```
# capture image from webcam
fswebcam - | \
  base64 -w 0 | \
  curl -H "Content-Type: application/raw" \
  -X POST localhost:5000/hubs/localhost:9092/topics/myimage_stream --data-binary @-

# read images and write files
curl localhost:5000/hubs/localhost:9092/topics/myimage_stream -N | \
 while read -r l; do echo $l|base64 -d > image_$(date +%s+%3N.jpg) ; done

```

## Use geekhub to stream webcam images every second
```

# create webcam image stream
while sleep 1; do fswebcam - |   base64 -w 0 |   curl -H "Content-Type: application/raw"  \
  -X POST localhost:5000/hubs/localhost:9092/topics/webcam --data-binary @-; done


# read the webcam image stream
curl localhost:5000/hubs/localhost:9092/topics/webcam -N | while read -r l; do echo $l|base64 -d > image.jpg ; done

```


## Encrypt data end-to-end
```
# write an encrpyted image into the topic
while sleep 1; do fswebcam - | openssl enc -aes-256-cbc -pass pass:secret | base64 -w 0 |  \
  curl -H "Content-Type: application/raw"    -X POST localhost:5000/hubs/localhost:9092/topics/webcam_enc --data-binary @-; done


# read the image and decrypt it
curl localhost:5000/hubs/localhost:9092/topics/webcam_enc -N | while read -r l; do echo $l|base64 -d| \
  openssl enc -d -aes-256-cbc -pass pass:secret > image.jpg ; done

```
