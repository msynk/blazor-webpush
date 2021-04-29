(function () {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js');
    });
}());

var BlazorWebPush = (function () {
    var applicationServerKey = 'BEz9c9ncBnbyrlmlkCZME5Zp5YHYvaQ-cC1m2zGYqA3WkYAx_HLYutUtA2b25-nBANuUWAri_l8qlO1CiE4d_I4';

    return {
        requestSubscription: requestSubscription,
        requestNotificationPermission: requestNotificationPermission,
    };

    function requestNotificationPermission() {
        return new Promise(function (res, rej) {
            Notification.requestPermission(function (result) {
                if (result == 'granted') {
                    res();
                } else {
                    rej();
                }
            });
        });
    }

    function requestSubscription() {
        return navigator.serviceWorker.getRegistration().then(function (reg) {
            return reg.pushManager.getSubscription().then(function (sub) {
                if (sub) return extractSubscription(sub);
                return reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                }).then(function (sub) {
                    return extractSubscription(sub);
                });
            });
        });
    }

    function extractSubscription(sub) {
        return {
            endpoint: sub.endpoint,
            p256dh: toBase64(sub.getKey('p256dh')),
            auth: toBase64(sub.getKey('auth'))
        }
    }

    function toBase64(buffer) {
        var binary = '',
            bytes = new Uint8Array(buffer);
        for (var i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}());
