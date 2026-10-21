"""
RainAware starter backend.

Routes:
  /               -> dashboard page
  /api/readings   -> POST: ESP32 sends a JSON reading here
  /api/latest     -> GET: most recent reading
  /api/history    -> GET: last 100 readings

NOTE: If you already have your own app.py, keep yours and just make sure it
has these routes and returns the same JSON field names.
"""
from collections import deque
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

readings = deque(maxlen=100)

FIELDS = [
    "temperature",
    "humidity",
    "pressure",
    "soil_moisture",
    "raining",
    "pump_on",
    "forecast_rain_soon",
]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/readings", methods=["POST"])
def add_reading():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON"}), 400

    reading = {key: data.get(key) for key in FIELDS}
    reading["timestamp"] = datetime.now(timezone.utc).isoformat()
    readings.append(reading)
    return jsonify({"status": "ok"}), 201


@app.route("/api/latest")
def latest():
    if not readings:
        return jsonify({"error": "No readings yet"}), 404
    return jsonify(readings[-1])


@app.route("/api/history")
def history():
    return jsonify(list(readings))


if __name__ == "__main__":
    # host 0.0.0.0 lets the ESP32 reach Flask over your Wi-Fi
    app.run(host="0.0.0.0", port=5000, debug=True)
