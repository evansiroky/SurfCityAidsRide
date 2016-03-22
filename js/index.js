var $ = require('jquery'),
  analytics = require('ga-browser')(),
  tether = require('tether'),
  bootstrap = require('bootstrap'),
  UAParser = require('ua-parser-js')

var config = require('./config.js')


$(function() {

  // GA tracking
  analytics('create', config.gaTrackingId, 'auto')
  analytics('send', 'pageview', {
    page: '/',
    title: 'Home'
  })

  var parser = new UAParser(),
    result = parser.getResult(),
    os = result.os.name,
    linkBase = 'http://maps.google.com?q=';

  if(os === 'iOS') {
    linkBase = 'maps:q=';
  } else if(os === 'Android') {
    linkBase = 'geo:';
  } else if(os === 'Windows Phone' || os === 'Windows Mobile') {
    linkBase = 'maps:';
  }

  var linkFull = linkBase + '701%20Ocean%20St,%20Santa%20Cruz,%20CA';

  if(os=='RIM Tablet OS' || os=='BlackBerry') {
    linkFull = "javascript:blackberry.launch.newMap({'address':{'address1':'701 Ocean St','city':'Santa Cruz','country':'USA','stateProvince':'CA'}});";
  }

  $('#map-link').attr('href', linkFull);

})