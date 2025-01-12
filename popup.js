const STEAM_STORE_API_URL = "https://store.steampowered.com/api/appdetails?appids=";
const STEAM_CCU_API_URL = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=";
const GAMALYTIC_API_URL = "https://api.gamalytic.com/steam-games/stats?appids=";

document.getElementById("rateButton").addEventListener("click", () => {
  const extensionId = "EXTENSION_ID";
  const reviewUrl = `https://chrome.google.com/webstore/detail/${extensionId}/reviews`;
  window.open(reviewUrl, "_blank");
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  const url = activeTab.url;

  const match = url.match(/store\.steampowered\.com\/app\/(\d+)/);

  if (match && match[1]) {
    const appId = match[1];
    fetchGameInfo(appId);
    fetchGameStats(appId);
    fetchCCU(appId);
  } else {
    displayError("Not a valid Steam game page.");
  }
});

function fetchGameInfo(appId) {
  fetch(`${STEAM_STORE_API_URL}${appId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data[appId]?.success) {
        const gameData = data[appId].data;

        document.getElementById("gameName").textContent = gameData.name;
        document.getElementById("gameHeader").src = gameData.header_image;

        const followers = gameData.recommendations?.total || 0;
        document.getElementById("followersValue").textContent = `~${followers.toLocaleString()}`;
      } else {
        document.getElementById("gameName").textContent = "Game Info Unavailable";
        document.getElementById("followersValue").textContent = "Unavailable";
      }
    })
    .catch((error) => {
      console.error("Error fetching game info:", error);
      document.getElementById("gameName").textContent = "Failed to fetch game info.";
      document.getElementById("followersValue").textContent = "Failed to fetch.";
    });
}

function fetchGameStats(appId) {
  fetch(`${GAMALYTIC_API_URL}${appId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.numberOfGames > 0) {
        const stats = data;
        const averageRevenue = stats.averageRevenue || 0;
        const averagePrice = stats.averagePrice || 1;
        const copiesSold = Math.round(averageRevenue / averagePrice);
        const averagePlaytime = stats.averagePlaytime || 0;

        document.getElementById("revenueValue").textContent = `~$${averageRevenue.toLocaleString()}`;
        document.getElementById("priceValue").textContent = `~$${averagePrice.toFixed(2)}`;
        document.getElementById("copiesValue").textContent = `~${copiesSold.toLocaleString()}`;
        document.getElementById("playtimeValue").textContent = `~${averagePlaytime.toFixed(2)}`;
      } else {
        displayError("No data found for this game.");
      }
    })
    .catch((error) => {
      console.error("Error fetching game stats:", error);
      displayError("Failed to fetch data. Please try again.");
    });
}

function fetchCCU(appId) {
  const STEAM_CCU_API_URL = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`;

  fetch(STEAM_CCU_API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.response && typeof data.response.player_count === "number") {
        const playerCount = data.response.player_count;
        document.getElementById("ccuValue").textContent = `~${playerCount.toLocaleString()}`;
      } else {
        console.warn("CCU data not found or invalid format.");
        document.getElementById("ccuValue").textContent = "Unavailable";
      }
    })
    .catch((error) => {
      console.error("Error fetching CCU:", error);
      document.getElementById("ccuValue").textContent = "Failed to fetch.";
    });
}

function displayError(message) {
  document.getElementById("stats").style.display = "none";
  const errorElement = document.createElement("p");
  errorElement.style.color = "#e74c3c";
  errorElement.style.textAlign = "center";
  errorElement.style.fontSize = "16px";
  errorElement.textContent = message;
  document.body.appendChild(errorElement);
}
