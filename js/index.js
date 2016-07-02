var $ = require('jquery'),
  analytics = require('ga-browser')(),
  tether = require('tether'),
  bootstrap = require('bootstrap'),
  UAParser = require('ua-parser-js'),
  autocomplete = require('jquery-autocomplete')

var config = require('./config.js');

var exists = function(tag) {
  return $(tag).length > 0
}

var makeFundraiserBody = function(data, limit) {
  var html = '<tr><th>Name</th><th>Amount</th></tr>';

  limit = limit ? Math.min(data.length, limit) : data.length;

  for (var i = 0; i < limit; i++) {
    html += '<tr>';
    html += '<td><a href="' + data[i].link + '">' + data[i].name + '</a></td>';
    html += '<td>' + data[i].amount + '</td>';
    html += '</tr>';
  }

  return html;
}


$(function() {

  // GA tracking
  analytics('create', config.gaTrackingId, 'auto')
  analytics('send', 'pageview')

  var parser = new UAParser(),
    result = parser.getResult(),
    os = result.os.name,
    linkBase = 'http://maps.google.com?q=';

  if(os === 'iOS') {
    linkBase = 'maps:q=';
  } else if(os === 'Windows Phone' || os === 'Windows Mobile') {
    linkBase = 'maps:';
  }

  var linkFull = linkBase + '701%20Ocean%20St,%20Santa%20Cruz,%20CA';

  if(os=='RIM Tablet OS' || os=='BlackBerry') {
    linkFull = "javascript:blackberry.launch.newMap({'address':{'address1':'701 Ocean St','city':'Santa Cruz','country':'USA','stateProvince':'CA'}});";
  }

  $('#map-link').attr('href', linkFull);

  if(exists('#top-individual-fundraisers')) { 

    $.get('ws/top_fundraisers.php', function(data) {
      $('#top-individual-fundraisers').html(makeFundraiserBody(data.individuals, 5));
      $('#top-team-fundraisers').html(makeFundraiserBody(data.teams, 5));
    });

  }

  if(exists('#fundraiser-search')) {
    $('#fundraiser-search').autocomplete({
      source:[{
        minLength: 3,
        url:'ws/fundraiser_search.php?q=%QUERY%',
        type:'remote'
      }],
      valueKey: 'name',
      titleKey: 'name'
    }).on('selected.xdsoft', function(e, datum){
     window.location = datum.link;
    });
  }

})