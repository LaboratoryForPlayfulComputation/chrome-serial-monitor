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

var downloadButton = document.getElementById("download");

downloadButton.addEventListener("click", function(event) {
  var to_csv = document.getElementById("serial-out");
  let csv_content = "data:text/csv;charset=utf-8,"+to_csv.textContent
  var encodedUri = encodeURI(csv_content);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute('visibility', 'hidden');
  link.setAttribute("download", "my_data.csv");
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);


});

var onLineReceived = function(str) {
    
    var paragraph = document.getElementById("serial-out");
    inDats = str.split(',');
    for(var i =0;i<inDats.length;i++){
      console.log("inDats:"+ inDats[i])
    }
    //console.log("inDats: "+inDats);
    console.log("length indats: "+inDats.length)
    /*inDat1 = Number(inDats[0])
    inDat2 = Number (inDats[1])
    console.log("One: "+inDat1)
    console.log("Two: "+inDat2)*/
    //inDat = Number(str.substring(0, str.length-1));

    //dataLength = dataLength || 1;
    
    //console.log("points: "+dataLength);
    //for (var j = 0; j < dataLength; j++) {
      for (var k=0;k < inDats.length;k++) {
        yVal = Number(inDats[k]);
        console.log("yVal: "+yVal)
        if(dps[k] === undefined){//dynamically add additional series
          chart.options.data.push({type:"line",dataPoints:[]});
          //console.log("in undefined")
          //dps[k]=[{x:xVal,y:yVal}]
          //console.log("added: "+dps[k])
        }
       /* else if(dps[k].length==0) {
          dps[k]={type:"line",dataPoints:[]}

        }*/

        //else {
        dps[k].dataPoints.push({
          x: xVal,
          y: yVal
      });
    //}
    }
      
      
  
    
 
      for (var m=0;m<inDats.length;m++){
        if (dps[m].dataPoints.length > dataLength) {
          dps[m].dataPoints.shift();
        }
      }
   

    
/*
    console.log(test[0].type);
    console.log(test[1].type);
    console.log(test[0].dataPoints[0].y);
    console.log(test[1].dataPoints[0].y);
    console.log(test[0].dataPoints[0].x);
    console.log(test[1].dataPoints[0].x);*/


   

  
    
      
    //chart.update();
    chart.render();
    var box = document.getElementById("include_x");
    if(box.checked == true){
      paragraph.textContent += xVal+','+str;
      paragraph.scrollTop = paragraph.scrollHeight;
    }
    else{
      paragraph.textContent += str;
      paragraph.scrollTop = paragraph.scrollHeight;

    }

    xVal++;
}

var onReceiveCallback = function(info) {
    var str = decoder.decode(info.data);
    console.log("serial: " + str)
    if (str.charAt(str.length-1) === '\n') {
      stringReceived += str.substring(0, str.length-1);
      console.log("received: "+stringReceived)
      onLineReceived(stringReceived);
      console.log("here")
      stringReceived = '';
      console.log("string clear: "+stringReceived);
    }
    else {
      stringReceived += str;
    }
};

chrome.serial.onReceive.addListener(onReceiveCallback);


var dps = [{type:"line",dataPoints:[]}]; // dataPoints
//[[{x1,y1},{x2,y2}],[{x1,z1},{x2,z2}]]
//var dps1 = []
var chart = new CanvasJS.Chart("chartContainer", {
  title :{
    text: ""
  },
  axisY: {
    includeZero: false
  },
  data: dps 
  /*data: dps.map(function(d) {
    return {type:"line",dataPoints:d}
  })*/
  
  /*data:[
    {
    type: "line",
    dataPoints: dps[0]//[{x:1,y:17}]//,{x:2,y:18}]
  },
 {
    type: "line",
    dataPoints: dps[1]//[{x:1,y:19}]//,{x:2,y:20}]
 }]*/
});

}