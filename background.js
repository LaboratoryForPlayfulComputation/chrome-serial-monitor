chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('app.html', {
    'outerBounds': {
      'width': 1000,
      'height': 1000
    },
  });
  chrome.app.window.onClosed.addListener(function(){
    chrome.serial.disconnect(function(){
      console.log('serial connection closed!');
    });
  });
});