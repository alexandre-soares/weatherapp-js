const api = {
	key: "a3624783e7595ad63e20d9c7d38f6b8f",
	base: "https://api.openweathermap.org/data/2.5/",
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

const body = document.querySelector('.body')

const errorContent = document.querySelector('.error-content')

// Geolocalisation

if ("geolocation" in navigator) {

	navigator.geolocation.getCurrentPosition(showcityname);

	function showcityname(position) {
		var lat = position.coords.latitude;
		var longit = position.coords.longitude;

		fetch(`${api.base}weather?lat=${lat}&lon=${longit}&units=metric&APPID=${api.key}`)
			.then((weather) => {
				return weather.json();
			})
			.then(displayResults);
	}
}

function setQuery(evt) {
	if (evt.keyCode == 13) {
		getResults(searchbox.value);
		searchbox.value = "";
	}
}

function getResults(query) {
	fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
		.then((weather) => {
			return weather.json();
		})
		.then(displayResults);
}

function displayResults(weather) {
	errorContent.innerHTML = "";

	if (weather.cod == 404) {

		// create error message
		const errorMessage = document.createElement("p");
		errorMessage.innerHTML = 'Sorry, but we didn\'t found the city you are looking for';
		errorMessage.classList.add("error-message");
		errorContent.appendChild(errorMessage);
	}

	let city = document.querySelector(".location .city");
	city.innerText = `${weather.name}, ${weather.sys.country}`;

	let now = new Date();
	let date = document.querySelector(".location .date");
	date.innerText = dateBuilder(now);

	let temp = document.querySelector(".current .temp");
	temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

	let weather_el = document.querySelector(".current .weather");
	weather_el.innerText = weather.weather[0].main;

	let hilow = document.querySelector(".hi-low");
	hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(
		weather.main.temp_max
	)}°c`;

	switch (weather.weather[0].main) {
		case "Clouds":
			body.classList.remove('rain')
			body.classList.remove('sunny')
			body.classList.remove('clear')
			body.classList.add('clouds')
			break;
		case "Rain":
			body.classList.remove('clouds')
			body.classList.remove('sunny')
			body.classList.remove('clear')
			body.classList.add('rain')
			break;
		case "Sunny":
			body.classList.remove('rain')
			body.classList.remove('clear')
			body.classList.remove('clouds')
			body.classList.add('sunny')
			break;
		case "Clear":
			body.classList.remove('rain')
			body.classList.remove('sunny')
			body.classList.remove('clouds')
			body.classList.add('clear')
			break;

		default:
			break;
	}
}

function dateBuilder(d) {
	let months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	let day = days[d.getDay()];
	let date = d.getDate();
	let month = months[d.getMonth()];
	let year = d.getFullYear();

	return `${day} ${date} ${month} ${year}`;
}

