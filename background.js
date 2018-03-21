var correctPort;
var portPath;
var stringReceived = '';
var decoder = new TextDecoder("utf-8");


var onReceiveCallback = function(info) {
    
    console.log("recieve callback!");
    console.log(info.data);

    var str = decoder.decode(info.data);
    if (str.charAt(str.length-1) === '\n') {
      stringReceived += str.substring(0, str.length-1);
      onLineReceived(stringReceived);
      stringReceived = '';
    } else {
      stringReceived += str;
    }
    console.log(stringReceived);
};

chrome.app.runtime.onLaunched.addListener(function() {
    /*
    chrome.app.window.create('serial.html', {
      'outerBounds': {
        'width': 400,
        'height': 500
      }
    });
    */
    chrome.serial.getDevices(function deviceList(foundPorts) {
        console.log("Ports list");
        console.log(foundPorts);
        foundPorts.forEach(port => {
            if (port.path == "/dev/cu.usbmodem1412")
            {
                correctPort = port;
                portPath = port.path;
                chrome.serial.connect(portPath, {bitrate: 115200, persistent: true}, function() {
                    console.log("connected");
                });
            }
        });
    });
});

chrome.serial.onReceive.addListener(onReceiveCallback);