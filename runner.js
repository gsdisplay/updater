#!/usr/bin/node
const fs = require('node:fs');
const {envVars}  = require('/home/pi/Scripts/updater/env.js');

let localPath = envVars.homePath+'/MagicMirror/gsversion.json';
let remotePath = envVars.homePath+'/Scripts/updater/version.json';
const updaterVersion = fs.readFileSync(remotePath,'utf8');
const localVersion = fs.readFileSync(localPath,'utf8');
let updaterVersionData = JSON.parse(updaterVersion)
let localVersionData = JSON.parse(localVersion)
//console.log(updaterVersionData);
//console.log(localVersionData);
//console.log("COMPARE: "+updaterVersionData.about.version +" - "+ localVersionData.about.version);

if(updaterVersionData.about.version > localVersionData.about.version){
  console.log("New Version "+updaterVersionData.about.version+" is newer than installed version "+localVersionData.about.version)
  copyFileDirectory();
  
}
else{
  console.log("New Version "+updaterVersionData.about.version+" is not newer than installed version "+localVersionData.about.version)

}

function copyFileDirectory(){

}
