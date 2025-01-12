chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchGameInfo") {
    fetchGameInfo(message.appId)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.action === "fetchCCU") {
    fetchCCU(message.appId)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function fetchGameInfo(appId) {
  const STEAM_STORE_API_URL = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
  const response = await fetch(STEAM_STORE_API_URL);
  const data = await response.json();
  if (!data[appId]?.success) {
    throw new Error("Game info not available");
  }
  return data[appId].data;
}

async function fetchCCU(appId) {
  const STEAM_CCU_API_URL = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`;
  const response = await fetch(STEAM_CCU_API_URL);
  const data = await response.json();
  if (!data.response || !data.response.player_count) {
    throw new Error("CCU data not available");
  }
  return { playerCount: data.response.player_count };
}
