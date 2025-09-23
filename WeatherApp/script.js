// ==========================
// WEATHER + EVENTBRITE APP
// ==========================

// 1️⃣ API KEYS
const weatherApiKey = "YOUR_OPENWEATHERMAP_API_KEY";
const eventbriteToken = "YOUR_EVENTBRITE_OAUTH_TOKEN"; // from Eventbrite Developer

// 2️⃣ DOM ELEMENTS
const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");

const weatherSection = document.getElementById("weatherSection");
const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const temperature = document.getElementById("temperature");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");

const eventsSection = document.getElementById("eventsSection");
const eventsList = document.getElementById("eventsList");

// 3️⃣ EVENT LISTENER
getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim() || "Chicago";
  getWeather(city);
});

// 4️⃣ GET WEATHER
async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    // Display weather info
    cityName.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = Math.round(data.main.temp);
    wind.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;

    // Show weather section
    weatherSection.classList.remove("hidden");
    weatherSection.classList.add("show");

    // Fetch events
    const isOutdoor = !["rain", "snow", "drizzle", "thunderstorm"].some(w =>
      data.weather[0].description.toLowerCase().includes(w)
    );
    getChicagoEvents(isOutdoor);

  } catch (error) {
    alert(error.message);
  }
}

// 5️⃣ GET EVENTS FROM EVENTBRITE
async function getChicagoEvents(isOutdoor) {
  try {
    const today = new Date();
    const startDate = today.toISOString();
    const endDate = new Date(today.getTime() + 7*24*60*60*1000).toISOString(); // 1 week ahead

    // Filter: outdoor vs indoor keyword
    const keyword = isOutdoor ? "outdoor" : "indoor";

    const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=Chicago,IL&start_date.range_start=${startDate}&start_date.range_end=${endDate}&q=${keyword}&sort_by=date`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${eventbriteToken}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch events");

    const data = await response.json();

    // Display events
    eventsList.innerHTML = "";
    const events = data.events.slice(0, 5); // show top 5
    events.forEach(event => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${event.name.text}</strong><br>${new Date(event.start.local).toLocaleString()}<br>${event.url}`;
      eventsList.appendChild(li);
    });

    // Show events section
    eventsSection.classList.remove("hidden");
    eventsSection.classList.add("show");

  } catch (error) {
    console.error(error);
    eventsList.innerHTML = `<li>No events found</li>`;
    eventsSection.classList.remove("hidden");
    eventsSection.classList.add("show");
  }
}
