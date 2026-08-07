importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCyOYXriTx0ivDVjtBaHiesPArYz_1NOMU",
    authDomain: "fitma-ai.firebaseapp.com",
    databaseURL: "https://fitma-ai-default-rtdb.firebaseio.com",
    projectId: "fitma-ai",
    storageBucket: "fitma-ai.firebasestorage.app",
    messagingSenderId: "133103230543",
    appId: "1:133103230543:web:e4d2360d7d015161b6143a",
    measurementId: "G-2VR7YC6KZ6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-v3.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
