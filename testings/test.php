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
    $ch = curl_init('192.168.13.229:5000/hubs/localhost:9092/topics/test1');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT_MS, 100);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string))
    );

    $result = curl_exec($ch);

    /* error logging */

    $error = curl_error($ch);
    $info = curl_getinfo($ch);

    var_dump($result);

    if($result === false){
        echo 'OMG es failte!';
    }else{
        echo 'Success';
    }


    #var_dump($result);
    #var_dump($error);
    #var_dump($info);

    curl_close($ch);
}


for($i = 1; $i < 200; $i++){
    echo "$i. I'll send it.\n";
    #sendToGeekhub(['tag' => $i . date('m:H'), 'content' => 'arbok ' . $i . ': ' . rand(1, 10), 'timeline' => true, ]);
    sendToGeekhub(['baritem' => true, 'color' => rand(0,1) == 1 ? 'red' : 'blue']);
    sleep(1);
}

