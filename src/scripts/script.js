if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

let installPrompt;
const pwaInstallButton = document.getElementById("pwaInstall");

// When the browser detects that the app can be installed
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  pwaInstallButton.style.display = "initial";
});

// On click on the install button
pwaInstallButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }

  const result = await installPrompt.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  disableInAppInstallPrompt();

  Notification.requestPermission().then((result) => {
    if (result.state === "granted") {
      console.log("notifications granted");
    }
    console.log("notifications not granted");
  });
});

// Once the app is installed
window.addEventListener("appinstalled", () => {
  disableInAppInstallPrompt();
});

// Disable the installation process
function disableInAppInstallPrompt() {
  installPrompt = null;
  pwaInstallButton.style.display = "none";
}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD2F_QbXE5c2BAbcJA8cWgK77dyOh6vEM",
  authDomain: "bcalou-pwa.firebaseapp.com",
  projectId: "bcalou-pwa",
  storageBucket: "bcalou-pwa.appspot.com",
  messagingSenderId: "120929146497",
  appId: "1:120929146497:web:9507edaf73e22e37469f80"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.getToken({ vapidKey: 'BHQcYkFFS-giLWiENBzd9GS2mVs_E0tcDPYfJWuOXpXVzBmD5jz9wCwiCyEgbsGiOWtWjlWhYFiTtfDvjx1LSgQ' })
.then(currentToken => {
  if (currentToken) {
    console.log(currentToken);
    return currentToken;
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch(err => {
  console.log('An error occurred while retrieving token. ', err);
});
