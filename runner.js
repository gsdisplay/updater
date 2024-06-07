#!/usr/bin/node
const fs = require('node:fs');
const { execSync } = require('child_process');
const {envVars}  = require('/home/pi/Scripts/updater/env.js');

let localPath = envVars.homePath+'/MagicMirror/gsversion.json';
let remotePath = envVars.homePath+'/Scripts/updater/version.json';
const mmPath = '/home/pi/Scripts/updater/assets/MagicMirror';
const updaterVersion = fs.readFileSync(remotePath,'utf8');
const localVersion = fs.readFileSync(localPath,'utf8');
let updaterVersionData = JSON.parse(updaterVersion)
let localVersionData = JSON.parse(localVersion)
//console.log(updaterVersionData);
//console.log(localVersionData);
//console.log("COMPARE: "+updaterVersionData.about.version +" - "+ localVersionData.about.version);

if(updaterVersionData.about.version > localVersionData.about.version){
  console.log("New Version "+updaterVersionData.about.version+" is newer than installed version "+localVersionData.about.version)
  let result = copyFileDirectory();
  console.log(result);
  
}
else{
  console.log("New Version "+updaterVersionData.about.version+" is not newer than installed version "+localVersionData.about.version)

}

function copyFileDirectory(){
//copy files from updater directory to MagicMirror directory
  let result = "error";
  try{
    let copyResult = execSync('cp -a '+mmPath+' '+envVars.homePath);
    result = "Success: "+copyResult;   
  }
  catch(error){
    result = "Error: "+error;
  }
  return result;
}
