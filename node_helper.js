"use strict";

var cronofy = require('cronofy');
var moment = require('moment')

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start: function() {
		console.log("Applicaiton start!")
 	},

	socketNotificationReceived: function(notification, payload) {
		
		if(notification === "CONNECTED"){
			console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		}

		if(notification === "UPDATEUI"){
			this.updateUi(payload)
			this.options = payload;
		}

		if (notification === "LOG"){
			console.log("here" + JSON.stringify(payload));
		}

	},

	mmmFilter: function (entries) {
		
		const self = this;
		var array = [];
		//console.log(entries.events)
		for (var prop in entries.events) {
			var element = [];
			//console.log(entries.events);

			element['title'] = self.identifyTitle(entries.events[prop])	

			element['start'] = entries.events[prop].start;
			
			element['duration'] = self.calculateDuration(entries.events[prop].start, entries.events[prop].end);

			element['ago'] = moment(element.start, 'YYYY-M-DD HH:mm:ss').fromNow();

			element['mmmString'] = element.ago + " (" + element.duration + ") " + element.title;

			//array.push(element);

			this.sendSocketNotification("MYCAL",element['mmmString']);
		}
		this.sendSocketNotification("UPDATE");
	},

	send: function (array) {
		this.sendSocketNotification("MYCAL", array);
	},

	identifyTitle: function (entry) {
		if (entry.summary){
			return entry.summary;
		}
		return "no title";
	},

	calculateDuration: function  (start, end) {
		var startDate = moment(start, 'YYYY-M-DD HH:mm:ss')
		var endDate = moment(end, 'YYYY-M-DD HH:mm:ss')
		var diff = endDate.diff(startDate, 'seconds')

		if(diff > 60 && diff < 3600)
			diff = endDate.diff(startDate, 'minutes') + "m"	
		
		if(diff >= 3600 && diff < 86400)
			diff = endDate.diff(startDate, 'hours')	+ "h"

		if(diff >= 86400)
			diff = endDate.diff(startDate, 'hours')	+ "d"

		return diff;
	},

	updateUi: function () {
		var self = this;
		setTimeout(function() {
			self.updateCalendar();
		}, 5000);
	},

	updateCalendar: function() {
		
		var self = this;
		if(typeof this.options !== "undefined"){
			var options = this.options
			cronofy.readEvents(options)
			.then(function (response) {
				self.mmmFilter(response);
			});

			this.sendSocketNotification("UPDATE");
			console.log("Update Calendar");
		}
	}

});






