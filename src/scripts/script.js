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



messaging.getToken({ vapidKey: 'BDn5L5Z4sw9cXI-zHZBqexRDSyw2afRVM03ph9er3LNar-_tMiy5Q7xSaWnch6IrNDMwnxYC3fek1YW2qRHPhtA' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
    console.log(currentToken);
    return currentToken;
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

messaging.onMessage(payload => {
  console.log('Message received. ', payload);
  // ...
});