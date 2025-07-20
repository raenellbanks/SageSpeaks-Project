const apiURL =
  "https://api.sheetbest.com/sheets/0c00771a-af18-4ce6-8ba7-8f5c7d01f002";

// Function to fetch data from SheetBest API
async function fetchData() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log("Data loaded:", data);
    renderTabs(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// Function to safely escape HTML
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[tag])
  );
}

// Function to render content into tabs based on 'tab' value
function renderTabs(data) {
  const sections = {
    Flowers: document.getElementById("flowers"),
    Remember: document.getElementById("remember"),
    "Power in Words": document.getElementById("power"),
    "What YOU Should Do...": document.getElementById("action"),
  };

  data.forEach((item) => {
    const tab = item.tab;
    const container = sections[tab];
    if (!container) return;

    const card = document.createElement("div");
    card.className = "sage-card";

    card.innerHTML = `
      <h3>${escapeHTML(item.name || item.scenario_title)}</h3>
      <img src="${item.image_url}" class="avatar" alt="image for ${
      item.name || tab
    }" />
      <p>${escapeHTML(item.short_bio || item.scenario_description)}</p>
      <p class="sage-response">${escapeHTML(
        item.legacy_quote || item.sage_response
      )}</p>
      <button onclick="playAudio('${item.audio_url}', '${
      item.background_music
    }')">Play</button>
    `;

    container.appendChild(card);
  });
}

// Function to play audio with optional background music
function playAudio(voiceURL, bgMusicURL) {
  const voice = new Audio(voiceURL);
  const bgMusic = bgMusicURL ? new Audio(bgMusicURL) : null;

  if (bgMusic) {
    bgMusic.volume = 0.3;
    bgMusic.loop = true;
    bgMusic.play();
  }

  voice.play();

  voice.onended = () => {
    if (bgMusic) bgMusic.pause();
  };
}

// Kick off the data load
document.addEventListener("DOMContentLoaded", fetchData);
