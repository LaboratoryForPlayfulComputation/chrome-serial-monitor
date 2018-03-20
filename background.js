var correctPort;

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('serial.html', {
      'outerBounds': {
        'width': 400,
        'height': 500
      }
    });
    chrome.serial.getDevices(function deviceList(foundPorts) {
        console.log("Ports list");
        console.log(foundPorts);
        foundPorts.forEach(port => {
            if (port.path == "/dev/cu.usbmodem1412")
            {
                correctPort = port;
            }
        });
    });
});