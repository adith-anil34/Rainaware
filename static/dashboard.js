const $ = (id) => document.getElementById(id);

let historyChart = null;
let refreshing = false;

function setConnection(connected, message) {
  $("connectionText").textContent = message;
  $("connectionDot").className =
    "dot " + (connected ? "connected" : "disconnected");
}

function formatNumber(value, decimals = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(decimals) : "--";
}

function setForecast(value) {
  if (value === true) {
    $("forecastStatus").textContent = "Rain expected";
    $("forecastDescription").textContent =
      "Rain may arrive soon. Watering may be delayed.";
    $("weatherSymbol").textContent = "🌧";
  } else if (value === false) {
    $("forecastStatus").textContent = "No significant rain";
    $("forecastDescription").textContent =
      "The forecast does not indicate significant rain in the checking window.";
    $("weatherSymbol").textContent = "☀";
  } else {
    $("forecastStatus").textContent = "Forecast unavailable";
    $("forecastDescription").textContent =
      "Weather data could not be confirmed. Automatic watering should wait.";
    $("weatherSymbol").textContent = "☁";
  }
}

function updateAdvice(data) {
  if (data.raining) {
    $("advice").textContent =
      "Rain is being detected. The pump should remain off.";
  } else if (data.soil_moisture <= 35) {
    if (data.forecast_rain_soon === true) {
      $("advice").textContent =
        "Soil is dry, but rain is forecast. Check soil again before watering.";
    } else if (data.forecast_rain_soon !== false) {
      $("advice").textContent =
        "Soil is dry, but the forecast is unavailable. Automatic watering should wait.";
    } else {
      $("advice").textContent =
        "Soil moisture is low. Check the pump and irrigation safety conditions.";
    }
  } else {
    $("advice").textContent =
      "Soil moisture appears sufficient. Continue monitoring.";
  }
}

function updateLatest(data) {
  $("temperature").textContent = formatNumber(data.temperature);
  $("humidity").textContent = formatNumber(data.humidity);
  $("pressure").textContent = formatNumber(data.pressure);
  $("soil").textContent = formatNumber(data.soil_moisture, 0);

  const soil = Math.max(0, Math.min(100, Number(data.soil_moisture) || 0));
  $("soilBar").style.width = soil + "%";

  $("soilDescription").textContent =
    soil <= 35 ? "Low moisture" :
    soil < 70 ? "Moderate moisture" :
    "High moisture";

  $("rainStatus").textContent = data.raining ? "Detected" : "Not detected";
  $("rainStatus").style.color = data.raining ? "#f2bb75" : "#a4e8a7";

  $("pumpStatus").textContent = data.pump_on ? "Pump is running" : "Pump is off";
  $("pumpDescription").textContent = data.pump_on
    ? "Water pump reported as active by the ESP32."
    : "No active watering reported by the ESP32.";

  $("pumpBadge").textContent = data.pump_on ? "ON" : "OFF";
  $("pumpBadge").className =
    "pump-badge " + (data.pump_on ? "on" : "off");

  setForecast(data.forecast_rain_soon);
  updateAdvice(data);

  if (data.timestamp) {
    const time = new Date(data.timestamp);
    $("lastUpdated").textContent =
      "Last reading: " +
      (Number.isNaN(time.getTime()) ? data.timestamp : time.toLocaleTimeString());
  }
}

function createChart() {
  const canvas = $("historyChart");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  historyChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Soil moisture (%)",
          data: [],
          borderColor: "#a4e8a7",
          backgroundColor: "rgba(164,232,167,0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2
        },
        {
          label: "Humidity (%)",
          data: [],
          borderColor: "#83c8f2",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        intersect: false,
        mode: "index"
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: "rgba(142,156,144,0.08)" },
          ticks: { color: "#8e9c90", maxTicksLimit: 6 }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: "rgba(142,156,144,0.12)" },
          ticks: {
            color: "#8e9c90",
            callback: (value) => value + "%"
          }
        }
      }
    }
  });
}

async function updateHistory() {
  const response = await fetch("/api/history", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load sensor history");
  }

  const rows = await response.json();

  if (!historyChart) return;

  historyChart.data.labels = rows.map((row) => {
    const time = new Date(row.timestamp);
    return Number.isNaN(time.getTime())
      ? row.timestamp
      : time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
  });

  historyChart.data.datasets[0].data =
    rows.map((row) => Number(row.soil_moisture));

  historyChart.data.datasets[1].data =
    rows.map((row) => Number(row.humidity));

  historyChart.update("none");
}

async function refreshDashboard() {
  if (refreshing) return;
  refreshing = true;

  try {
    const response = await fetch("/api/latest", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("No sensor readings received");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    updateLatest(data);
    setConnection(true, "Connected");

    try {
      await updateHistory();
    } catch (historyError) {
      console.warn("History update failed:", historyError);
    }
  } catch (error) {
    console.error("Dashboard update failed:", error);
    setConnection(false, "Waiting for data");
  } finally {
    refreshing = false;
  }
}

createChart();

$("refreshButton").addEventListener("click", refreshDashboard);

refreshDashboard();
setInterval(refreshDashboard, 5000);
