/* Magic Mirror
 * Node Helper: MMM-MWWordOfTheDay
 *
 * By bittiez
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const { networkInterfaces } = require('os');
global.IP = ""; //IP object for QR code
let ipRetry = 6;
getIPAddr();
function getIPAddr(){
	const nets = networkInterfaces();
	const results = Object.create(null); // Or just '{}', an empty object
	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
			if (net.family === familyV4Value && !net.internal) {
				if (!results[name]) {
					results[name] = [];
				}
				results[name].push(net.address);
				//console.log("setting IP..."+ net.address);
				global.IP = net.address;
				console.log("-----------------YOUR IP ADDR: "+global.IP);
			}
		}
	}
	if(global.IP.length<5){
		ipRetry--;
		console.log("IP looks blank...retrying...");
		setTimeout(function(){getIPAddr();},5000);
	  }
  }
module.exports = NodeHelper.create({
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_IP') {
		
    /*exec('host raspberrypi', (error, stdout, stderr) => {
     if (error) {
       console.error(`exec error: ${error}`);
       return;
    }
  
});
*/
this.sendSocketNotification('IP', global.IP);
}
  }
});