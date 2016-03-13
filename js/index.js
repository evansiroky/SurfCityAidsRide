var $ = require('jquery'),
  analytics = require('ga-browser')(),
  tether = require('tether'),
  bootstrap = require('bootstrap'),
  config = require('./config.js')


$(function() {

  // GA tracking
  analytics('create', config.gaTrackingId, 'auto')
  analytics('send', 'pageview', {
    page: '/',
    title: 'Home'
  })

})