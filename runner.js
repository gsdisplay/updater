#!/usr/bin/node
const fs = require('node:fs');
const {envVars}  = require('./env.js')
console.log('hi nate');
let installedVersion = "";
fs.readFileSync(envVars.homePath+'/MagicMirror/gsversion.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let versionData =JSON.parse(data);
    installedVersion = versionData.about.version;
    console.log(installedVersion);
    //do file copies
    console.log(envVars.homePath)



  });