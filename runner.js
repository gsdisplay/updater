#!/usr/bin/node
const fs = require('node:fs');
const { execSync } = require('child_process');
const {envVars}  = require('/home/pi/Scripts/updater/env.js');
const outputLog = fs.createWriteStream(envVars.updaterFolder+'logs/runnerOutput.log',{flags:'a'});

let localVersionPath = envVars.homePath+'/MagicMirror/gsversion.json';
let remoteVersionPath = envVars.updaterFolder+'version.json';
const updatedFilesPath = envVars.updaterFolder+'assets/MagicMirror';

doUpdates();

function doUpdates(){
  let logMsg = "-----------------------"+new Date().toUTCString()+"-----------------------";
  console.log(logMsg);
  outputLog.write(logMsg + '\n');
  let continueUpdate = false;
  try{
    const updaterVersionFile = fs.readFileSync(remoteVersionPath,'utf8');
    const localVersionFile = fs.readFileSync(localVersionPath,'utf8');
    let updaterVersionData = JSON.parse(updaterVersionFile);
    let localVersionData = JSON.parse(localVersionFile);

    if(updaterVersionData.about.version > localVersionData.about.version){

      let logMessage = "New Version "+updaterVersionData.about.version+" is newer than installed version "+localVersionData.about.version;
      console.log(logMessage)
      outputLog.write(logMessage + '\n');
      let result = copyFileDirectory();
      console.log(result);
      outputLog.write(result + '\n');
      if(result.toLowerCase().indexOf("success")>-1)
          continueUpdate = true;

      //can I log to a file???????????/
    }
    else{
      let logMessage = "New Version "+updaterVersionData.about.version+" is not newer than installed version "+localVersionData.about.version;
      outputLog.write(logMessage + '\n');

    }
    if(continueUpdate){
      let updatedVersion =  updateLocalVersion();
      console.log(updatedVersion+ "running updateLocalVersion()");
      outputLog.write(updatedVersion+ "running updateLocalVersion()");
    }
  }
  catch(err){
      console.log("Error running doUpdates(): "+err);
      outputLog.write("Error running doUpdates(): "+err + '\n');
  }

  /** UPDATE THE LOCAL VERSION NUMBER OR ELSE THIS RUNS EVERY TIME */
}


function copyFileDirectory(){
//copy files from updater directory to MagicMirror directory
  let result = "error";
  try{
    let copyResult = execSync('cp --verbose -a '+updatedFilesPath+' '+envVars.homePath);
    result = "Success: "+copyResult;   
  }
  catch(error){
    result = "Error: "+error;
  }
  return result;
}

function updateLocalVersion(){
  let result = "error";
  try{
    let copyResult = execSync('cp --verbose '+remoteVersionPath+' '+localVersionPath);
    result = "Success: "+copyResult;   
  }
  catch(error){
    result = "Error: "+error;
  }
  return result;
}
