<?php


// attempt to use cached json file
$cache_file = 'top_fundraisers.json';
$cache_life = '600'; //caching time, in seconds

$filemtime = @filemtime($cache_file);  // returns FALSE if file does not exist

if (!$filemtime or (time() - $filemtime >= $cache_life)) {
  // cache does not exist, or it has expired
} else {
  // valid cache exists
  header('Content-Type: application/json');
  echo file_get_contents($cache_file);
  die();
}

// cache should be refreshed if this point is reached
require_once "goutte-v1.0.7.phar";

use Goutte\Client;

$client = new Goutte\Client();

$crawler = $client->request('GET', 'http://encompasscs.donorpages.com/SurfCityAIDSRide2016/stats/');

$frame = $crawler->filter('frame')->attr('src');

$pattern = '/\.\.\/\.\.\/\/EventDetails.aspx\?token=([\w-]*)&mode=stats/';
$repl = 'http://encompasscs.donorpages.com//EventDetails.aspx?token=\1&mode=stats';

$crawler = $client->request('POST', preg_replace($pattern, $repl, $frame));

$form = $crawler->selectButton('Search')->form();
$values = $form->getPhpValues();

function getFundraisersByType($type) {

  global $client, $form, $values;

  if($type == 'teams') {
    $values['__EVENTTARGET'] = 'ctl00$contentMain$eventDetailControl$statisticsDataType$1';
    $values['ctl00$contentMain$eventDetailControl$statisticsDataType'] = 'Team';
  } else {
    $values['__EVENTTARGET'] = 'ctl00$contentMain$eventDetailControl$statisticsDataType$2';
    $values['ctl00$contentMain$eventDetailControl$statisticsDataType'] = 'Individual';
  }

  $crawler = $client->request($form->getMethod(), $form->getUri(), $values, $form->getPhpFiles());

  $entities = array();

  foreach($crawler as $item) {
    $nodeList = $item->getElementsByTagName('tr');
    $nodeListLen = $nodeList->length;
    for($i=0; $i < $nodeListLen; $i++) {
      $row = $nodeList->item($i);
      if($row->childNodes->length == 5 && is_numeric($row->childNodes->item(0)->nodeValue)) {
        $entity = array();
        $j = 0;
        foreach ($row->childNodes as $cell) {
          $text = trim($cell->nodeValue);
          switch ($j) {
            case 0:
              $entity['rank'] = $text;
              break;
            case 1:
              $entity['name'] = $text;
              $entity['link'] = $cell->childNodes->item(1)->childNodes->item(1)->getAttribute('href');
              break;
            case 2:
              $entity['numDonors'] = $text;
              break;
            case 3:
              $entity['numDonations'] = $text;
              break;
            case 4:
              $entity['amount'] = $text;
              break;
          }
          $j++;
        }
        $entities[]= $entity;
      }
    }
  }

  return $entities;
}

$fundraisers = array(
  'teams' => getFundraisersByType('teams'),
  'individuals' => getFundraisersByType('individuals')
);

header('Content-Type: application/json');
$json = json_encode($fundraisers);
echo $json;

file_put_contents($cache_file, $json);

?>