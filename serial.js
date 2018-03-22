window.onload = function() {
    var correctPort;
    var portPath;
    var stringReceived = '';
    var decoder = new TextDecoder("utf-8");
    
    chrome.serial.getDevices(function deviceList(foundPorts) {
        console.log("Ports list");
        console.log(foundPorts);
        foundPorts.forEach(port => {
            if (port.path == "/dev/ttyACM0") {
                correctPort = port;
                portPath = port.path;
                chrome.serial.connect(portPath, {bitrate: 115200, persistent: true}, function() {
                    console.log("connected");
                });
            };
        });
    });
    
    var copyButton = document.getElementById("copy");
    
    
    copyButton.addEventListener("click", function(event) {
        var copyArea = document.getElementById("serial-out");
        copyArea.select();
        var text = document.execCommand('copy');
    });
    
    
    var onLineReceived = function(str) {
        var paragraph = document.getElementById("serial-out");
        paragraph.textContent += str;
    }
    
    var onReceiveCallback = function(info) {
        var str = decoder.decode(info.data);
        if (str.charAt(str.length-1) === '\n') {
          stringReceived += str.substring(0, str.length-1);
          onLineReceived(stringReceived);
          stringReceived = '';
        } 
        else {
          stringReceived += str;
        }
    };
    
    chrome.serial.onReceive.addListener(onReceiveCallback);
    
}
