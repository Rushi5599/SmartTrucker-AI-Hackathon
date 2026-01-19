const OLLAMA_API = "http://localhost:11434/api/generate";
let trucks = [];

// Add truck
function addTruck() {
  const type = truckType.value;
  const count = truckCount.value;

  if (!type || !count) return alert("Fill all fields");

  trucks.push({ type, count });
  truckType.value = "";
  truckCount.value = "";

  truckList.innerHTML =
    "<b>🚛 Fleet:</b><br>" +
    trucks.map(t => `${t.type} : ${t.count}`).join("<br>");
}

// Fleet analysis
async function analyzeFleet() {
  const prompt = `
You are a fleet management AI in India.
Fleet:
${trucks.map(t => `${t.type} - ${t.count} trucks`).join(", ")}
Location: ${location.value}
Status: ${status.value}

Give:
• Utilization tips
• Idle truck advice
• Demand suggestion
`;

  result.innerText = await askAI(prompt);
}

// Profit analysis
async function analyzeProfit() {
  const prompt = `
Analyze profit opportunities for Indian transport owner.
Fleet:
${trucks.map(t => `${t.type} - ${t.count}`).join(", ")}

Give:
• Best routes
• Best season
• Cost saving tips
`;

  result.innerText = await askAI(prompt);
}

// Seasonal goods
async function analyzeGoods() {
  const season = seasonSelect.value;
  if (!season) return alert("Select season");

  const prompt = `
Season: ${season}
Suggest:
• High demand goods
• Suitable truck types
• Business tip
`;

  goodsResult.innerText = await askAI(prompt);
}

// Ollama call
async function askAI(prompt) {
  try {
    const res = await fetch(OLLAMA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi",
        prompt: prompt,
        stream: false,
        options: { num_predict: 250 }
      })
    });

    const data = await res.json();
    return data.response;
  } catch {
    return "⚠️ Ollama not running";
  }
}
