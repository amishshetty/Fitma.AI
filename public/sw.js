self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon-v6.png",
      badge: data.badge || "/icon-v6.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
      actions: data.actions || [],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = new URL("/", self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;
    
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url.startsWith(urlToOpen)) {
        matchingClient = windowClient;
        break;
      }
    }
    
    if (matchingClient) {
      // Focus the existing window
      return matchingClient.focus();
    } else {
      // Open a new window if it doesn't exist
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});
