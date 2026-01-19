/*************************************************
 * CUSTOMER AI BOOKING – FULL JS FILE
 * Uses Ollama + LLaMA3 (No Flask, No Python)
 *************************************************/

/* ===== CONNECT INPUT ELEMENTS ===== */
const loadType = document.getElementById("loadType");
const weight = document.getElementById("weight");
const fromCity = document.getElementById("fromCity");
const toCity = document.getElementById("toCity");

const truck1 = document.getElementById("truck1");
const truck2 = document.getElementById("truck2");
const truck3 = document.getElementById("truck3");

const cost1 = document.getElementById("cost1");
const cost2 = document.getElementById("cost2");
const cost3 = document.getElementById("cost3");

const reason1 = document.getElementById("reason1");
const reason2 = document.getElementById("reason2");
const reason3 = document.getElementById("reason3");

const aiBox = document.getElementById("aiBox");
const forecastBox = document.getElementById("forecastBox");

const forecastRoute = document.getElementById("forecastRoute");
const forecastLevel = document.getElementById("forecastLevel");
const forecastConfidence = document.getElementById("forecastConfidence");
const forecastAI = document.getElementById("forecastAI");

/* ===== TRUCK RULE DATA ===== */
const trucks = [
  {
    type: "Mini Truck",
    loads: ["general", "electronics"],
    reason: "Best for light loads and short to medium distance transport."
  },
  {
    type: "Pickup Van",
    loads: ["food", "furniture"],
    reason: "Suitable for bulky items with balanced cost and capacity."
  },
  {
    type: "Refrigerated Van",
    loads: ["medicine", "medical", "pharma"],
    reason: "Maintains temperature safety for medical goods."
  }
];

/* ===== DEMAND DATA ===== */
const demandData = [
  {
    from: "pune",
    to: "mumbai",
    level: "High",
    confidence: "85%",
    reason:
      "Strong industrial trade, daily freight movement, and return-load availability."
  },
  {
    from: "pune",
    to: "nanded",
    level: "Medium",
    confidence: "70%",
    reason:
      "Agriculture supply, fertilizers, and regional wholesale transport."
  }
];

/* ===== OLLAMA AI FUNCTION (LLAMA3) ===== */
async function ollamaAISuggestion(from, to, load) {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt:
          "You are a logistics AI. Give 10 lines explaining the best truck " +
          "and transport strategy for carrying " +
          load +
          " goods from " +
          from +
          " to " +
          to +
          " in India.",
        stream: false
      })
    });

    const data = await res.json();
    return data.response || "AI response unavailable.";

  } catch (err) {
    return "⚠️ Ollama is not running. Please start llama3.";
  }
}

/* ===== MAIN BUTTON FUNCTION ===== */
async function getRecommendation() {

  const load = loadType.value.toLowerCase().trim();
  const weightVal = Number(weight.value);
  const from = fromCity.value.trim();
  const to = toCity.value.trim();

  if (!load || !from || !to || weightVal <= 0) {
    alert("❌ Please fill all details correctly");
    return;
  }

  /* ===== SELECT BEST TRUCK ===== */
  let bestTruck = trucks[0];

  for (let i = 0; i < trucks.length; i++) {
    if (trucks[i].loads.includes(load)) {
      bestTruck = trucks[i];
    }
  }

  const baseCost = 5000 + weightVal * 1200;

  /* ===== SHOW TRUCKS ===== */
  truck1.innerText = bestTruck.type;
  cost1.innerText = baseCost;
  reason1.innerText = "⏳ AI is analyzing best transport strategy...";

  truck2.innerText = "Pickup Van";
  cost2.innerText = baseCost + 2000;
  reason2.innerText = "Good alternative with higher availability.";

  truck3.innerText = "Refrigerated Van";
  cost3.innerText = baseCost + 4000;
  reason3.innerText = "Used when goods need temperature control.";

  aiBox.style.display = "block";

  /* ===== AI SUGGESTION FROM OLLAMA ===== */
  const aiText = await ollamaAISuggestion(from, to, load);
  reason1.innerText = aiText;

  /* ===== FORECAST LOGIC ===== */
  let forecast = {
    level: "Medium",
    confidence: "60%",
    reason:
      "General inter-city transport demand based on similar routes."
  };

  for (let i = 0; i < demandData.length; i++) {
    if (
      demandData[i].from === from.toLowerCase() &&
      demandData[i].to === to.toLowerCase()
    ) {
      forecast = demandData[i];
    }
  }

  forecastRoute.innerText = from + " → " + to;
  forecastLevel.innerText = forecast.level;
  forecastConfidence.innerText = forecast.confidence;
  forecastAI.innerText =
    forecast.reason +
    " Forecast is derived from historical movement patterns.";

  forecastBox.style.display = "block";
}
