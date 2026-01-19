const OLLAMA_API = "http://localhost:11434/api/generate";

async function getDecision() {
  const city = document.getElementById("location").value;
  const result = document.getElementById("result");
  const returnCards = document.getElementById("returnCards");
  const savingBox = document.getElementById("savingBox");

  if (!city) {
    alert("Please enter delivery city");
    return;
  }

  result.innerText = "⏳ Finding return loads...";
  returnCards.innerHTML = "";
  savingBox.innerText = "";

  const prompt = `
You are a logistics planning AI in India.

A truck has completed delivery in ${city}.
The driver will stay for 2 days.

Generate EXACTLY this JSON format (no explanation):

{
  "loads": [
    {
      "goods": "",
      "route": "",
      "weight": "",
      "rate": ""
    }
  ],
  "saving": ""
}

Rules:
- Give 2 or 3 loads
- Routes must start from ${city}
- Use realistic Indian goods and cities
- Rates in INR
- Do not add extra text
`;

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

    // Parse AI JSON safely
    const parsed = JSON.parse(data.response);

    parsed.loads.forEach(load => {
      const div = document.createElement("div");
      div.className = "return-card";
      div.innerHTML = `
        <h4>${load.goods}</h4>
        <p><b>Route:</b> ${load.route}</p>
        <p><b>Weight:</b> ${load.weight}</p>
        <p><b>Rate:</b> ${load.rate}</p>
      `;
      returnCards.appendChild(div);
    });

    savingBox.innerText = `💰 Estimated saving: ${parsed.saving}`;
    document.getElementById("returnBox").style.display = "block";

    result.innerText =
      `Based on delivery in ${city}, these return loads are commonly available after a short wait and help avoid empty trips.`;

  } catch (e) {
    console.error(e);
    result.innerText =
      "⚠️ AI response error. Try again or check Ollama.";
  }
}
