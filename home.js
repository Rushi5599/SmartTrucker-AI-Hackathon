// Ollama local API
const OLLAMA_API = "http://localhost:11434/api/generate";

document.getElementById("chatbot-toggle").onclick = toggleChat;

function toggleChat() {
  const bot = document.getElementById("chatbot");
  bot.style.display = bot.style.display === "block" ? "none" : "block";
}

async function sendMessage() {
  const text = document.getElementById("chatText").value;
  const role = document.getElementById("chatRole").value;

  if (!text) return;

  addMessage(text, "user");
  document.getElementById("chatText").value = "";

  // Role-based prompt
  const rolePrompt = `
You are an AI assistant for transportation & logistics in India.
User role: ${role}

Rules:
- Customer → suggest trucks, price, delivery time
- Driver → route tips, safety, earnings
- Owner → fleet insights, utilization, profit tips

User question:
${text}
`;

  try {
    const res = await fetch(OLLAMA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi",
        prompt: rolePrompt,
        stream: false
      })
    });

    const data = await res.json();
    addMessage(data.response, "bot");
  } catch (err) {
    addMessage("⚠️ Ollama is not running. Please start it.", "bot");
  }
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-msg" : "bot-msg";
  div.innerText = text;
  document.getElementById("chatMessages").appendChild(div);
}

/* ===== AI FORECAST FUNCTION ===== */
async function getForecast(specificRoute = "") {
    
  // Visual loading state
  if(specificRoute) {
     document.getElementById("forecastInsight").innerText = "🔄 Analyzing demand for " + specificRoute + "...";
  }

  let taskDescription = "Analyze historical transportation trip data and predict future transportation demand.";
  if (specificRoute) {
      taskDescription += " Specifically analyze the route: " + specificRoute;
  }

  const prompt = `
You are an AI logistics forecasting assistant.

Task:
${taskDescription}

Context:
- Data represents past trips between cities in India
- Focus on identifying demand patterns and return-load opportunities
- Consider route frequency, time patterns, and seasonal behavior
- This is a transportation and supply-chain optimization system

Output Requirements:
- Predict demand level (High / Medium / Low)
- Mention the route (e.g., ${specificRoute || "Pune → Nanded"})
- Explain the reason for the prediction in simple business language
- Avoid technical or machine learning terminology

Response Format (JSON only):
{
  "route": "${specificRoute || "Pune → Nanded"}",
  "predicted_demand": "High",
  "ai_insight": "Based on frequent historical trips..."
}

Goal:
Provide human-readable AI forecasting insights suitable for a logistics dashboard.
`;

  try {
    const res = await fetch(OLLAMA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi", 
        prompt: prompt,
        format: "json", 
        stream: false
      })
    });

    const data = await res.json();
    
    // Parse the JSON response from the LLM
    let result;
    try {
        result = JSON.parse(data.response);
    } catch (e) {
        // Fallback cleanup
        const jsonStr = data.response.replace(/```json/g, "").replace(/```/g, "").trim();
        result = JSON.parse(jsonStr);
    }

    // Update UI
    if (result.route) {
        // Update input value if it came back slightly different/cleaner
        // document.getElementById("routeInput").value = result.route; 
        
        const badge = document.getElementById("forecastBadge");
        badge.innerText = result.predicted_demand + " Demand";
        
        // Color code
        badge.className = "demand-badge"; 
        if (result.predicted_demand.toLowerCase().includes("high")) badge.classList.add("high");
        else if (result.predicted_demand.toLowerCase().includes("medium")) badge.classList.add("medium");
        else badge.classList.add("low");

        document.getElementById("forecastInsight").innerText = result.ai_insight;
    }

  } catch (err) {
    console.error("AI Forecast Error:", err);
    document.getElementById("forecastInsight").innerText = "⚠️ Error fetching forecast. Ensure AI is running.";
  }
}

function updateForecast() {
    const route = document.getElementById("routeInput").value;
    if(route.trim()) {
        getForecast(route);
    } else {
        alert("Please enter a route (e.g. Mumbai to Delhi)");
    }
}

// Initialize on load
window.addEventListener('load', () => {
    // Default initial check
    getForecast("Pune to Nanded");
    
    // Add click listener to badge
    document.getElementById("forecastBadge").addEventListener("click", explainHighDemand);
});

async function explainHighDemand() {
  const route = document.getElementById("routeInput").value;
  const badge = document.getElementById("forecastBadge");
  const insightBox = document.getElementById("forecastInsight");
  
  if (!route) return;

  // Visual feedback
  insightBox.innerText = "🔄 AI is analyzing detailed demand factors for " + route + "...";
  badge.style.opacity = "0.7";

  const prompt = `
You are an AI logistics expert.
Context: The route "${route}" has HIGH transportation demand.
Task: Explain WHY this city/route has high demand right now.
Details to include:
- Types of goods (seasonal crops, industrial goods, festivals?)
- Return load probability
- Expected rate increase (percentage)

Keep it short (2 sentences) and professional.
`;

  try {
    const res = await fetch(OLLAMA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi", // Switched to 'phi' to match chatbot (lighter/more likely installed)
        prompt: prompt,
        stream: false
      })
    });

    const data = await res.json();
    
    // Check if valid response
    if (data.response) {
        insightBox.innerText = "📊 Analysis: " + data.response;
    } else if (data.error) {
        // Handle Ollama error (e.g., model not found)
        insightBox.innerText = "⚠️ AI Error: " + data.error; 
    } else {
        insightBox.innerText = "⚠️ No response from AI.";
    }
    
    badge.style.opacity = "1";

  } catch (err) {
    insightBox.innerText = "⚠️ Could not fetch details. Ensure Ollama is running.";
    badge.style.opacity = "1";
  }
}

/* ===== SECTION TOGGLING (SPA Behavior) ===== */
function showSection(sectionId) {
    const homeSec = document.getElementById("home-section");
    const custSec = document.getElementById("customer-section");
    
    // Safety check if elements don't exist yet
    if (!homeSec || !custSec) {
        if (sectionId === 'customer') window.location.href = 'customer-interface.html'; // Fallback
        else window.location.href = 'home.html';
        return;
    }

    if (sectionId === 'home') {
        homeSec.style.display = 'block';
        custSec.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
    } else if (sectionId === 'customer') {
        homeSec.style.display = 'none';
        custSec.style.display = 'block';
    }
}
