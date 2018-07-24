  window.onload = function() {
    var correctPort;
    var portPath;
    var stringReceived = '';
    var decoder = new TextDecoder("utf-8");
    var selPath;
    var selRate;
    var conID;
    var inDat;
    var xVal = 0;
    var yVal = 100;
    var updateInterval = 1000;
    var dataLength = 20; // number of dataPoints visible at any point

    chrome.system.storage.getInfo(function(info){
        console.log(info);
        if(info[0].name == "MICROBIT" && info[0].type == "removable"){
          document.getElementById("bit?").innerHTML= "  YES!";
          document.getElementById("bit?").style.color = "green";
        }
        else{
          document.getElementById("bit?").innerHTML= "  NOPE!";
          document.getElementById("bit?").style.color = "red";
        }
      });

chrome.system.storage.onAttached.addListener(function(info){
  console.log(info);
  chrome.system.storage.getInfo(function(info){
      console.log(info);
      if(info[0].name == "MICROBIT" && info[0].type == "removable"){
        document.getElementById("bit?").innerHTML= "  YES!";
        document.getElementById("bit?").style.color = "green";
      }
      else{
        document.getElementById("bit?").innerHTML= "  NOPE!";
        document.getElementById("bit?").style.color = "red";
      }
    });

    chrome.serial.getDevices(function deviceList(foundPorts) {
        console.log("Ports list");
        console.log(foundPorts);

        foundPorts.forEach(port => {
            var select = document.getElementById("sel1");
            var elem = document.createElement("option");
            elem.textContent = port.path;
            elem.value = port.path;
            select.appendChild(elem);

            //document.getElementById('sel1').value = port.path;
            //document.getElementById('sel1').innerHTML = port.path;
        });
    });

});

chrome.system.storage.onDetached.addListener(function(info){
  console.log(info);
  document.getElementById("sel1").innerHTML='';
  chrome.system.storage.getInfo(function(info){
      console.log(info);
      if(info[0].name == "MICROBIT" && info[0].type == "removable"){
        document.getElementById("bit?").innerHTML= "  YES!";
        document.getElementById("bit?").style.color = "green";
      }
      else{
        document.getElementById("bit?").innerHTML= "  NOPE!";
        document.getElementById("bit?").style.color = "red";
      }
    });

    chrome.serial.getDevices(function deviceList(foundPorts) {
        console.log("Ports list");
        console.log(foundPorts);

        foundPorts.forEach(port => {
            var select = document.getElementById("sel1");
            var elem = document.createElement("option");
            elem.textContent = port.path;
            elem.value = port.path;
            select.appendChild(elem);

            //document.getElementById('sel1').value = port.path;
            //document.getElementById('sel1').innerHTML = port.path;
        });
    });
});


    chrome.serial.getDevices(function deviceList(foundPorts) {
        console.log("Ports list");
        console.log(foundPorts);

        foundPorts.forEach(port => {
            var select = document.getElementById("sel1");
            var elem = document.createElement("option");
            elem.textContent = port.path;
            elem.value = port.path;
            select.appendChild(elem);

            //document.getElementById('sel1').value = port.path;
            //document.getElementById('sel1').innerHTML = port.path;
        });
    });

    var connectButton = document.getElementById("connect");

    connectButton.addEventListener("click", function(event){
      var bRate = parseInt(document.getElementById("sel2").value);
      var port = document.getElementById("sel1").value;

      chrome.serial.connect(port, {bitrate: bRate, persistent: true}, function(info) {
          conID = info.connectionId;
          if(conID == undefined){
            document.getElementById("connection?").innerHTML= "  Not Connected!";
            document.getElementById("connection?").style.color = "red";
          }
          document.getElementById("connection?").innerHTML= "  Connected!";
          document.getElementById("connection?").style.color = "green";
          if(!info){
            document.getElementById("connection?").innerHTML= "  Not Connected!";
            document.getElementById("connection?").style.color = "red";
          }
      });
    });

  var copyButton = document.getElementById("copy");

  copyButton.addEventListener("click", function(event){
    var copyArea = document.getElementById("serial-out");
        copyArea.select();
        var text = document.execCommand('copy');
  });

  var onLineReceived = function(str) {
      var paragraph = document.getElementById("serial-out");
      inDat = Number(str.substring(0, str.length-1));

      dataLength = dataLength || 1;

      for (var j = 0; j < dataLength; j++) {
        yVal = inDat;
        dps.push({
          x: xVal,
          y: yVal
        });
        xVal++;
      }

      if (dps.length > dataLength) {
        dps.shift();
      }

      chart.render();

      paragraph.textContent += str;
      paragraph.scrollTop = paragraph.scrollHeight;
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


  var dps = []; // dataPoints
  var chart = new CanvasJS.Chart("chartContainer", {
  	title :{
  		text: ""
  	},
  	axisY: {
  		includeZero: false
  	},
  	data: [{
  		type: "line",
  		dataPoints: dps
  	}]
  });

}
