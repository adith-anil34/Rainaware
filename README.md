# Rainaware
# 🌱 RainAware — Smart Irrigation & Weather Monitoring System

**Grow Smarter. Waste Less Water.**

RainAware is an IoT-based smart irrigation and weather monitoring project designed to help monitor plant health and reduce unnecessary watering. It combines an ESP32 microcontroller, environmental sensors, weather forecast data, and a web dashboard to provide real-time environmental monitoring and support automated irrigation decisions.

## 🚀 Features

- 🌡️ **Temperature Monitoring** — Measures ambient temperature using a BME280 sensor.
- 💧 **Humidity Monitoring** — Tracks relative air humidity.
- 🌿 **Soil Moisture Detection** — Monitors soil moisture to identify when plants may need watering.
- 🌧️ **Rain Detection** — Uses a rain sensor to detect rainfall and help prevent unnecessary irrigation.
- ☁️ **Weather Forecast Integration** — Retrieves forecast information through the Open-Meteo API.
- 🤖 **Smart Irrigation Logic** — Uses soil moisture, rain detection, and forecast availability to inform watering decisions.
- 📊 **Live Web Dashboard** — Displays sensor readings, pump status, forecast information, and historical trends.
- 📈 **Data Logging** — Stores sensor readings in an SQLite database for historical analysis.
- 🔌 **IoT Connectivity** — Sends sensor data from the ESP32 to a Python Flask backend over Wi-Fi.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Microcontroller | ESP32 |
| Environmental sensor | BME280 |
| Soil monitoring | Capacitive soil-moisture sensor |
| Rain detection | Rain sensor module |
| Embedded programming | Arduino C++ |
| Backend | Python, Flask |
| Frontend | HTML, CSS, JavaScript |
| Data visualization | Chart.js |
| Database | SQLite |
| Weather data | Open-Meteo API |

## 🏗️ System Architecture

```text
Environmental Sensors
        |
        v
      ESP32
        |
        | Wi-Fi / HTTP
        v
  Python Flask Backend <---- Open-Meteo API
        |
        +---- SQLite Database
        |
        v
    Web Dashboard
        |
        +---- Live Sensor Readings
        +---- Historical Graphs
        +---- Weather Information
        +---- Pump Status
```

## ⚙️ How It Works

1. The ESP32 reads temperature, humidity, atmospheric pressure, soil moisture, and rain sensor status.
2. Sensor readings are sent to the Flask backend over the local Wi-Fi network.
3. The backend stores readings in SQLite and retrieves weather forecast information.
4. The website displays the latest sensor readings and historical trends.
5. The ESP32 evaluates soil moisture, rain detection, forecast availability, and safety limits before initiating a watering cycle.
6. The pump runs for a limited duration, then stops to allow water to soak into the soil.

**Note:** Weather forecasts are estimates and cannot guarantee rainfall. If forecast data is unavailable, the prototype is designed to postpone automatic watering.

## 🔧 Hardware Requirements

- ESP32 development board
- BME280 temperature, humidity, and pressure sensor
- Capacitive soil-moisture sensor
- Rain sensor module
- Water pump
- Compatible MOSFET or motor driver
- External power supply suitable for the pump
- Jumper wires and breadboard
- Plant pot and water reservoir

## 💻 Software Requirements

- Arduino IDE
- ESP32 board support package
- Python 3
- Visual Studio Code (recommended)
- A modern web browser
- Internet access for weather forecasts and external dashboard assets

### Arduino Libraries

Install these libraries through the Arduino IDE Library Manager:

- Adafruit BME280 Library
- Adafruit Unified Sensor
- ArduinoJson

### Python Dependencies

Install the backend dependencies:

```bash
python3 -m pip install flask requests
```

## ▶️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/RainAware.git
cd RainAware
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Create a Python virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install flask requests
```

### 3. Configure the backend

Open `app.py` and configure the latitude and longitude for your location.

Ensure the Flask backend includes the following endpoints:

- `/` — Serves the dashboard.
- `/api/readings` — Receives ESP32 sensor readings.
- `/api/latest` — Returns the latest readings.
- `/api/history` — Returns historical sensor data.

### 4. Configure the ESP32

Open `esp32/rainaware.ino` in Arduino IDE.

Update the following settings:

- Wi-Fi network name
- Wi-Fi password
- Flask server URL using your computer's local IP address
- Soil sensor dry and wet calibration values
- Rain sensor output logic, if required

Install the required Arduino libraries, select the correct ESP32 board and port, and upload the code.

### 5. Run the Flask server

```bash
python3 app.py
```

Open the dashboard in your browser:

```text
http://127.0.0.1:5000
```

The ESP32 and computer must be connected to the same local network for this setup. Allow the Flask port through your computer's firewall if necessary.

## 🔐 Safety Considerations

- Never power a water pump directly from an ESP32 GPIO pin.
- Use a properly rated external power supply and driver.
- Keep electronics protected from water and moisture.
- Calibrate sensors before enabling automated watering.
- Verify rain sensor logic and pump shutdown behavior.
- Test the system with the pump disconnected before enabling automatic operation.
- Do not publish Wi-Fi credentials, API secrets, or other sensitive configuration values.

## 🔮 Future Improvements

- Machine-learning-based rainfall prediction using historical sensor data.
- Mobile-friendly alerts and notifications.
- Multiple plant zones with independent moisture monitoring.
- Water tank level monitoring.
- Cloud-based data storage and remote monitoring.
- Irrigation analytics and water consumption estimates.
- Secure remote configuration and control.

## 🎯 Project Objective

RainAware explores how IoT, environmental sensing, weather information, and web technologies can be combined to support more efficient plant watering and water conservation.

## 👨‍💻 Author

**Adith Anil**

B.Tech Computer Science and Engineering Student

---

*RainAware — Smarter irrigation through connected technology.*
