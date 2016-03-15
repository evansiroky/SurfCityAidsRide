var config = {};

config.cssBuild = {};
config.cssBuild.outFile = "static/css/main.css";

config.html = {}
config.html.files = []

config.html.files.push({
  filename: 'index',
  navActive: 'homeActive'
})

module.exports = config;