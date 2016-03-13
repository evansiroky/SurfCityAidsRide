var rimraf = require('rimraf'),
  fs = require('fs');

fs.readdirSync('./static').forEach(function(file) {
  if(file.indexOf('.css') == -1) return;
  if(file == "main.css") return;
  rimraf('./static/' + file, function(){});
});