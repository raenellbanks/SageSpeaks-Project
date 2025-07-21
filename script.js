const API_URL =
  "https://api.sheetbest.com/sheets/0c00771a-af18-4ce6-8ba7-8f5c7d01f002";
let currentAudio = null;

async function fetchData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function changeTab(category) {
  fetchData().then((data) => {
    const filtered = data.filter(
      (item) => item.category.toLowerCase() === category
    );
    displayContent(filtered, category);
  });
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function playAudio(audioUrl, backgroundMusicUrl) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const mainAudio = new Audio(audioUrl);
  const bgAudio = backgroundMusicUrl ? new Audio(backgroundMusicUrl) : null;

  mainAudio.play();
  if (bgAudio) {
    bgAudio.volume = 0.3;
    bgAudio.loop = true;
    bgAudio.play();
  }

  currentAudio = mainAudio;

  mainAudio.onended = () => {
    if (bgAudio) bgAudio.pause();
  };
}

function displayContent(items, category) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (items.length === 0) {
    content.innerHTML = "<p>No content available for this section.</p>";
    return;
  }

  items.forEach((item) => {
    const section = document.createElement("section");
    section.classList.add("card");

    switch (category) {
      case "flowers":
      case "remember":
        section.innerHTML = `
          <h2>${item.name}</h2>
          <img src="${item.image_url}" alt="${item.name}" class="avatar" />
          <p><strong>Bio:</strong> ${escapeHTML(item.short_bio)}</p>
          <p><strong>Contribution:</strong> ${escapeHTML(item.contribution)}</p>
          <blockquote>${escapeHTML(item.legacy_quote)}</blockquote>
          <button onclick="playAudio('${item.audio_url}', '${
          item.background_music
        }')">Play</button>
        `;
        break;

      case "powerinwords":
        section.innerHTML = `
          <h2>${item.affirmation_title}</h2>
          <p>${escapeHTML(item.affirmation_text)}</p>
          <img src="${item.image_url}" alt="Affirmation" class="avatar" />
          <button onclick="playAudio('${item.audio_url}', '${
          item.background_music
        }')">Play</button>
        `;
        break;

      case "whatyoushoulddo":
        section.innerHTML = `
          <h2>${item.scenario_title}</h2>
          <img src="${item.image_url}" alt="Scenario" class="avatar"/>
          <p>${escapeHTML(item.scenario_description)}</p>
          <img src="${item.avatar_image}" alt="Sage Avatar" class="avatar"/>
          <p class="sage-response">${escapeHTML(item.sage_response)}</p>
          <button onclick="playAudio('${item.audio_url}', '${
          item.background_music
        }')">Play</button>
        `;
        break;
    }

    content.appendChild(section);
  });
}

// Light/Dark Mode Toggle
const toggleBtn = document.getElementById("toggleMode");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Load default tab
window.addEventListener("DOMContentLoaded", () => {
  changeTab("flowers");
});
