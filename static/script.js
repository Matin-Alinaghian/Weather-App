const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
const weatherEffect = document.getElementById("weatherEffect");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const feelsLike = document.getElementById("feelsLike");
const tempMin = document.getElementById("tempMin");
const tempMax = document.getElementById("tempMax");
const weatherIcon = document.getElementById("weatherIcon");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const weatherCard = document.getElementById("weatherCard");

function changeCardColor(temp) {

    if (temp < 10) {

        weatherCard.style.background =
            "rgba(37, 99, 235, 0.5)";

    } else if (temp >= 10 && temp < 25) {

        weatherCard.style.background =
            "rgba(34, 197, 94, 0.5)";

    } else {

        weatherCard.style.background =
            "rgba(249, 115, 22, 0.5)";

    }

}

function changeBackground(data) {
    weatherEffect.innerHTML = "";
    let description = data.description.toLowerCase();


    if (data.icon.includes("n")) {

        document.body.className = "night";

        createEffect("night");

        return;
    }


    if (
        description.includes("rain") ||
        description.includes("drizzle") ||
        description.includes("storm")
    ) {

        document.body.className = "rain";

        createEffect("rain");

        return;
    }


    if (description.includes("clear")) {

        document.body.className = "sunny";

        createEffect("sunny");

        return;
    }


    if (description.includes("cloud")) {

        document.body.className = "cloud";

        createEffect("");

        return;
    }


}

function createEffect(type) {


    weatherEffect.innerHTML = "";


    if (type === "rain") {


        for (let i = 0; i < 80; i++) {


            let drop = document.createElement("div");

            drop.className = "raindrop";


            drop.style.left =
                Math.random() * 100 + "%";


            drop.style.animationDelay =
                Math.random() + "s";


            weatherEffect.appendChild(drop);

        }

    } else if (type === "night") {


        for (let i = 0; i < 100; i++) {


            let star = document.createElement("div");

            star.className = "star";


            star.style.left =
                Math.random() * 100 + "%";


            star.style.top =
                Math.random() * 80 + "%";


            weatherEffect.appendChild(star);

        }


    } else if (type === "sunny") {


        let sun = document.createElement("div");

        sun.className = "sun";

        weatherEffect.appendChild(sun);

    }


}

function convertTime(timestamp) {

    const date = new Date(timestamp * 1000);

    return date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit"
    });

}

function searchWeather() {

    const city = cityInput.value.trim();


    if (city === "") {

        alert("Enter city name");

        return;

    }


    searchBtn.innerHTML = "Loading...";

    searchBtn.disabled = true;

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {

            console.log(data);
            console.log("Current:", data.temperature);
            console.log("Min:", data.temp_min);
            console.log("Max:", data.temp_max);

            cityName.innerHTML = data.city + " , " + data.country;

            temperature.innerHTML = data.temperature + " °C";
            changeCardColor(data.temperature);
            changeBackground(data);

            description.innerHTML = data.description;

            humidity.innerHTML = "Humidity: " + data.humidity + "%";

            wind.innerHTML = "Wind: " + data.wind_speed + " m/s";

            pressure.innerHTML = "Pressure: " + data.pressure + " hPa";

            feelsLike.innerHTML = "Feels like: " + data.feels_like + " °C";

            tempMin.innerHTML = "Min: " + data.temp_min + " °C";

            tempMax.innerHTML = "Max: " + data.temp_max + " °C";
            if (data.icon.includes("n")) {
                weatherIcon.innerHTML = '<i class="fa-solid fa-moon"></i>';
            } else {
                weatherIcon.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
            sunrise.innerHTML =
                "Sunrise: " + convertTime(data.sunrise);


            sunset.innerHTML =
                "Sunset: " + convertTime(data.sunset);
            searchBtn.innerHTML = "Search";

            searchBtn.disabled = false;

        });
}

searchBtn.addEventListener("click", searchWeather);
cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchWeather();

    }

});
cityInput.addEventListener("input", function () {

    let query = cityInput.value.trim();


    suggestions.innerHTML = "";


    if (query === "") {
        return;
    }


    fetch(`/search-city?q=${query}`)

        .then(response => response.json())

        .then(data => {


            data.forEach(city => {


                let item = document.createElement("div");


                item.innerHTML = city;

                item.onclick = function () {


                    cityInput.value = city.split(",")[0];


                    suggestions.innerHTML = "";


                    searchWeather();


                };


                suggestions.appendChild(item);


            });


        });


});