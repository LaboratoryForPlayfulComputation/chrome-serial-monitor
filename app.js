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

  var dps = [{type:"line",showInLegend:false,name:"",dataPoints:[]}]; // dataPoints
  //var dps = [{type:"line",showInLegend:true,name:"Apples",dataPoints:[{x:1,y:2},{x:2,y:3},{x:3,y:4}]}]//,
  //{type:"line",showInLegend:true,name:"Oranges",dataPoints:[{x:1,y:3,x:2,y:4,x:3,y:5}]}]; 
var chart = new CanvasJS.Chart("chartContainer", {
  animationEnabled: true,
  title :{
    text: "Reading Micro:bit Data"
  },
  axisY: {
    includeZero: false
  },
  legend: {
		cursor:"pointer",
		//verticalAlign: "top",
		fontSize: 16,
		//fontColor: "dimGrey",
		itemclick : toggleDataSeries
	},
  data: dps 
});

//chart.render()

console.log("canvas loaded: "+CanvasJS)

function toggleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else{
		e.dataSeries.visible = true;
	}
	chart.render();
}

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

  var data = ""
    
    var paragraph = document.getElementById("serial-out");
    inDats = str.split(',');
    for(var i =0;i<inDats.length;i++){
      console.log("inDats:"+ inDats[i])
    }
   
    console.log("length indats: "+inDats.length)
   
    if (isNaN(inDats[0])){ //in label section
      console.log("in labels")
      for (var i=0;i<inDats.length;i++) {
        console.log("label: "+ inDats[i].trim())
        if(dps[i]===undefined){
          console.log("adding new series");
      //chart.options.data.push({type:"line",showInLegend:true,name:"series"+(i+1),legendText:inDats[i].trim(),dataPoints:[]})
      chart.options.data.push({type:"line",showInLegend:true,name:inDats[i].trim(),dataPoints:[]})
   
        }
        else {
          dps[i].showInLegend = true;
          //dps[i]["name"]="series"+(i+1);
          //dps[i]["legendText"]=
          dps[i].name=inDats[i].trim();
       
        }
      }
    }
    else {
      console.log("in data")
      for (var k=0;k < inDats.length;k++) {
        yVal = parseFloat(inDats[k]).toFixed(2);
        data = data+yVal+","
        console.log("yVal: "+yVal)
        if(dps[k] === undefined){//dynamically add additional series
          console.log("adding new series");
          chart.options.data.push({type:"line",dataPoints:[]});
        }
        dps[k].dataPoints.push({
          x: xVal,
          y: Number(yVal)
      });
   
    }
 
      for (var m=0;m<inDats.length;m++){
        if (dps[m].dataPoints.length > dataLength) {
          dps[m].dataPoints.shift();
        }
      }

      for (var z=0;z<dps.length;z++){
        console.log("to print:")
        console.log(dps[z])
      }
      
      chart.render();
    }
  
    var box = document.getElementById("include_x");
    if(box.checked == true){
      if(isNaN(inDats[0])){
        paragraph.textContent += "Sample, "+str;
      }
      else {
      paragraph.textContent += xVal+','+data.slice(0,-1)+"\n";
      }
      paragraph.scrollTop = paragraph.scrollHeight;
    }
    else {
      if(isNaN(inDats[0])){
        paragraph.textContent += str;
      }
      else {
      paragraph.textContent += data.slice(0,-1)+"\n";
      paragraph.scrollTop = paragraph.scrollHeight;
      }

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


}