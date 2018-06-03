import React, { Component } from "react";
import "./CurrentWeather.css";
import axios from 'axios'
//import image from './Home.png';

export default class CurrentWeather extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      zip: 21041,  //TODO change this value to get different data
      weatherdata: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
    /*  This is where I should request weather data*/
      const weatherdata = await this.getWeatherData();
      this.setState({ weatherdata });
      console.log(JSON.stringify(this.state));
    } 
    catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  getFahrenheit(kel){
    return( (kel * 9/5 - 460).toFixed(2) )
  }

  currentSnow(data){
    if('snow' in data){
      return( <p>There has been {data["snow"]["3h"]} inches of snow in the last three hours.</p> )
    }
  }
  currentRain(data){
    if('rain' in data){
      return( <p>There has been {data["rain"]["3h"]} inches of rain in the last three hours.</p> )
    }
  }
  currentClouds(data){
    if('clouds' in data){
      return( <p>It is {data.clouds.all}% cloudy.</p> )
    }
  }

/*
This is where I would make the API call.
How do I set it up to call Open Weather Maps?
*/
getWeatherData() {
/*
  var data = {"MAC": "E4:7C:F9:06:3C:A4"};
  return API.post("plants","sensors/light", {
    body: data
  }).catch(error => {
    console.log(error.response)
  });
//*/
  var OWM_URL = "http://api.openweathermap.org/data/2.5/"
  var query = "weather?"
  var location = "zip=" + this.state.zip + ",us"
  var appid = "&appid=b7a76aa2f2a89c1aa90b6f7ffcb44be2" //TODO: READ FROM A FILE!!!
  var currentWeatherQuery = OWM_URL + query + location + appid

/*
  var data = 
    {
      "coord":{"lon":-122.87,"lat":45.49},
      "weather":
        [{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],
      "base":"stations",
      "main":
        {
          "temp":292.03,
          "pressure":1024,
          "humidity":52,
          "temp_min":291.15,
          "temp_max":293.15
        },
      "visibility":16093,
      "wind":{"speed":3.6,"deg":310},
      "clouds":{"all":40},
      "dt":1527533760,
      "sys":
        {
          "type":1,
          "id":2275,
          "message":0.0069,
          "country":"US",
          "sunrise":1527510487,
          "sunset":1527565812
        },
      "id":420029612,
      "name":"Portland--TEST",
      "cod":200
    }
*/
  axios.get(currentWeatherQuery)
    .then(response => this.setState({weatherdata: response.data}))
}

  renderWeatherData(data) {
    console.log("In renderWeatherData: " + JSON.stringify(data));
    if (data === undefined) {
      return (
        <div>I have no data to share!!!</div>
      );/*//*/
    }
    if ('cod' in data && data.cod === 200){
      var icon = data["weather"][0]["icon"]
      var img_url = "http://openweathermap.org/img/w/" + icon + ".png"
      var alt_text = data["weather"][0]["description"]

      var kelvin = Number(data["main"]["temp"])
      var low_kelvin = Number(data["main"]["temp_min"])
      var high_kelvin = Number(data["main"]["temp_max"])

      var dawn = new Date(data.sys.sunrise * 1000)
      var dawn_time = dawn.getHours() + ':' + dawn.getMinutes()
      var dusk = new Date(data.sys.sunset * 1000)
      var dusk_time = dusk.getHours() + ':' + dusk.getMinutes()

      return( 
          <div>
            <h2>Current Weather for {data.name}:</h2>
            <p>{data.weather[0].description}  <img src={img_url} alt={alt_text}></img></p>
            <p>Today's high is {this.getFahrenheit(low_kelvin)}°F and the low is {this.getFahrenheit(high_kelvin)}°F.</p>
            <p>It is currently {this.getFahrenheit(kelvin)}°F and {data.main.humidity}% humidity.</p>
            <p>Wind is coming from {data.wind.deg}° at {data.wind.speed}MPH.</p>
            <p>Pressure is {data.main.pressure}hPa.</p>
            {this.currentClouds(data)}
            {this.currentRain(data)}
            {this.currentSnow(data)}
            <p>Sunrise was at {dawn_time} and sunset will be at {dusk_time}.</p>
            <br/>
          </div> 

      )/*//*/
  }
}

  renderData() {
    return (
        <div className="CurrentWeather">
          <div className="lander">
            <h1>Garden Management System</h1>
            <br/>
            <h3>
              Current Weather for {this.state.zip}.  
            </h3>
            <p>Hopefully soon it will be for the currently logged in user.</p>
            <div>
            {this.renderWeatherData(this.state.weatherdata)}
            </div>
          </div>
          <br/>
          <div className="Tribute">
            <h4>Data from </h4>
            <a href="https://openweathermap.org/">
            <img 
              src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/logo_OpenWeatherMap_orange.svg" 
              alt="OWM Logo"
              title="OpenWeatherMap"
              width="400px"
            ></img></a>
          </div>
        </div>
    );/*//*/
  }  

  renderLander() {
    return (
      <div className="lander">
        <h1>Garden Management System</h1>
        <p>Garden Management, Made Simple. Login now.</p>
        <p><b>Note: This website is inacessible without authenticated user account. Login or sign up now</b></p>
      </div>
    );
  }


  render() {
    return (
      <div className="ListLightData">
        {this.props.isAuthenticated ? this.renderData() : this.renderLander()}
      </div>
    );/*//*/
  }


}
