function createEventObject(parentObj){
	var closestEventParent = parentObj.closest(".event");
	var returnObject = {};
	returnObject.eventTitle= closestEventParent.querySelector(".eventTitle").innerText;
	returnObject.eventStart= closestEventParent.querySelector(".startTime").innerText;
	returnObject.eventEnd= closestEventParent.querySelector(".endTime").innerText;
	returnObject.eventDesc= closestEventParent.querySelector(".eventDescription").innerText;
	returnObject.eventCal= closestEventParent.getAttribute("data-calendar-name");
	returnObject.dateStart = closestEventParent.getAttribute("data-start-date");
	returnObject.dateEnd = closestEventParent.getAttribute("data-end-date");
	returnObject.location = closestEventParent.getAttribute("data-location");
	returnObject.allDay = closestEventParent.classList.contains('fullday');
	returnObject.multiDay = closestEventParent.classList.contains('overday');
	var d = new Date(0);
	d.setUTCSeconds(returnObject.dateStart);
	returnObject.dateString = d.toLocaleString('default',{weekday:'long',month:'long',day:"numeric"});
	returnObject.timeString = returnObject.eventStart+" - "+returnObject.eventEnd;
	if(returnObject.multiDay){
		var d2 = new Date(0);
		d2.setUTCSeconds(returnObject.dateEnd);
		returnObject.dateString = d.toLocaleString('default',{weekday:'long',month:'long',day:"numeric"})+" - "+d2.toLocaleString('default',{weekday:'long',month:'long',day:"numeric"});
		returnObject.timeString = "";
	}
	else if(returnObject.allDay){
		returnObject.dateString = d.toLocaleString('default',{weekday:'long',month:'long',day:"numeric"});
		returnObject.timeString = "";
	}
	return returnObject;
}
function openModal(e,modalType){
	//from CALEXT2_Event.js (f0r event, line 74) or CALEXT2_View.js line 239
	var target = e.target || e.srcElement;
	//text = target.textContent || target.innerText;
	var filter = Array.prototype.filter;

	if(modalType=='day'){
		var day= parseInt(target.innerHTML);
		var utcSeconds = target.parentNode.parentNode.getAttribute('data-start');
		var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
		d.setUTCSeconds(utcSeconds);
		var stringDate = d.toLocaleString('default',{weekday:'long',month:'long',day:"numeric"});

		//console.log(document.getElementsByClassName('startDate'))
        var allElements = document.querySelectorAll('.startDate');
        //console.log(allElements.length);
        var productElements = filter.call(allElements, function(element) {
            //console.log(element.parentNode.parentNode.querySelector(".eventTitle"));
            //console.log(parseInt(element.innerText)+ "-"+day);
            return parseInt(element.innerText) == day;
        });
        //console.log(productElements);
		var content = "";
		for(i=0;i<productElements.length;i++){
			//console.log(productElements[i].closest(".event"));
			var eventObject = createEventObject(productElements[i]);
			content+= "<div class=\"modal-date\">"+eventObject.eventTitle +"</div><div class=\"modal-time\">"+eventObject.timeString +"</div><div class=\"modal-description\">"+eventObject.eventDesc+"</div>";//+eventCal ;
			
		}
		document.getElementById('modal-window-title').innerHTML = stringDate;
		document.getElementById('modal-window-content').innerHTML = content.length==0?"No events to show for this day.":content;	
		document.getElementsByClassName('modal__container')[0].style.backgroundImage =  'linear-gradient(to bottom, #607d8b 120px, white 10%)';
		document.getElementsByClassName('modal__container')[0].style.width="900px";
		document.getElementsByClassName('modal__container')[0].style.maxWidth ="1200px";
		MicroModal.show('modal-window');

    }
	if(modalType=='event'){
		var eventObject = createEventObject(target);
		var closestEventParent = target.closest(".event");
		var color = window.getComputedStyle(closestEventParent).getPropertyValue("background")
		color = color.substring(color.indexOf('0deg,')+6);
		color = color.substring(0,color.indexOf('99%')-1);

		document.getElementById('modal-window-title').innerHTML = eventObject.eventTitle;
		document.getElementById('modal-window-content').innerHTML = "<div class=\"modal-date\">"+eventObject.dateString +"</div><div class=\"modal-time\">"+eventObject.timeString +"</div><div class=\"modal-description\">"+eventObject.eventDesc+"</div>"+(eventObject.location!='null'?"<div class=\"modal-location\">"+eventObject.location+"</div>":"");//+eventCal ;
		document.getElementsByClassName('modal__container')[0].style.backgroundImage =  'linear-gradient(to bottom, '+color+' 120px, white 10%)';
		document.getElementsByClassName('modal__container')[0].style.width="900px";
		document.getElementsByClassName('modal__container')[0].style.maxWidth ="1200px";
		MicroModal.show('modal-window');
	}
	
}
function closeApps(){
	document.querySelector('span.fa-times-circle').click();
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function openWizard(urlSlug,friendlyName){
	let url = window.location.href.substring(0,window.location.href.indexOf(':8080'))+':3000/'+urlSlug;
	document.getElementById('modal-window-title').innerHTML = friendlyName+" Settings"
	document.getElementById('modal-window-content').innerHTML = `<iframe src="`+url+`?iframed=1" height="900px" width="1540px">` ;
	document.getElementsByClassName('modal__container')[0].style.backgroundImage =  'linear-gradient(to bottom, green 120px, white 10%)';
	document.getElementsByClassName('modal__container')[0].style.width="1600px";
	document.getElementsByClassName('modal__container')[0].style.maxWidth ="1600px";
	MicroModal.show('modal-window',{
		onClose: function(){document.getElementById('modal-window-content').innerHTML = ''}
	  });
}

function showWeatherMap(){
    document.getElementById('modal-window-title').innerHTML = "Current Weather Map";
    document.getElementById('modal-window-content').innerHTML = "<iframe id=\"iframeId\" height=\"910\" width=\"1810\" src=\"https://radar.weather.gov/?settings=v1_eyJhZ2VuZGEiOnsiaWQiOiJ3ZWF0aGVyIiwiY2VudGVyIjpbLTk4Ljg4Nyw0MC45NjZdLCJsb2NhdGlvbiI6Wy05OS40MTUsMzkuMzk5XSwiem9vbSI6NX0sImFuaW1hdGluZyI6dHJ1ZSwiYmFzZSI6ImRhcmtjYW52YXMiLCJhcnRjYyI6ZmFsc2UsImNvdW50eSI6ZmFsc2UsImN3YSI6ZmFsc2UsInJmYyI6ZmFsc2UsInN0YXRlIjpmYWxzZSwibWVudSI6ZmFsc2UsInNob3J0RnVzZWRPbmx5IjpmYWxzZSwib3BhY2l0eSI6eyJhbGVydHMiOjAsImxvY2FsIjowLjYsImxvY2FsU3RhdGlvbnMiOjAuOCwibmF0aW9uYWwiOjF9fQ%3D%3D\"></iframe><br/><br/><br/><br/>";
	document.getElementsByClassName('modal__container')[0].style.width="1810px";
	document.getElementsByClassName('modal__container')[0].style.maxWidth ="2200px";
	document.getElementsByClassName('modal__container')[0].style.backgroundImage =  'linear-gradient(to bottom, #555 120px, white 10%)';
    MicroModal.show('modal-window',{
      onClose: function(){document.getElementById('modal-window-content').innerHTML = ''}
    });
}
function openNews(obj){
	document.getElementById('modal-window-title').innerHTML = "";
	document.getElementById('modal-window-content').innerHTML="";
	/*var loadingMsg = document.createElement('div');
	loadingMsg.id="frameLoading";
	loadingMsg.innerText="Loading...";*/
	var newsFrame = document.createElement('iframe');
	//document.getElementById('modal-window-content').appendChild(loadingMsg);
	//newsFrame.onload = function() { document.getElementById('frameLoading').style.display = "none";}; // before setting 'src'
	newsFrame.id="iframeId";
	newsFrame.height = "910";
	newsFrame.width = "1750";
	newsFrame.setAttribute("style","border:none;border-radius:10px;background:#FFF")
	newsFrame.src = obj.getAttribute('data-url'); 
	document.getElementById('modal-window-content').appendChild(newsFrame)

    //document.getElementById('modal-window-content').innerHTML = "<iframe id=\"iframeId\" height=\"910\" style=\"border:none;border-radius:10px\" width=\"1750\" src=\""+obj.getAttribute('data-url')+"\">LOADING...</iframe>";
	document.getElementsByClassName('modal__container')[0].style.width="1810px";
	document.getElementsByClassName('modal__container')[0].style.maxWidth ="2200px";
	document.getElementsByClassName('modal__container')[0].style.background =  '#6a6a6a4a';
    MicroModal.show('modal-window',{
      onClose: function(){document.getElementById('modal-window-content').innerHTML = ''}
    });
}

//Attach event listeners - not working on monitor though...could run debug or...
waitForElm('div.module.weather').then((elm) => {
	document.querySelector('div.module.weather').addEventListener('click',function (e){
		showWeatherMap()
	});
});
function toggleSettingsMenu(){
	const menuToggleDiv = document.getElementById("st-menu-toggle")
    menuToggleDiv.classList.toggle('show');
	const mainMenuDiv2 = document.getElementById("st-main-menu2")
    if(mainMenuDiv2.classList.contains('show'))
        mainMenuDiv2.classList.toggle('show');

    const mainMenuDiv = document.getElementById("st-main-menu")
    mainMenuDiv.classList.toggle('show')

    

    const notifcationArea = document.querySelector('div.updatenotification div.module-content div');
    if(notifcationArea && notifcationArea.classList.contains('show'))
      notifcationArea.classList.toggle('show');
}

function hasIP(){
	if(global.IP.length>0)
		return true;
	else
		return false;
}
//in event of black screen, maybe this will work
setTimeout(function(){
	const online = hasIP();
	console.log("HAS IP: "+hasIP());
	if(!online){
		let retVal = confirm("It looks like it's taking a while to load.  Click 'OK' to reload the page, or 'Cancel' to wait.");
		if(retVal == true)
			location.reload();
	}
},30000);

//could try 2-finger touch:



waitForElm('div.module.helloworld').then((elm) => {
	console.log('------------_ADDED touch for message--------------------------');

	document.querySelector('div.module.helloworld').addEventListener('touchstart', function (e) {
		if(e.touches.length > 1) {
			console.log('touched message')
			openWizard('message','Message');
		}
	  });

});
waitForElm('div.module.newsfeed').then((elm) => {
	console.log('------------_ADDED touch for message--------------------------');

	document.querySelector('div.module.newsfeed').addEventListener('touchstart', function (e) {
		if(e.touches.length > 1) {
			console.log('touched message')
			openWizard('news','News');
		}
	  });

});

setTimeout(function(){
    document.querySelector('div.top.center div.container').style.display = "block"
    document.querySelector('div.top.center div.container').innerHTML = `<span id="calLoading">Loading...</span>`;
},1000);
    
setTimeout(function(){
    document.querySelector('#calLoading').style.display = "none"
},9500);

/*
someElement.addEventListener('touchstart', function (e) {
  if(e.touches.length > 1) {
    // ... do what you like here
  }
});
*/
/*
waitForElm('div.module.clock').then((elm) => {
	console.log('------------_ADDED 2 finger touch for clock--------------------------');

	document.querySelector('div.module.clock').addEventListener('touchstart', function (e) {
		if(e.touches.length > 1) {
			console.log('touched clock')
			openWizard('clock','Date and Time');
		}
	  });

});


waitForElm('div.module.MMM-CountDown').then((elm) => {
	document.querySelector('div.module.MMM-CountDown').addEventListener('touchstart',function (e){
	openWizard('extras','Other Settings');
	})
});*/