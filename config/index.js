var makeFilename = function(page) {
  if(page === 'Home') return 'index';
  return camelize(page);
}

var camelize = function(str) {
  // copied from http://stackoverflow.com/a/2970667/269834
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

var config = {};

config.cssBuild = {};
config.cssBuild.outFile = "static/css/main.css";

config.html = {}
config.html.files = []

var pages = ['Home', 'Day of Event', 'Training', 'Volunteer', 'Sponsors', 'Fundraising', 'About Us'];

var extraPageCfg = {}
extraPageCfg['Day of Event'] = require('./dayOfEvent.json')

for (var i = 0; i < pages.length; i++) {
  var curPage = pages[i],
    filename = makeFilename(curPage),
    cfg = {
      title: 'Surf City AIDS Ride - ' + curPage,
      pageHeaderImage: 'assets/' + filename + '.jpg'
    }

  cfg[filename + 'Active'] = true;

  if(extraPageCfg[curPage]) {
    for(k in extraPageCfg[curPage]) {
      cfg[k] = extraPageCfg[curPage][k]
    }
  }

  config.html.files.push({
    filename: filename,
    cfg: cfg
  })
}

module.exports = config;