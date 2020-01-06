const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

const weatherStorage = window.localStorage;
const ONE_HOUR = 60 * 60 * 1000;

const makeWeatherElement = ({day, icon, condition, temperature}) => {
  return `
    <div class="weather">
      <div class="day-icon">
        <span class="day">${day ? day : 'Today'}</span>
        <img class="icon" src="./assets/${icon}.svg" alt="${icon.split('-').join(' ')}">
      </div>
      <div class="condition-temp">
        <span class="condition">${condition}</span>
        <span class="temp">${temperature}F</span>
      </div>
    </div>
  `;
};

const appendWeatherToDom = (weather) => {
  sidebar.innerHTML = weather;
};

const makeDadJokeElement = (joke) => {
  content.innerHTML = `
    <div class="dad-joke">${joke}</div>
  `;
};

const processWeather = (data) => {
  let weather = makeWeatherElement(data);
  for (let i = 0; i < data.next3Days.length; i++) {
    weather += makeWeatherElement(data.next3Days[i]);
  }
  appendWeatherToDom(weather);
};

const getWeather = () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    const currentWeather = JSON.parse(weatherStorage.getItem('weather'));

    if (currentWeather && ((new Date) - currentWeather.time) < ONE_HOUR) {
      processWeather(currentWeather);
    } else {
      fetch(`https://weather-api.jajjferris.now.sh/${lat}/${long}`)
        .then(res => res.json())
        .then(data => {
          weatherStorage.setItem('weather', JSON.stringify({
            time: Date.now(),
            ...data,
          }));
          processWeather(data);
        });
    }

  });
};

fetch('https://icanhazdadjoke.com', {
  headers: {
    'Accept': 'application/json',
  },
})
  .then(res => res.json())
  .then(({ joke }) => makeDadJokeElement(joke));

getWeather();
