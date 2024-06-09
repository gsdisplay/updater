#!/usr/bin/node
const fs = require('node:fs');
const { execSync } = require('child_process');
const {envVars}  = require('/home/pi/Scripts/updater/env.js');
const outputLog = fs.createWriteStream('./logs/runnerOutput.log',{flags:'a'});

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

let logMsg = "-----------------------"+new Date().toUTCString()+"-----------------------";
console.log(logMsg);
outputLog.write(logMsg + '\n');
if(updaterVersionData.about.version > localVersionData.about.version){

  let logMessage = "New Version "+updaterVersionData.about.version+" is newer than installed version "+localVersionData.about.version;
  console.log(logMessage)
  outputLog.write(logMessage + '\n');
  let result = copyFileDirectory();
  console.log(result);
  outputLog.write(result + '\n');

  //can I log to a file???????????/
}
else{
  let logMessage = "New Version "+updaterVersionData.about.version+" is not newer than installed version "+localVersionData.about.version;
  outputLog.write(logMessage + '\n');

}
/** BE SURE TO UPDATE THE LOCAL VERSION NUMBER OR ELSE THIS RUNS EVERY DAMN TIME */

function copyFileDirectory(){
//copy files from updater directory to MagicMirror directory
  let result = "error";
  try{
    let copyResult = execSync('cp --verbose -a '+mmPath+' '+envVars.homePath);
    result = "Success: "+copyResult;   
  }
  catch(error){
    result = "Error: "+error;
  }
  return result;
}
