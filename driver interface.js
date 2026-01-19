// ---------------- OLLAMA ----------------
const OLLAMA_API = "http://localhost:11434/api/generate";

// ---------------- MAP ----------------
let map;
let markers = [];

window.addEventListener("load", () => {
  map = L.map("map").setView([18.52, 73.85], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  setTimeout(() => map.invalidateSize(), 500);
});

// ---------------- ADD POIs ----------------
function addPOIs() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const pois = [
    { lat: 18.52, lng: 73.85, text: "⛽ Petrol Pump" },
    { lat: 18.60, lng: 73.90, text: "🅿 Parking Area" },
    { lat: 18.40, lng: 73.75, text: "🏨 Highway Hotel" }
  ];

  pois.forEach(p => {
    const marker = L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(p.text);
    markers.push(marker);
  });

  map.setZoom(7);
}

// ---------------- DRIVER AI ----------------
async function getRoute() {
  const from = fromCity.value;
  const to = toCity.value;

  const prompt = `
You are an Indian logistics driver assistant.
Suggest:
• Best highway route
• Fuel stops
• Parking & rest tips
From ${from} to ${to}.
Use bullet points.
`;

  try {
    const res = await fetch(OLLAMA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi",
        prompt: prompt,
        stream: false,
        options: { num_predict: 220 }
      })
    });

    const data = await res.json();
    document.getElementById("result").innerText = data.response;

    addPOIs();

  } catch (e) {
    document.getElementById("result").innerText =
      "⚠️ Ollama is not running. Please start it.";
  }
}
