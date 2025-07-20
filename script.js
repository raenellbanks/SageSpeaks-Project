const sheetURL =
  "https://api.sheetbest.com/sheets/0c00771a-af18-4ce6-8ba7-8f5c7d01f002";
let allData = [];

async function fetchData() {
  try {
    const res = await fetch(sheetUrl);
    allData = await res.json();
    // Show default tab (flowers) on page load
    changeTab("flowers");
  } catch (err) {
    console.error("Failed to fetch data:", err);
    document.getElementById("content").innerHTML = "<p>Error loading data.</p>";
  }
}

function changeTab(section) {
  const sectionData = allData.filter(
    (item) => item.section.toLowerCase() === section.toLowerCase()
  );
  const html = sectionData
    .map(
      (item) => `
    <div class="card">
      <h2>${item.name || item.scenario_title || "No Title"}</h2>
      ${
        item.image_url
          ? `<img src="${item.image_url}" class="avatar" alt="Visual">`
          : ""
      }
      <p>${item.short_bio || item.scenario_description || "No description"}</p>
      <p class="sage-response">${
        item.legacy_quote || item.sage_response || ""
      }</p>
      ${
        item.audio_url
          ? `<button onclick="playAudio('${item.audio_url}', '${item.background_music}')">▶️ Play</button>`
          : ""
      }
    </div>
  `
    )
    .join("");
  document.getElementById("content").innerHTML =
    html || `<p>No data found for ${section}</p>`;
}

function playAudio(voice, bg) {
  const voiceAudio = new Audio(voice);
  const bgAudio = bg ? new Audio(bg) : null;

  if (bgAudio) {
    bgAudio.volume = 0.4;
    bgAudio.play();
  }

  voiceAudio.play();
  voiceAudio.onended = () => {
    if (bgAudio) bgAudio.pause();
  };
}

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}

// Load data on page start
fetchData();
