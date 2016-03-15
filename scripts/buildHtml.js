var fs = require('fs');

var jade = require('jade');

var config = require('../config');

var options = {};

if(process.argv[2] === '-P') {
  options.pretty = true;
}

for (var i = 0; i < config.html.files.length; i++) {
  var curPage = config.html.files[i],
    template = jade.compileFile('./jade/' + curPage.filename + '.jade', options),
    templateCfg = {};

  templateCfg[curPage.navActive] = true;

  fs.writeFile('./static/' + curPage.filename + '.html',
    template(templateCfg))
}