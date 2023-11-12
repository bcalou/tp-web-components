if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  alert("ok");
});
