// DOM Elements
const emergencyTypeSection = document.getElementById('emergencyTypeSection');
const detailsSection = document.getElementById('detailsSection');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');

const nextToDetailsBtn = document.getElementById('nextToDetails');
const backToTypeBtn = document.getElementById('backToType');
const submitEmergencyBtn = document.getElementById('submitEmergency');
const newEmergencyBtn = document.getElementById('newEmergency');

const emergencyTypeInputs = document.querySelectorAll('input[name="emergencyType"]');
const destinationInput = document.getElementById('destination');
const vehicleNumberInput = document.getElementById('vehicleNumber');

const garageNumberEl = document.getElementById('garageNumber');
const garageDetailsEl = document.getElementById('garageDetails');
const garageNameEl = document.getElementById('garageName');
const garageProfileCard = document.getElementById('garageProfileCard');
const recommendationsGrid = document.getElementById('recommendationsGrid');

// Ollama API Configuration
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'phi'; // Change this to your preferred model

// Event Listeners
emergencyTypeInputs.forEach(input => {
    input.addEventListener('change', () => {
        nextToDetailsBtn.disabled = false;
    });
});

nextToDetailsBtn.addEventListener('click', () => {
    emergencyTypeSection.classList.add('hidden');
    detailsSection.classList.remove('hidden');
});

backToTypeBtn.addEventListener('click', () => {
    detailsSection.classList.add('hidden');
    emergencyTypeSection.classList.remove('hidden');
    // Reset form
    destinationInput.value = '';
    vehicleNumberInput.value = '';
});

submitEmergencyBtn.addEventListener('click', async () => {
    // Validate inputs
    const destination = destinationInput.value.trim();
    const vehicleNumber = vehicleNumberInput.value.trim();
    const emergencyType = document.querySelector('input[name="emergencyType"]:checked')?.value;

    if (!destination || !vehicleNumber || !emergencyType) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading section
    detailsSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    try {
        // Try Ollama API with a short timeout (5 seconds)
        const result = await Promise.race([
            getEmergencyAssistance(emergencyType, destination, vehicleNumber),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 5000) // 5 second timeout
            )
        ]);
        
        // Display results
        displayResults(result);
        
    } catch (error) {
        console.error('API Error or Timeout:', error);
        // Immediately show mock data if Ollama fails, times out, or is unavailable
        console.log('Using mock data - Ollama unavailable or slow');
        const mockResult = getMockData(emergencyType, destination, vehicleNumber);
        displayResults(mockResult);
    }
});

newEmergencyBtn.addEventListener('click', () => {
    // Reset everything
    resultsSection.classList.add('hidden');
    emergencyTypeSection.classList.remove('hidden');
    
    // Clear all inputs
    emergencyTypeInputs.forEach(input => input.checked = false);
    destinationInput.value = '';
    vehicleNumberInput.value = '';
    nextToDetailsBtn.disabled = true;
    
    // Reset results
    garageNumberEl.textContent = '-';
    garageDetailsEl.innerHTML = '-';
    garageNameEl.textContent = 'Loading...';
    recommendationsGrid.innerHTML = '';
});

// Function to call Ollama API
async function getEmergencyAssistance(emergencyType, destination, vehicleNumber) {
    const prompt = `You are a helpful emergency assistance system for drivers in India. A driver has reported a ${emergencyType} emergency.

Driver Details:
- Emergency Type: ${emergencyType} (vehicle minor emergency)
- Location: ${destination}
- Vehicle Number: ${vehicleNumber}

Provide 10-20 different emergency assistance recommendations. Include various services like: nearest garage, ambulance service, toll car, roadside assistance, mechanic on call, spare parts shop, fuel station, hospital nearby, police helpline, insurance claim help, vehicle recovery service, mobile mechanic, tire service, battery replacement, emergency medical help, tow truck service, etc.

IMPORTANT: Return ONLY valid JSON format, no additional text before or after the JSON.

JSON Format (generate 10-20 recommendations):
{
  "nearestGarage": {
    "name": "Garage name",
    "number": "10-digit Indian phone number like 9876543210",
    "details": "Write 8-10 lines in natural, conversational language. Explain garage name, complete address near ${destination}, distance in km, estimated arrival time in minutes, services offered for ${emergencyType}, working hours, ratings if available, and any helpful tips. Write like explaining to a friend - use simple Hindi-English mix if needed, be warm and helpful."
  },
  "recommendations": [
    {
      "serviceType": "Ambulance Service",
      "icon": "🚑",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining service name, contact person, when they will arrive, what they provide, vehicle type, cost if relevant, and instructions."
    },
    {
      "serviceType": "Roadside Assistance",
      "icon": "🛟",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining the roadside assistance service."
    },
    {
      "serviceType": "Toll Car Service",
      "icon": "🚗",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining toll car service."
    },
    {
      "serviceType": "Mobile Mechanic",
      "icon": "🔧",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining mobile mechanic service."
    },
    {
      "serviceType": "Tire Service",
      "icon": "🛞",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining tire service."
    },
    {
      "serviceType": "Battery Replacement",
      "icon": "🔋",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining battery replacement service."
    },
    {
      "serviceType": "Tow Truck Service",
      "icon": "🚛",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining tow truck service."
    },
    {
      "serviceType": "Emergency Medical",
      "icon": "🏥",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining emergency medical service."
    },
    {
      "serviceType": "Spare Parts Shop",
      "icon": "⚙️",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining spare parts availability."
    },
    {
      "serviceType": "Fuel Station",
      "icon": "⛽",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining nearest fuel station."
    },
    {
      "serviceType": "Police Helpline",
      "icon": "🚨",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining police assistance."
    },
    {
      "serviceType": "Insurance Help",
      "icon": "📋",
      "name": "Service name",
      "number": "10-digit Indian phone number",
      "details": "Write 8-10 lines explaining insurance claim assistance."
    }
  ]
}

IMPORTANT: Generate 10-20 different service recommendations in the "recommendations" array. Include ambulance, various mechanics, roadside services, medical help, and other relevant services for ${emergencyType} emergency at ${destination}.

Guidelines:
- Write in simple, natural language that drivers use daily
- Use 8-10 lines for each details section
- Include name, location, distance, arrival time, services, cost if relevant
- Be friendly and reassuring
- Use clear, simple words - avoid complex technical terms
- Make each recommendation unique and helpful`;

    try {
        // Add timeout to fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                prompt: prompt,
                stream: false
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.response || '';

        // Parse the response to extract JSON
        let result;
        try {
            // Try to extract JSON from the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
                // Validate that result has the expected structure
                if (!result.nearestGarage && !result.recommendations) {
                    throw new Error('Invalid response structure');
                }
            } else {
                // Fallback: create structured response from text
                result = parseTextResponse(responseText, emergencyType, destination, vehicleNumber);
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            // Fallback: create structured response
            result = parseTextResponse(responseText, emergencyType, destination, vehicleNumber);
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        // If it's a network error or timeout, immediately return mock data
        if (error.name === 'AbortError' || error.message === 'Request timeout' || !navigator.onLine) {
            throw error; // Re-throw to trigger mock data in catch block
        }
        // Return mock data if API fails (for testing without Ollama)
        return getMockData(emergencyType, destination, vehicleNumber);
    }
}

// Fallback function to parse text response
function parseTextResponse(text, emergencyType, destination, vehicleNumber) {
    // Extract information from text response
    const garageMatch = text.match(/garage[:\s]*([^\n]+)/i);
    const ambulanceMatch = text.match(/ambulance[:\s]*([^\n]+)/i);
    const tollMatch = text.match(/toll[:\s]*([^\n]+)/i);
    const numberMatch = text.match(/\d{10,}/g);

    const numbers = numberMatch || ['1800-XXX-XXXX', '1800-XXX-XXXX', '1800-XXX-XXXX'];
    
    // Create basic structure with fallback recommendations
    return {
        nearestGarage: {
            name: 'Nearest Garage',
            number: numbers[0] || '1800-XXX-XXXX',
            details: garageMatch ? garageMatch[1] : `Nearest garage for ${emergencyType} at ${destination}. Estimated arrival: 30-45 minutes.`
        },
        recommendations: [
            {
                serviceType: 'Ambulance Service',
                icon: '🚑',
                name: 'Emergency Ambulance',
                number: numbers[1] || '102',
                details: ambulanceMatch ? ambulanceMatch[1] : `Emergency ambulance service available near ${destination}. Call for immediate medical assistance.`
            },
            {
                serviceType: 'Toll Car Service',
                icon: '🚗',
                name: 'Toll Car Service',
                number: numbers[2] || '1800-XXX-XXXX',
                details: tollMatch ? tollMatch[1] : `Toll car service available for ${emergencyType}. Estimated arrival: 20-30 minutes.`
            }
        ]
    };
}

// Mock data function (used if Ollama is not available)
function getMockData(emergencyType, destination, vehicleNumber) {
    // Generate 15 mock recommendations
    const recommendations = [
        {
            serviceType: 'Ambulance Service',
            icon: '🚑',
            name: 'Emergency Ambulance - 108',
            number: '108',
            details: `Emergency ambulance service is available 24/7 near ${destination}. They provide immediate medical assistance. The ambulance will reach your location within 15-20 minutes. This is a free government service. Just dial 108 for emergency medical help.`
        },
        {
            serviceType: 'Roadside Assistance',
            icon: '🛟',
            name: 'Quick Roadside Help',
            number: '1800-555-1234',
            details: `Professional roadside assistance service available for ${emergencyType} at ${destination}. They offer jump-start, tire change, fuel delivery, and lockout services. Estimated arrival time is 25-30 minutes. Charges start from ₹500.`
        },
        {
            serviceType: 'Mobile Mechanic',
            icon: '🔧',
            name: 'Mobile Fix-It Service',
            number: '98765-43210',
            details: `Certified mobile mechanic will come to your location near ${destination}. Specializes in ${emergencyType === 'puncture' ? 'tire repair and replacement' : 'quick vehicle repairs'}. They arrive within 30-45 minutes. Charges are ₹800-1500 depending on the issue.`
        },
        {
            serviceType: 'Toll Car Service',
            icon: '🚗',
            name: 'Express Toll Car',
            number: '1800-111-2222',
            details: `Reliable toll car service for ${emergencyType}. They will send a replacement vehicle within 20-30 minutes to your location at ${destination}. This service helps you continue your journey while your vehicle gets fixed.`
        },
        {
            serviceType: 'Tire Service',
            icon: '🛞',
            name: '24/7 Tire Service',
            number: '98765-12345',
            details: `Expert tire service available near ${destination}. They provide tire repair, replacement, and wheel alignment services. For ${emergencyType}, they can help you immediately. Estimated arrival: 35-40 minutes.`
        },
        {
            serviceType: 'Battery Replacement',
            icon: '🔋',
            name: 'Battery on Wheels',
            number: '1800-999-8888',
            details: `Mobile battery replacement service available at ${destination}. If your vehicle battery is dead, they will bring a new battery and install it on the spot. Service time: 20-25 minutes. Cost: ₹2500-4000.`
        },
        {
            serviceType: 'Tow Truck Service',
            icon: '🚛',
            name: 'Heavy Duty Towing',
            number: '1800-444-5555',
            details: `Professional tow truck service for ${emergencyType} at ${destination}. They can tow your vehicle to the nearest garage safely. Available 24/7. Charges: ₹10-15 per km. Estimated arrival: 45-60 minutes.`
        },
        {
            serviceType: 'Emergency Medical',
            icon: '🏥',
            name: 'Nearest Hospital',
            number: '102',
            details: `Nearest hospital information for ${destination}. Emergency medical services are available 24 hours. If you or anyone is injured, call 102 immediately. The hospital is approximately 8-10 km away from your location.`
        },
        {
            serviceType: 'Spare Parts Shop',
            icon: '⚙️',
            name: 'Auto Parts Store',
            number: '98765-99999',
            details: `Auto spare parts shop near ${destination}. They stock parts for all major vehicle brands. Open from 9 AM to 8 PM. If you need a specific part for ${emergencyType}, they might have it in stock. Distance: 6-7 km.`
        },
        {
            serviceType: 'Fuel Station',
            icon: '⛽',
            name: 'Nearest Petrol Pump',
            number: '1800-333-4444',
            details: `Nearest fuel station to ${destination} is about 3-4 km away. They offer petrol, diesel, and also provide basic vehicle services. Open 24 hours. In case you ran out of fuel, they can deliver fuel to your location.`
        },
        {
            serviceType: 'Police Helpline',
            icon: '🚨',
            name: 'Police Emergency',
            number: '100',
            details: `Police emergency helpline is 100. Available 24/7 for any security concerns at ${destination}. If you feel unsafe or need police assistance during this ${emergencyType}, don't hesitate to call them immediately.`
        },
        {
            serviceType: 'Insurance Help',
            icon: '📋',
            name: 'Insurance Claim Support',
            number: '1800-777-8888',
            details: `Insurance claim assistance for ${emergencyType} at ${destination}. They help you with the claim process, documentation, and getting your vehicle repaired at authorized garages. Available 9 AM to 6 PM.`
        },
        {
            serviceType: 'Vehicle Recovery',
            icon: '🚜',
            name: 'Vehicle Recovery Service',
            number: '98765-88888',
            details: `Professional vehicle recovery service for ${emergencyType} near ${destination}. They have specialized equipment to recover vehicles safely. Service available 24/7. Charges: ₹2000-3000 depending on distance.`
        },
        {
            serviceType: 'Water Delivery',
            icon: '💧',
            name: 'Emergency Water Service',
            number: '1800-666-7777',
            details: `If your vehicle needs coolant or water, this service delivers it to your location at ${destination}. They also provide engine oil and other fluids. Quick service within 25-30 minutes. Very helpful for breakdowns.`
        },
        {
            serviceType: 'Vehicle Lockout',
            icon: '🔐',
            name: 'Lockout Service',
            number: '98765-77777',
            details: `If you're locked out of your vehicle at ${destination}, these professionals can help unlock your car safely without damage. Service time: 15-20 minutes. Charges: ₹500-800. Available 24/7.`
        }
    ];

    return {
        nearestGarage: {
            name: 'ABC Auto Service Garage',
            number: '1800-123-4567',
            details: `Hello driver! I found the nearest garage for your ${emergencyType} at ${destination}. ABC Auto Service Garage is located about 5 kilometers from your current location. They specialize in ${emergencyType === 'puncture' ? 'tire repair and replacement services' : 'quick breakdown assistance and repairs'}. The mechanic will reach you in approximately 30-45 minutes. They are open from 8 AM to 9 PM daily. The garage has good ratings and experienced mechanics. For your ${emergencyType}, they will bring all necessary tools and spare parts. Don't worry, help is on the way!`
        },
        recommendations: recommendations
    };
}

// Function to format and display results
function displayResults(result) {
    try {
        // Handle both old and new JSON structure
        let garageData, recommendations = [];
        
        if (!result) {
            // If no result, use mock data
            const mockResult = getMockData('breakdown', 'location', 'vehicle');
            result = mockResult;
        }
        
        if (result.nearestGarage) {
            // New structure with multiple recommendations
            garageData = result.nearestGarage;
            recommendations = result.recommendations || [];
        } else if (result.garageNumber || result.garageDetails) {
            // Old structure - convert to new format
            garageData = {
                name: 'Nearest Garage',
                number: result.garageNumber || '1800-XXX-XXXX',
                details: result.garageDetails || 'Garage service available.'
            };
            // Create default recommendations from old data
            if (result.tollCarNumber) {
                recommendations = [{
                    serviceType: 'Toll Car Service',
                    icon: '🚗',
                    name: 'Toll Car Service',
                    number: result.tollCarNumber,
                    details: result.tollCarDetails || 'Toll car service available.'
                }];
            }
        } else {
            // Fallback: use mock data
            const mockResult = getMockData('breakdown', 'location', 'vehicle');
            garageData = mockResult.nearestGarage;
            recommendations = mockResult.recommendations || [];
        }
        
        // Ensure we have at least some recommendations
        if (!recommendations || recommendations.length === 0) {
            const mockResult = getMockData('breakdown', 'location', 'vehicle');
            recommendations = mockResult.recommendations || [];
        }
        
        // Display garage profile
        displayGarageProfile(garageData);
        
        // Display all recommendations
        displayRecommendations(recommendations);
        
        // Show results section
        loadingSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error displaying results:', error);
        // Final fallback: show mock data
        const mockResult = getMockData('breakdown', 'location', 'vehicle');
        displayGarageProfile(mockResult.nearestGarage);
        displayRecommendations(mockResult.recommendations);
        loadingSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
    }
}

// Function to display garage profile
function displayGarageProfile(garage) {
    if (!garage) return;
    
    const garageName = garage.name || 'Nearest Garage';
    const garageNumber = garage.number || '-';
    const garageDetails = formatDetails(garage.details || '-');
    
    garageNameEl.textContent = garageName;
    garageNumberEl.textContent = garageNumber;
    garageNumberEl.href = `tel:${garageNumber.replace(/[^0-9+]/g, '')}`;
    garageDetailsEl.innerHTML = garageDetails;
}

// Function to display all recommendations in grid
function displayRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) {
        recommendationsGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No additional recommendations available at the moment.</p>';
        return;
    }
    
    // Clear existing content
    recommendationsGrid.innerHTML = '';
    
    // Create card for each recommendation
    recommendations.forEach((rec, index) => {
        const card = createRecommendationCard(rec, index);
        recommendationsGrid.appendChild(card);
    });
}

// Function to create a recommendation card
function createRecommendationCard(rec, index) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const icon = rec.icon || '📞';
    const serviceType = rec.serviceType || 'Service';
    const name = rec.name || 'Service Name';
    const number = rec.number || '-';
    const details = formatDetails(rec.details || '-');
    const phoneNumber = number.replace(/[^0-9+]/g, '');
    
    card.innerHTML = `
        <div class="rec-icon">${icon}</div>
        <h4 class="rec-service-type">${serviceType}</h4>
        <div class="rec-name">${name}</div>
        <div class="rec-contact-section">
            <a href="tel:${phoneNumber}" class="rec-contact-number">${number}</a>
        </div>
        <div class="rec-details">${details}</div>
    `;
    
    return card;
}

// Function to format details text for better readability (natural language)
function formatDetails(details) {
    if (!details || details === '-') {
        return '<span style="color: #999;">No details available</span>';
    }
    
    // Handle escaped newlines from JSON (\n) and actual newlines
    let formatted = details
        .replace(/\\n/g, '\n')  // Convert escaped newlines
        .replace(/\n/g, '<br>')  // Convert actual newlines to HTML breaks
        .replace(/<br>\s*<br>/g, '<br>');  // Remove double breaks
    
    // Split into sentences/paragraphs for better readability
    formatted = formatted.replace(/\. /g, '.<br>');
    formatted = formatted.replace(/! /g, '!<br>');
    formatted = formatted.replace(/\? /g, '?<br>');
    
    // Format labels if they exist (text before colons)
    formatted = formatted.replace(/([A-Za-z\s]+):\s*(.+?)(?=<br>|$)/g, function(match, label, value) {
        // Only format if label is short (likely a label, not part of sentence)
        if (label.length < 20) {
            return `<strong>${label}:</strong> ${value}`;
        }
        return match;
    });
    
    // Highlight important keywords in natural language
    const keywords = [
        'garage', 'name', 'address', 'location', 'distance', 'km', 'kilometers',
        'arrival', 'arrive', 'minutes', 'time', 'hours', 'available', 'working',
        'service', 'services', 'contact', 'phone', 'number', 'call',
        'estimated', 'cost', 'price', 'charge', 'vehicle', 'car', 'truck'
    ];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        formatted = formatted.replace(regex, (match) => {
            // Don't double-bold already bolded text
            if (!match.includes('<strong>')) {
                return `<strong style="color: #667eea;">${match}</strong>`;
            }
            return match;
        });
    });
    
    // Format phone numbers (Indian format)
    formatted = formatted.replace(/(\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{4,6})/g, '<strong style="color: #e74c3c; font-size: 1.05em;">$1</strong>');
    
    // Clean up extra breaks
    formatted = formatted.replace(/<br>{3,}/g, '<br><br>');
    
    // Add proper spacing
    formatted = formatted.trim();
    
    // Wrap in paragraph tags for better styling
    return `<div style="line-height: 1.8; color: #444;">${formatted}</div>`;
}

// Add form validation
destinationInput.addEventListener('input', validateForm);
vehicleNumberInput.addEventListener('input', validateForm);

function validateForm() {
    const destination = destinationInput.value.trim();
    const vehicleNumber = vehicleNumberInput.value.trim();
    submitEmergencyBtn.disabled = !(destination && vehicleNumber);
}

// Initialize
validateForm();
