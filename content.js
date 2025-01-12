const appId = window.location.pathname.split('/')[2];

const popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.bottom = "10px";
popup.style.right = "10px";
popup.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
popup.style.color = "white";
popup.style.padding = "10px 15px";
popup.style.borderRadius = "5px";
popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
popup.style.fontFamily = "Arial, sans-serif";
popup.style.fontSize = "14px";
popup.style.zIndex = "10000";
popup.textContent = `App ID: ${appId}`;

document.body.appendChild(popup);

setTimeout(() => {
  popup.remove();
}, 10000);
