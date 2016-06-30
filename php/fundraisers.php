<?php

require_once "vendor/autoload.php";

use Goutte\Client;

$client = new Goutte\Client();

$crawler = $client->request('GET', 'http://encompasscs.donorpages.com/SurfCityAIDSRide2016/stats/');

$frame = $crawler->filter('frame')->attr('src');

$pattern = '/\.\.\/\.\.\/\/EventDetails.aspx\?token=([\w-]*)&mode=stats/';
$repl = 'http://encompasscs.donorpages.com//EventDetails.aspx?token=\1&mode=stats';

$crawler = $client->request('POST', preg_replace($pattern, $repl, $frame));

$fundraisers = array();

foreach($crawler->filter('tr') as $row) {
  if($row->childNodes->length == 5 && is_numeric($row->childNodes[0]->nodeValue)) {
    $person = array();
    $i = 0;
    foreach ($row->childNodes as $cell) {
      $text = trim($cell->nodeValue);
      switch ($i) {
        case 0:
          $person['rank'] = $text;
          break;
        case 1:
          $person['name'] = $text;
          $person['link'] = $cell->childNodes[1]->childNodes[1]->getAttribute('href');
          break;
        case 2:
          $person['numDonors'] = $text;
          break;
        case 3:
          $person['numDonations'] = $text;
          break;
        case 4:
          $person['amount'] = $text;
          break;
      }
      $i++;
    }
    $fundraisers[]= $person;
  }
}

header('Content-Type: application/json');
echo json_encode($fundraisers);

?>