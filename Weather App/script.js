// https://api.openweathermap.org/data/2.5/weather?q={city name}
// https://api.openweathermap.org/data/2.5/weather?q={kanpur}&appid={08b8dfdef863b1d3dc42087532e6b63e}

const apiKey = "08b8dfdef863b1d3dc42087532e6b63e";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=banglore;";

async function checkWeather(){
    const response = await fetch(apiUrl + '&appid=${apiKey}');
    var data = await response.json();

    console.log(data);
}

checkWeather();