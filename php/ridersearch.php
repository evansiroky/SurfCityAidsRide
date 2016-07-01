<?php

if(!isset($_GET['q'])) {
  header('Content-Type: application/json');
  echo '[]';
  die();
}

require_once "vendor/autoload.php";

use Goutte\Client;

$client = new Goutte\Client();

$crawler = $client->request('GET', 'http://encompasscs.donorpages.com/SurfCityAIDSRide2016/stats/');

$frame = $crawler->filter('frame')->attr('src');

$pattern = '/\.\.\/\.\.\/\/EventDetails.aspx\?token=([\w-]*)&mode=stats/';
$repl = 'http://encompasscs.donorpages.com//EventDetails.aspx?token=\1&mode=stats';

$crawler = $client->request('POST', preg_replace($pattern, $repl, $frame));

$form = $crawler->selectButton('Search')->form();
$values = $form->getPhpValues();

$values['ctl00$contentMain$eventDetailControl$nameTextbox'] = $_GET['q'];

$crawler = $client->request($form->getMethod(), $form->getUri(), $values, $form->getPhpFiles());

$results = array();

foreach($crawler->filter('a') as $link) {

  if(stripos($link->getAttribute('id'), 'tl00_contentMain_eventDetailControl_searchDataList')) {
    $results[] = array(
      'name' => trim($link->nodeValue),
      'link' => $link->getAttribute('href')
    );
  }

}

header('Content-Type: application/json');
echo json_encode($results);

?>