from flask import *
import requests
import json
import os

app = Flask(__name__)
API_KEY = "a664a74a7176b74331ebe155e9f56404"
CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

with open("cities.json", "r", encoding="utf-8") as file:
    cities = json.load(file)


@app.route("/search-city")
def search_city():
    query = request.args.get("q", "").lower()

    results = []

    for city in cities:

        if query in city["name"].lower():
            results.append(
                city["name"] + ", " + city["country"]
            )

    return results[:10]


def get_weather(city):
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    current_response = requests.get(CURRENT_URL, params=params)

    if current_response.status_code != 200:
        return None

    current = current_response.json()
    forecast_response = requests.get(FORECAST_URL, params=params)

    forecast = forecast_response.json()
    if forecast_response.status_code != 200:
        return None
    temps = []

    today = forecast["list"][0]["dt_txt"][:10]

    for item in forecast["list"]:

        if item["dt_txt"].startswith(today):
            temps.append(item["main"]["temp"])

    today_min = min(temps)

    today_max = max(temps)

    weather = {

        "city": current["name"],

        "country": current["sys"]["country"],

        "temperature": current["main"]["temp"],

        "feels_like": current["main"]["feels_like"],

        "temp_min": round(today_min, 1),

        "temp_max": round(today_max, 1),

        "humidity": current["main"]["humidity"],

        "pressure": current["main"]["pressure"],

        "wind_speed": current["wind"]["speed"],

        "description": current["weather"][0]["description"],

        "icon": current["weather"][0]["icon"],

        "sunrise": current["sys"]["sunrise"],

        "sunset": current["sys"]["sunset"]

    }

    return weather


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/weather")
def weather():
    city = request.args.get("city")

    weather = get_weather(city)

    return weather


if __name__ == '__main__':
    app.run(debug=True)
