
// Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCD2F_QbXE5c2BAbcJA8cWgK77dyOh6vEM",
  authDomain: "bcalou-pwa.firebaseapp.com",
  projectId: "bcalou-pwa",
  storageBucket: "bcalou-pwa.appspot.com",
  messagingSenderId: "120929146497",
  appId: "1:120929146497:web:9507edaf73e22e37469f80"
};

// // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/thumb.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });