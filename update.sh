node runner.js
: '
setTimeout(function(){
    document.querySelector('div.top.center div.container').style.display = "block"
    document.querySelector('div.top.center div.container').innerHTML = `<span id="calLoading">Loading...</span>`;
},1000);

setTimeout(function(){
	document.querySelector('#calLoading').style.display = "none"
},9500);

TO DO
1) Add a local version.txt to
if(readmeDate>LocalReadMeDateOnServer--version.txt)

version1

if local is version 1 and new is version 3

//if localVersion < = 1
// do v1 update

if localVersion <=2

do v2 update

etc...
'
