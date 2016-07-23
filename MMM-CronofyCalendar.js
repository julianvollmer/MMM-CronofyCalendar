Module.register("MMM-CronofyCalendar",{
    // Default module config.
    defaults: {
        text: "Hello World!",
        lists: "some list",
        itemsCount: 8, 
        accessToken: "your_token",
    },

    socketNotificationReceived: function(notification, payload) {
        
        if(notification === "MYCAL"){
            this.events.push(payload);
            //this.sendSocketNotification("LOG", payload);
        }

        if(notification === "UPDATE"){
            this.updateDom(3000);       
        }
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("table");  
        wrapper.className = "normal small light";
        for (var i = 0; i < this.config.itemsCount && i < this.events.length; i++) {
            var titleWrapper = document.createElement("tr");
            titleWrapper.innerHTML = this.events[i];
            titleWrapper.className = "title bright";
            wrapper.appendChild(titleWrapper);
        }

        return wrapper;
        
    },

    start: function() {        
        this.events = [];
        this.sendSocketNotification("CONNECTED", "lal1ala");
        this.update();
    },

    update: function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        today = yyyy+'-'+mm+'-'+dd;

        var options = {
            access_token: this.config.accessToken,
            tzid: 'Etc/UTC',
            from: today,
        };

        this.sendSocketNotification("UPDATEUI", options);
    }
});
