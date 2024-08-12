/* global Module */

/* Magic Mirror
 * Module: QRCode
 *
 * By Evghenii Marinescu https://github.com/MarinescuEvghenii/
 * MIT Licensed.
 */

'use strict';

Module.register("MMM-QRCode", {
	IP: "empty",
	WizardUrl: "",
	defaults: {
		text       : 'https://github.com/MarinescuEvghenii/MMM-QRCode',
		colorDark  : "#fff",
		colorLight : "#000",
		imageSize  : 150,
		showRaw    : true
	},

	getStyles: function() {
		return ["MMM-QRCode.css"];
	},

	getScripts: function() {
		return ["qrcode.min.js"];
	},
	getData: function() {
		this.sendSocketNotification("GET_IP", null);
	},

	start: function() {
		this.config = Object.assign({}, this.defaults, this.config);
		Log.log("Starting module: " + this.name);
		var self = this;
		self.getData();
		setTimeout(function(){
			self.moveQR();
		},2000);
	},
	

	socketNotificationReceived: function (notification, payload) {
		var self = this;
		if(notification === "IP") {
			console.log(payload)
			this.IP = payload;
			if(this.IP.length>5){
				this.updateDom();
				global.IP = this.IP;
			}
			else{
				//fallback to hostname...hopefully it works.
				this.IP = "greenscreen";	
			}
		}
	},
	moveQR: function(){
		//document.getElementById("qrcodewrapper").classList.remove("hidden");
		let qrButton = document.createElement("li");
		qrButton.classList.add("li-t");
		qrButton.classList.add("li-qr");
		let qrImage = document.getElementById("qrcodewrapper");
		qrButton.append(qrImage);
		qrImage.classList.remove("hidden");
		document.getElementById("optionButtons").append(qrButton);
	},
	getDom: function() {

		const wrapperEl = document.createElement("div");
		wrapperEl.id = "qrcodewrapper"
		wrapperEl.classList.add('qrcode');
		wrapperEl.classList.add('hidden');
		//console.log("THIS>POO: "+this.IP)
		const qrcodeEl  = document.createElement("div");
		if(this.IP != "empty"){
			this.WizardUrl = "http://"+this.IP+":3000/settings"
			new QRCode(qrcodeEl, {
				text: this.WizardUrl,
				width: this.config.imageSize,
				height: this.config.imageSize,
				colorDark : this.config.colorDark,
				colorLight : this.config.colorLight,
				correctLevel : QRCode.CorrectLevel.H
			});
		}

		const imageEl  = document.createElement("div");
		imageEl.classList.add('qrcode__image');
		imageEl.appendChild(qrcodeEl);

		wrapperEl.appendChild(imageEl);

		if(this.config.showRaw) {
			const textEl = document.createElement("div");
			textEl.classList.add('qrcode__text');
			textEl.innerHTML = "Scan to Customize"//this.config.text;
			wrapperEl.appendChild(textEl);
		}

		return wrapperEl;
	}
});
