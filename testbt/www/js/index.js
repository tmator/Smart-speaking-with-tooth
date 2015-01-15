
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        deviceListScreen.hidden = true;                      
        blinkScreen.hidden = true;              
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        deviceList.ontouchstart = app.connect; // assume not scrolling        
        refreshButton.ontouchstart = app.list;
        disconnectButton.onclick = app.disconnect;
	//quand on touche le bouton on appelle la fonction blink (juste en dessous)
        blink.ontouchstart = app.blink;

        app.list();
    },
    blink: function() {
        app.showProgressIndicator();      
                    
        function success() {
            app.hideProgressIndicator();                          
        }
        
        function failure (reason) {
            alert("Error sending code " + reason);
            app.hideProgressIndicator();                          
        }
              
        //on envoie la commande "blink" via bluetooth" 
        var command = "blink"; 
        bluetoothSerial.write(command, success, failure); 
    },  

    list: function(e) { 
        deviceList.innerHTML = ""; // clear the list 
        app.showProgressIndicator("Scanning for Bluetooth Devices...");        
        bluetoothSerial.list(app.onDeviceList, function() { alert("Listing Bluetooth Devices Failed"); });        
    },
    connect: function (e) {        
        var device = e.target.dataset.deviceId;
        app.showProgressIndicator("Requesting connection to " + device);
        bluetoothSerial.connect(device, app.onConnect, app.onDisconnect);                                    
    },
    disconnect: function (e) {
        if (e) {
            e.preventDefault();
        }

        app.setStatus("Disconnecting...");
        bluetoothSerial.disconnect(function() {
            app.setStatus("Disconnected");
            setTimeout(app.list, 800);
        });        
    },
    onConnect: function() {        
        app.showUnlockScreen();                
        app.setStatus("Connected");
        bluetoothSerial.subscribe("\n", app.onData);        
    },
    onDisconnect: function(reason) {
        if (!reason) { 
            reason = "Connection Lost"; 
        } 
        app.setStatus(reason);
        
        app.hideProgressIndicator();        
    },
    onData: function(data) {
        app.setStatus(data);
        app.hideProgressIndicator();        
    },
    onDeviceList: function(devices) {
        var listItem, rssi;

        app.showDeviceListPage();
        
        devices.forEach(function(device) {
            console.log(JSON.stringify(device));
            listItem = document.createElement('li');
            listItem.dataset.deviceId = device.id;
            if (device.rssi) {
                rssi = "RSSI: " + device.rssi + "<br/>";
            } else {
                rssi = "";
            }
            listItem.innerHTML = device.name + "<br/>" + rssi + device.id;
            deviceList.appendChild(listItem);
        });

        if (devices.length === 0) {
            
            if (cordova.platformId === "ios") { // BLE
                app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android
                app.setStatus("Please Pair a Bluetooth Device.");
            }

        } else {
            app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
        }
    },
    showProgressIndicator: function(message) {
        if (!message) { message = "Processing"; }
        scrim.firstElementChild.innerHTML = message;        
        scrim.hidden = false;
        statusDiv.innerHTML = "";        
    },
    hideProgressIndicator: function() {
        scrim.hidden = true;        
    },    
    showUnlockScreen: function() {
        blinkScreen.hidden = false;
        deviceListScreen.hidden = true;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    showDeviceListPage: function() {
        blinkScreen.hidden = true;
        deviceListScreen.hidden = false;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    setStatus: function(message){
        console.log(message);
        statusDiv.innerHTML = message;
    }
    
};