# geekhub

# Tested
Docker = 17.12.1
Docker-Compose = 1.17.1

## Run geekhub as standalone locally
```
git clone
docker-compose up
nodejs ./geekhub-restapi/server.js
```

## Ingest some data into geekhub
```
# JSON formated
curl -H "Content-Type: application/json" -X POST localhost:5000/hubs/localhost:9092/topics/orders -d '{"orderid":"4"}'

# Any text format
curl -H "Content-Type: text/html" -X POST localhost:5000/hubs/localhost:9092/topics/mymessages -d 'This is my message'
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

## Use geekhub transfering binary data / images

This process takes an image
```
# write
cat myimage.jpg | \
  curl  -H "Content-Type: application/raw" \
        -X POST localhost:5000/hubs/localhost:9092/topics/myimagestream \
        --data-binary @-


# read images and write files
curl -s localhost:5000/hubs/localhost:9092/topics/myimagestream3 -N -H cursor:start | jq --unbuffered -r '.payload' | \
  while read -r l; do echo $l|base64 -d > image_$(date +%s+%3N.jpg) ; done

```


## Use geekhub transfering webcam images

```
# capture image every second from webcam
while sleep 1; do \
fswebcam - | \
  curl  -H "Content-Type: application/raw" \
        -X POST localhost:5000/hubs/localhost:9092/topics/mywebcamstream \
        --data-binary @- \
  done;


# read images and write files
curl -s localhost:5000/hubs/localhost:9092/topics/mywebcamstream -N -H cursor:start | jq --unbuffered -r '.payload' | \
  while read -r l; do echo $l|base64 -d > image.jpg ; done;

gopen image.jpg

```


## Encrypt data end-to-end
```
# write an encrpyted image into the topic

while sleep 1; do \
fswebcam - | openssl enc -aes-256-cbc -pass pass:secret | \
  curl  -H "Content-Type: application/raw" \
        -X POST localhost:5000/hubs/localhost:9092/topics/mywebcamstream_encrpyted \
        --data-binary @- ; \
  done;


# read the image and decrypt it
curl -s localhost:5000/hubs/localhost:9092/topics/mywebcamstream_encrpyted -N -H cursor:start \
| jq --unbuffered -r '.payload' |   while read -r l; do echo $l|base64 -d \
| openssl enc -d -aes-256-cbc -pass pass:secret > image.jpg ; done;

gopen image.jpg

```
