if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  document.getElementById("pwaInstall").style.display = "initial";
});
