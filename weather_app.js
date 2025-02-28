//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
const card = document.getElementById("card");
const info = document.querySelectorAll(".info");
const form = document.getElementById("form");
const locations = document.getElementById("location");
let err;

const key = "34d59099eff536ab3c8282063704cec8";

form.addEventListener("submit", async (element) => {
	element.preventDefault();
	let city = locations.value;
	if (err) document.body.removeChild(err);

	if (city) {
		try {
			// Get the geographic coordinates
			const geoResponse = await fetch(
				`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`
			);

			if (!geoResponse.ok) {
				throw new Error(`Error: ${geoResponse.status} ${geoResponse.statusText}`);
			}

			const geoData = await geoResponse.json();
			if (geoData.length > 0) {
				const { lat, lon } = geoData[0];

				// Use the Current Weather Data API
				const weatherResponse = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
				);

				if (!weatherResponse.ok) {
					throw new Error(
						`Error: ${weatherResponse.status} ${weatherResponse.statusText}`
					);
				}

				const weatherData = await weatherResponse.json();
				console.log(weatherData);

				card.classList.add("display");
				city = city.charAt(0).toUpperCase() + city.slice(1);

				info[0].textContent = city;
				info[1].textContent = `Temperature: ${weatherData.main.temp}°C`;
				info[3].textContent = `Weather: ${weatherData.weather[0].description}`;
				info[2].textContent = `Humidity: ${weatherData.main.humidity}`;
			} else {
				throw new Error("City not found");
			}
		} catch (error) {
			console.error(error);
			err = document.createElement("div");
			err.textContent = error.message;
			document.body.append(err);
			err.classList.add("error");

			card.classList.remove("display");
		}
	} else {
		err = document.createElement("div");
		err.textContent = "Please enter the city";
		document.body.append(err);
		err.classList.add("error");

		card.classList.remove("display");
	}
	console.log(city);
});
