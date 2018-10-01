<?php

/*
 * Implement this function and then send data like this:
 * Example
 * sendToGeekhub(['some' => 'thing', 'another' => 'thinggy'])
 * */

function sendToGeekhub($data){
    #curl -H "Content-Type: application/json" -X POST localhost:5000/hubs/localhost:9092/topics/test1 -d '{"test":"4"}'
    $data_string = json_encode($data);

    #$ch = curl_init('localhost:5000/hubs/localhost:9092/topics/test1');
    $ch = curl_init('192.168.12.223:5000/hubs/localhost:9092/topics/test1');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string))
    );

    $result = curl_exec($ch);

    /* error logging */
    #$error = curl_error($ch);
    #$info = curl_getinfo($ch);

    curl_close($ch);
}
