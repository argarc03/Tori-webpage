<?php
// Sustituye con tu clave y el ID de tu canal
$apiKey = 'AIzaSyAnotxWv4aVbMuAhux-jEwGsgYacNalTas';
$channelId = 'UCFy4ibLoLjnW0N4AY7JDj7Q';

$url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id={$channelId}&key={$apiKey}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (isset($data['items'][0]['statistics']['subscriberCount'])) {
    echo $data['items'][0]['statistics']['subscriberCount'];
} else {
    echo "Error";
}
