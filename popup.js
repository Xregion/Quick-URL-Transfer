window.onload = function() {
    checkBrowserCompatibility();
};

var errorMessage;

function checkBrowserCompatibility() {
    if (!('serviceWorker' in navigator)) {
        errorMessage = "Your browser does not support Service Worker.<br>Please update your browser."
        document.getElementById("status").innerHTML = errorMessage;
        return;
    }
    if (!('PushManager' in window)) {
        errorMessage = "Your browser does not support Push.</br>Please update your browser."
        document.getElementById("status").innerHTML = errorMessage;
        return;
    }
    
    registerServiceWorker();
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        console.log('Service worker successfully registered.');
        askPermission();
        return registration;
    })
    .catch(function(err) {
        errorMessage = "Unable to register service worker.<br>Please try again."
        console.error('Unable to register service worker.', err);
        document.getElementById("status").innerHTML = errorMessage;
    });
}

function askPermission() {
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }   
    })
    .then(function(permissionResult) {
        if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
        }
    });
}

function getCurrentTabUrl() {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        document.getElementById("status").textContent = url;
    });
}