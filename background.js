chrome.app.runtime.onLaunched.addListener(function() {
    
    chrome.app.window.create('serial.html', {
      'outerBounds': {
        'width': 400,
        'height': 500
      }
    });
});

