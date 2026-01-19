const OLLAMA_API = "http://localhost:11434/api/generate";

// Mock driver dataset
const drivers = [
  { name: "Ramesh Patil", city: "Pune", truck: "Refrigerated Van", distance: 4 },
  { name: "Suresh Jadhav", city: "Pune", truck: "Pickup Van", distance: 7 },
  { name: "Amit Deshmukh", city: "Pune", truck: "Mini Truck", distance: 10 }
];

async function emergencyBooking() {
  const load = loadType.value.toLowerCase();
  const from = fromCity.value;
  const to = toCity.value;
  const result = document.getElementById("result");

  if (!load || !from || !to) {
    alert("Please fill all fields");
    return;
  }

  result.innerText = "⏳ Assigning emergency transport...";

  // ETA calculation (mock logic)
  const etaMinutes = 20 + Math.floor(Math.random() * 15);
  etaTime.innerText = etaMinutes + " minutes";
  etaBox.style.display = "block";

  // Show nearest drivers
  driverCards.innerHTML = "";
  drivers.forEach(d => {
    const div = document.createElement("div");
    div.className = "driver-card";
    div.innerHTML = `
      <h4>👨‍✈️ ${d.name}</h4>
      <p><b>Truck:</b> ${d.truck}</p>
      <p><b>Distance:</b> ${d.distance} km away</p>
      <p>⭐ Rating: 4.${Math.floor(Math.random()*5)+3}</p>
    `;
    driverCards.appendChild(div);
  });
  driverBox.style.display = "block";

  // Select best truck
  let bestTruck = "Mini Truck";
  if (load.includes("medicine") || load.includes("medical")) {
    bestTruck = "Refrigerated Van";
  } else if (load.includes("food")) {
    bestTruck = "Pickup Van";
  }

  const prompt = `
You are an emergency logistics assistant in India.

Emergency load: ${load}
From: ${from}
To: ${to}
Assigned truck: ${bestTruck}

Explain clearly:
- Why this truck is selected
- How emergency priority helps
- How fast response saves lives

Use simple natural language.
`;

  try {
    const res = await fetch(OLLAMA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi",
        prompt: prompt,
        stream: false,
        options: { num_predict: 180 }
      })
    });

    const data = await res.json();
    result.innerText =
`🚑 Emergency Priority Activated

🚚 Assigned Truck: ${bestTruck}

${data.response}

⚡ Driver dispatched immediately with priority clearance.`;

  } catch {
    result.innerText = "⚠️ Ollama is not running. Please start it.";
  }
}
