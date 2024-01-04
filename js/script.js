const mainCard = document.querySelector('.weather-card .main-card');
const placeToSearch = document.querySelector('.weather-card .search-container .place-input');
const buttonSearch = document.querySelector('.weather-card .search-container button');
const imageIcon = document.querySelector('.weather-card .cont-icon-and-temperature img');
const temperatureOutput = document.querySelector('.weather-card .cont-icon-and-temperature .temperature-output');
const cityOutput = document.querySelector('.weather-card .cont-icon-and-temperature .city-output');
const humidityOutput = document.querySelector('.weather-card .humidity-percentage .humidity-output');
const windOutput = document.querySelector('.weather-card .wind-speed .wind-speed-output');

buttonSearch.addEventListener('click',init)

async function init(){
  const API_KEY = '0b23b318ec85231545143751b631dcd4';
  const userPlace = placeToSearch.value.toLowerCase().trim();

  if (userPlace === '') {
    alert('Bisogna inserire il nome di una città');
    return
  }

  try{
    const paramPlace = await getLocation(API_KEY,userPlace);
    const weatherData = await getWeather(paramPlace.lat,paramPlace.lon,API_KEY);
    innerDataToHtml(weatherData);
  }catch(error){
    console.error('Error:',error);
    alert('Si è verificato un errore, riprova più tardi');
  }
}

function innerDataToHtml(weatherData){
  const placeName = weatherData.name;
  const placeCountry = weatherData.sys.country;
  const kelvinTemp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const celsiusTemp = parseFloat(kelvinTemp) - 273.15;
  const bodyEl = document.body;

  cityOutput.innerHTML = placeName + ' - ' + placeCountry
  temperatureOutput.innerText = celsiusTemp.toFixed(2) + ' °c';
  humidityOutput.innerText = humidity + '%';
  windOutput.innerText = windSpeed.toFixed(2) + 'km/h'

  if (celsiusTemp.toFixed(2) < 16 && celsiusTemp.toFixed(2) > 0) {
    classAddRemove(bodyEl,'bad-weather')    
    imageIcon.src = '../img/dark-cloud.png'
  }else if (celsiusTemp.toFixed(2) <= 0) {
    classAddRemove(bodyEl,'cold-weather')    
    imageIcon.src = '../img/cold-cloud.png'
  }else{
    classAddRemove(bodyEl,'good-weather')    
    imageIcon.src = '../img/sunny-cloud.png'
  }

  mainCard.classList.add('open-main');
}

async function getLocation(API_KEY,place){
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=5&appid=${API_KEY}`)
  const data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;
  return {
    lat,
    lon,
  }
}

async function getWeather(lat,lon,API_KEY){
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  const data = await response.json();
  return data
}

function classAddRemove(item,classes){
  item.classList.remove(...item.classList);
  item.classList.add(classes)
}
