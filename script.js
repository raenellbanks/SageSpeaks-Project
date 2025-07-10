console.log("🔥 script.js loaded");

const API_URL =
  "https://api.sheetbest.com/sheets/0c00771a-af18-4ce6-8ba7-8f5c7d01f002";
const content = document.getElementById("content");
const tabs = document.querySelectorAll(".tab-button");
const backgroundMusic = document.getElementById("backgroundMusic");
const modeToggle = document.getElementById("modeToggle");

let allData = {};

window.addEventListener("DOMContentLoaded", () => {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      allData = categorizeData(data);
      renderSection("flowers");
    })
    .catch((err) => console.error("Error fetching data:", err));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const activeTab = document.querySelector(".tab-button.active");
      if (activeTab) activeTab.classList.remove("active");
      tab.classList.add("active");
      renderSection(tab.dataset.tab);
    });
  });

  modeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", modeToggle.checked);
  });
});

function categorizeData(data) {
  const result = {
    flowers: [],
    remember: [],
    powerinwords: [],
    whatyoushoulddo: [],
  };

  data.forEach((entry) => {
    if (entry.name) result.flowers.push(entry);
    else if (entry.topic) result.remember.push(entry);
    else if (entry.affirmation_text) result.powerinwords.push(entry);
    else if (entry.scenario_title) result.whatyoushoulddo.push(entry);
  });

  return result;
}

function renderSection(section) {
  content.innerHTML = "";

  const sectionData = allData[section] || [];

  sectionData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "info-card";

    let html = "";

    switch (section) {
      case "flowers":
        html = `
          <h2>${item.name}</h2>
          <img src="${item.image_url}" alt="${item.name}" class="avatar"/>
          <p><strong>Bio:</strong> ${item.short_bio}</p>
          <p><strong>Contribution:</strong> ${item.contribution}</p>
          <p><strong>Legacy Quote:</strong> "${item.legacy_quote}"</p>
          <button onclick="playAudio('${item.audio_url}', 'assets/audio/default_background_music.mp3')">Play</button>
        `;
        break;

      case "remember":
        html = `
          <h2>${item.topic}</h2>
          <img src="${item.image_url}" alt="${item.topic}" class="avatar"/>
          <p>${item.fact_summary}</p>
          <p><em>"${item.lesson_quote}"</em></p>
          <button onclick="playAudio('${item.audio_url}', '${item.background_music}')">Play</button>
        `;
        break;

      case "powerinwords":
        html = `
          <img src="${item.image_url}" alt="Affirmation Visual" class="avatar"/>
          <p class="affirmation-text">"${item.affirmation_text}"</p>
          <button onclick="playAudio('${item.audio_url}', '${item.background_music}')">Play</button>
        `;
        break;

      case "whatyoushoulddo":
        html = `
          <h2>${item.scenario_title}</h2>
          <img src="${item.image_url}" alt="Scenario" class="avatar"/>
          <p>${item.scenario_description}</p>
          <p class="sage-response">${escapeHTML(item.sage_response)}</p>
          <button onclick="playAudio('${item.audio_url}', '${
          item.background_music
        }')">Play</button>
        `;
        break;

      default:
        html = "<p>No data available for this section.</p>";
    }

    card.innerHTML = html;
    content.appendChild(card);
  });
}

function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function playAudio(audioUrl, bgMusicUrl) {
  try {
    if (backgroundMusic.src !== bgMusicUrl) {
      backgroundMusic.src = bgMusicUrl;
      backgroundMusic.play();
    }
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error("Audio playback error:", error);
  }
}
