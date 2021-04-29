self.addEventListener('install', () => {
    console.info('installing service worker...');
    self.skipWaiting();
    console.info('please refresh the browser!');
});

self.addEventListener('push', event => {
    var message = event.data.text();
    console.info('notification pushed:', message);
    try {
        self.registration.showNotification('Blazor WebPush', {
            body: message
        });
    } catch (e) {
        console.error(e);
    }
});

self.addEventListener('notificationclick', event => {
    console.info('notification clicked!');
    event.notification.close();
});
