var concat = require('concat'),
  fs = require('fs-extra'),
  config = require('../config'),
  files = [],
  dest = config.cssBuild.outFile,
  opCallback = function(success_message) {
  	return function(error) {
      if(error) {
    		console.error(error);
    		process.exit(2);
    		return;
  	  }
      console.log(success_message);
  	}
  };

// font-awesome css
files.push('./node_modules/font-awesome/css/font-awesome.min.css');

// bootstrap
files.push('./node_modules/bootstrap/dist/css/bootstrap.css');

// autocomplete
files.push('./node_modules/jquery-autocomplete/jquery.autocomplete.css');

fs.readdirSync('./styles').forEach(function(file) {
  if(file.indexOf('.css') == -1) return;
  files.push('./styles/' + file);
});

fs.readdirSync('./dist').forEach(function(file) {
  if(file.indexOf('.css') == -1) return;
  if(file == "main.css") return;
  files.push('./dist/' + file);
});

concat(files, dest, opCallback('files concatenated'));

// copy font-awesome fonts
fs.copy('./node_modules/font-awesome/fonts',
  './dist/fonts',
  opCallback('font-awesome fonts moved'))

// copy SCAR Ride fonts
fs.walk('./styles/fonts')
  .on('data', function(item) {
    fs.copy(item.path,
      './dist/fonts')
  })
  .on('end', opCallback('project fonts moved'))
  

fs.copy('assets', 
    'dist/assets', 
    opCallback('assets moved'));