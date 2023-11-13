if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
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

if (navigator.setAppBadge) {
  navigator.setAppBadge(12);
}
