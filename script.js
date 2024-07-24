let city=document.getElementById('city'),
searchBtn=document.getElementById('searchBtn'),
api_key="6e0ea5877b340167894ef302f4b2cf10";

locationBtn=document.getElementById('locationBtn'),
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
fiveDaysForecastCard=document.querySelector('.day-forecast'),
apiCard = document.querySelectorAll('.highlights .card')[0],
sunriseCard = document.querySelectorAll('.highlights .card')[1],
humidityval= document.getElementById('humidityval'),
pressureval= document.getElementById('pressureval'),
visibilityval= document.getElementById('visibilityval'),
windspeedval= document.getElementById('windspeedval'),
feelsval= document.getElementById('feelsval'),
hourlyForecastCard = document.querySelector('.hourly-forecast'),
aqiList = ['Good','Fair','Moderate','Poor','Very Poor'];

function getWeatherDetails(name,lat,lon,country,state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
    days=[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months=[
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'

    ];
    //air pollution
    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
      let {co,no,no2,o3} =data.list[0].components;
      apiCard.innerHTML=`
      <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi -1]}</p>
              </div>
              <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                  <p>CO</p>
                  <h2>${co}</h2>
                </div>
                <div class="item">
                  <p>NO</p>
                  <h2>${no}</h2>
                </div>
                <div class="item">
                  <p>NO2</p>
                  <h2>${no2}</h2>
                </div>
    
                <div class="item">
                  <p>O3</p>
                  <h2>${o3}</h2>
                </div>
              </div>`
    }).catch(()=>{
      alert("Failed To fetch air pollution data!!")
    })
    //Weather Data
    fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
        let date= new Date();
        currentWeatherCard.innerHTML=`
        <div class="current-weather">
        <div class="details">
          <p>Now</p>
          <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
          <p>${data.weather[0].description}</p>
        </div>
        <div class="weather-icon">
          <img
            src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
            alt=""
          />
        </div>
      </div>
      <hr />
      <br>
      <div class="card-footer">
        <p><i class="fa fa-calendar">  ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</i></p>
        <p><i class="fa-light fa-location-dot"></i>${name},${country}</p>
      </div> 
        `;
        let { sunrise, sunset } = data.sys,
        { timezone, visibility} = data,
        {humidity, pressure, feels_like} = data.main,
        {speed} = data.wind,
        sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
        sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');        
      sunriseCard.innerHTML=`
      <div class="card-head">
      <p>Sunrise & Sunset</p>
    </div>
    <div class="sunrise-sunset">
      <div class="item">
        <div class="icon">
          <i class="fa-solid fa-sunrise"></i>
        </div>
        <div>
          <p>Sunrise</p>
          <h2>${sRiseTime}</h2>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <i class="fa-light fa-sunset fa-4x"></i>
        </div>
        <div>
          <p>Sunset</p>
          <h2>${sSetTime}</h2>
        </div>
      </div>
    </div>
      `;
      humidityval.innerHTML=`${humidity}%`;
      pressureval.innerHTML=`${pressure} hPa`;
      feelsval.innerHTML=`${(feels_like -273.15).toFixed(2)}°C`;
      windspeedval.innerHTML=`${speed} m/s`;
      visibilityval.innerHTML=`${visibility /1000}km`;
    }).catch(()=>{
        alert('Failed to fetch current weather');
    });
    // Weathe ForeCast
    fetch(FORECAST_API_URL).then(res=>res.json()).then(data=>{
        let hourlyForecast =data.list;
        hourlyForecastCard.innerHTML="";
        for(i=0;i<=7;i++){
          let h=new Date(hourlyForecast[i].dt_txt);
          let hr = h.getHours();
          let a= 'PM';
          if(hr<12) a = 'AM';
          if(hr==0) hr=12;
          if(hr>12)hr=hr -12;
          hourlyForecastCard.innerHTML +=` 
          <div class="card">
                  <p>
                      ${hr} ${a}</p>
                      <img
                      src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png"
                      alt=""
                    />
                    <p>${(hourlyForecast[i].main.temp -273.15).toFixed(2)}&deg;C</p>
        
              </div>
          `;
        }
        let uniqueForecastDays=[];
        let fiveDaysForecast=data.list.filter(forecast =>{
            let forecastDate=new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        
        fiveDaysForecastCard.innerHTML= "";
        for(i=1;i<fiveDaysForecast.length;i++){
            let date= new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML +=`
            <div class="forecast-item">
            <div class="icone-wrapper">
              <img
                src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png"
                alt=""
              />
              <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div> `;
        }
    }).catch(()=>{
        alert('Failed to fetch current weather forcast');
    });
}


function getCityCoordinates(){
    let cityName=city.value.trim();
    city.value=" ";
    if(!cityName) return;
    let GEOCOOING_API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCOOING_API_URL).then(res => res.json()).then(data=>{
        let {name,lat,lon,country,state}=data[0];
        getWeatherDetails(name,lat,lon,country,state);

    }).catch(()=>{
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}
function getusercity(){
  navigator.geolocation.getCurrentPosition(position => {
    let {latitude, longitude}= position.coords;
    let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`; 

    fetch(REVERSE_GEOCODING_URL).then(res=> res.json()).then(data =>{
      let {name,country,state} = data[0];
      getWeatherDetails(name,latitude,longitude,country,state);
    }).catch(()=>{
      alter('Faild to fetch user location weather!!');
    });
  }, error =>{
    if(error.code === error.PERMISSION_DENIED){
      alert('Location Permision Denied !!');
    }
  }
  );
}

searchBtn.addEventListener('click',getCityCoordinates);
city.addEventListener('keyup', e => e.key == 'Enter' && getCityCoordinates());
window.addEventListener('load',getusercity);
locationBtn.addEventListener('click',getusercity);