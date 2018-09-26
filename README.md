# geekhub

## Run local standalone geekub
```
git clone
docker-compose up
```


## Use geekhub
```
./geekhub-sensors/geekhub-sensors-measure \
    --freq 100 \
    --exec "/opt/geekhub/geekhub-sensors/geekhub-sensors-test" \
   | geekhub-publisher/geekhub-pub-sensor \
        --topic U01.sensors.keller_temp_hum \
        --hub geekhub-1:8082
        --encryption-key {path-to-key}
```


