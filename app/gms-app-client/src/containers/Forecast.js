import React, { Component } from "react";
import "./CurrentWeather.css";
import axios from 'axios'
import { API } from "aws-amplify";
import {AreaChart} from 'react-easy-chart';
import moment from 'moment';
//import image from './Home.png';

export default class CurrentWeather extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      fname: "",
      lname: "",
      email: "",
      zip: "97008",
      unclaimed_macs:[],
      claimed_macs:[],
      claim_mac:"",
      about: "",
      profile:[],
      weatherdata: {}
    };

    this.graphData = []
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    try {
      const profile = await this.profile();
      this.setState({ profile });
      console.log(JSON.stringify(profile));
      console.log(profile[0].fname);
      this.setState({fname: [profile[0].fname]});
      this.setState({lname: [profile[0].lname]});
      this.setState({email: [profile[0].email]});
      this.setState({zip:   [profile[0].zip]});
      this.setState({about: [profile[0].about]});

      const weatherdata = await this.getWeatherData();
      this.setState({ weatherdata });
      console.log(JSON.stringify(this.state));
    } catch (e) {
      alert(e);
    }
/*    try {
      const weatherdata = await this.getWeatherData();
      this.setState({ weatherdata });
      console.log(JSON.stringify(this.state));
    } 
    catch (e) {
      alert(e);
    }
*/

    this.setState({ isLoading: false });
  }

  profile() {
    //console.log("Inside profile()");
    return API.get("plants", "user");
  }

  getFahrenheit(kel){
    return( (kel * 9/5 - 460).toFixed(2) )
  }

displayFahrenheit(data){
  if(data === undefined){
    return(<p></p>) //return nothing
  }
  else{
    return(
      <p class="temp">{data}°F</p>
    );
  }
}

displayDescription(data){
  if(data === undefined){
    return(<p></p>) //return nothing
  }
  else{
    return(
      <p class="desc">{data}</p>
    );
  }
}

displayIcon(icon, alt){
  if(icon === undefined){
    return(<p></p>) //return nothing
  }
  else{
    return(
      <p class="icon"><img src = {icon} alt = {alt}></img></p>
    );
  }
}

getWeatherData() { //
  var OWM_URL = "http://api.openweathermap.org/data/2.5/"
  var query = "forecast?"
  var location = "zip=" + this.state.zip + ",us"
  var appid = "&appid=b7a76aa2f2a89c1aa90b6f7ffcb44be2" //TODO: READ FROM A FILE!!!
  var currentWeatherQuery = OWM_URL + query + location + appid

  //console.log("Inside getWeatherData() " + JSON.stringify(this.state.zip));

  axios.get(currentWeatherQuery)
    .then(response => this.setState({weatherdata: response.data}))

    //this.state.weatherdata = {"cod":"200","message":0.0122,"cnt":40,"list":[{"dt":1519074000,"main":{"temp":283.99,"temp_min":281.801,"temp_max":283.99,"pressure":989.94,"sea_level":1029.29,"grnd_level":989.94,"humidity":52,"temp_kf":2.19},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":20},"wind":{"speed":3.36,"deg":325.001},"rain":{},"sys":{"pod":"d"},"dt_txt":"2018-02-19 21:00:00"},{"dt":1519084800,"main":{"temp":282.64,"temp_min":281.177,"temp_max":282.64,"pressure":990.6,"sea_level":1029.94,"grnd_level":990.6,"humidity":47,"temp_kf":1.46},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":36},"wind":{"speed":3.17,"deg":319.502},"rain":{},"sys":{"pod":"n"},"dt_txt":"2018-02-20 00:00:00"},{"dt":1519495200,"main":{"temp":280.831,"temp_min":280.831,"temp_max":280.831,"pressure":997.47,"sea_level":1037.05,"grnd_level":997.47,"humidity":91,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":1.01,"deg":192.506},"rain":{},"sys":{"pod":"d"},"dt_txt":"2018-02-24 18:00:00"}],"city":{"name":"Mountain View","coord":{"lat":37.3855,"lon":-122.088},"country":"US"}}
    //this.setState({weatherdata: data})
}

renderWeatherData(data) {
  //console.log("In renderWeatherData: " + JSON.stringify(data));
  if (data === undefined) {
    return (
      <div>I have no data to share!!!</div>
    );/*//*/
  }
  if ('cod' in data){
    if(data.cod === "200"){

      /*
        1. Go through each list[] item
        2. Pull out kelvin, max kelvin, min kelvin, icon, description, time
        3. getFahrenheit for all kelvins and store in format that is chart friendly
        4. Store icon, description and Fahrenheit in HTML table structure
        5. Render chart
        6. Return HTML table
      */
      var time = [];
      var fahrenheit = [];
      var maxFahrenheit = [];
      var minFahrenheit = [];
      var icon = [];
      var alt_text = [];
      var description = [];
      var day = [];
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

      // var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

      Date.prototype.getDayName = function() {
        var dayOfWeek;
        if(days[ this.getDay() -1] === undefined)
        {
            dayOfWeek = 'Saturday';
        }
        else
        {
          dayOfWeek = days[ this.getDay() -1];
        }
        return dayOfWeek;
      };

      //console.log("Forecast data['list']: " + JSON.stringify(data["list"]));
      var i = 0;
      for(i = 0; i < data["list"].length; i++){
        time[i] = new Date(data["list"][i]["dt_txt"]);
        //console.log("Forecast point time: " + time[i]);
        var Temp = new Date(time[i]);

        day[i] = Temp.getDayName();


        console.log(day);
        fahrenheit[i] = this.getFahrenheit(data["list"][i]["main"]["temp"]);
        maxFahrenheit[i] = this.getFahrenheit(data["list"][i]["main"]["temp_max"]);
        minFahrenheit[i] = this.getFahrenheit(data["list"][i]["main"]["temp_min"]);
        icon[i] = "http://openweathermap.org/img/w/" + data["list"][i]["weather"][0]["icon"] + ".png";
        alt_text[i] = data["list"][i]["weather"][0]["description"];
        description[i] =  data["list"][i]["weather"][0]["main"];

      }

      /*for(var item in data["list"]){
        time[index] = item["dt_txt"];
        //console.log("Forecast point time: " + time[index]);
        //fahrenheit[index] = this.getFahrenheit(item["main"]["temp"]);
        console.log("Forecast point main: " + JSON.stringify(item));
        //maxFahrenheit[index] = this.getFahrenheit(item.main.temp_max);
        //minFahrenheit[index] = this.getFahrenheit(item.main.temp_min);
        //icon[index] = "http://openweathermap.org/img/w/" + item.weather[0].icon + ".png";
        //alt_text[index] = item.weather[0].description.capitalize();
        //description[index] =  item.weather[0].main;
      }*/
      return( 
        <div>
          <table>
            <tbody>
            <tr>
              <td></td>
              <td class = "header">{day[2]}</td>
              <td class = "header">{day[10]}</td>
              <td class = "header">{day[18]}</td>
              <td class = "header">{day[26]}</td>
              <td class = "header">{day[34]}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[0].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[0], alt_text[0])}<br/>{this.displayDescription(description[0])}<br/>{this.displayFahrenheit(fahrenheit[0])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[8], alt_text[8])}<br/>{this.displayDescription(description[8])}<br/>{this.displayFahrenheit(fahrenheit[8])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[16], alt_text[16])}<br/>{this.displayDescription(description[16])}<br/>{this.displayFahrenheit(fahrenheit[16])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[24], alt_text[24])}<br/>{this.displayDescription(description[24])}<br/>{this.displayFahrenheit(fahrenheit[24])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[32], alt_text[32])}<br/>{this.displayDescription(description[32])}<br/>{this.displayFahrenheit(fahrenheit[32])}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[1].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[1], alt_text[1])}<br/>{this.displayDescription(description[1])}<br/>{this.displayFahrenheit(fahrenheit[1])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[9], alt_text[9])}<br/>{this.displayDescription(description[9])}<br/>{this.displayFahrenheit(fahrenheit[9])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[17], alt_text[17])}<br/>{this.displayDescription(description[17])}<br/>{this.displayFahrenheit(fahrenheit[17])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[25], alt_text[25])}<br/>{this.displayDescription(description[25])}<br/>{this.displayFahrenheit(fahrenheit[25])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[33], alt_text[33])}<br/>{this.displayDescription(description[33])}<br/>{this.displayFahrenheit(fahrenheit[33])}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[2].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[2], alt_text[2])}<br/>{this.displayDescription(description[2])}<br/>{this.displayFahrenheit(fahrenheit[2])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[10], alt_text[10])}<br/>{this.displayDescription(description[10])}<br/>{this.displayFahrenheit(fahrenheit[10])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[18], alt_text[18])}<br/>{this.displayDescription(description[18])}<br/>{this.displayFahrenheit(fahrenheit[18])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[26], alt_text[26])}<br/>{this.displayDescription(description[26])}<br/>{this.displayFahrenheit(fahrenheit[26])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[34], alt_text[34])}<br/>{this.displayDescription(description[34])}<br/>{this.displayFahrenheit(fahrenheit[34])}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[3].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[3], alt_text[3])}<br/>{this.displayDescription(description[3])}<br/>{this.displayFahrenheit(fahrenheit[3])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[11], alt_text[11])}<br/>{this.displayDescription(description[11])}<br/>{this.displayFahrenheit(fahrenheit[11])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[19], alt_text[19])}<br/>{this.displayDescription(description[19])}<br/>{this.displayFahrenheit(fahrenheit[19])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[27], alt_text[27])}<br/>{this.displayDescription(description[27])}<br/>{this.displayFahrenheit(fahrenheit[27])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[35], alt_text[35])}<br/>{this.displayDescription(description[35])}<br/>{this.displayFahrenheit(fahrenheit[35])}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[4].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[4], alt_text[4])}<br/>{this.displayDescription(description[4])}<br/>{this.displayFahrenheit(fahrenheit[4])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[12], alt_text[12])}<br/>{this.displayDescription(description[12])}<br/>{this.displayFahrenheit(fahrenheit[12])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[20], alt_text[20])}<br/>{this.displayDescription(description[20])}<br/>{this.displayFahrenheit(fahrenheit[20])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[28], alt_text[28])}<br/>{this.displayDescription(description[28])}<br/>{this.displayFahrenheit(fahrenheit[28])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[36], alt_text[36])}<br/>{this.displayDescription(description[36])}<br/>{this.displayFahrenheit(fahrenheit[36])}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[5].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[5], alt_text[5])}<br/>{this.displayDescription(description[5])}<br/>{this.displayFahrenheit(fahrenheit[5])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[13], alt_text[13])}<br/>{this.displayDescription(description[13])}<br/>{this.displayFahrenheit(fahrenheit[13])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[21], alt_text[21])}<br/>{this.displayDescription(description[21])}<br/>{this.displayFahrenheit(fahrenheit[21])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[29], alt_text[29])}<br/>{this.displayDescription(description[29])}<br/>{this.displayFahrenheit(fahrenheit[29])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[37], alt_text[37])}<br/>{this.displayDescription(description[37])}<br/>{this.displayFahrenheit(fahrenheit[37])}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[6].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[6], alt_text[6])}<br/>{this.displayDescription(description[6])}<br/>{this.displayFahrenheit(fahrenheit[6])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[14], alt_text[14])}<br/>{this.displayDescription(description[14])}<br/>{this.displayFahrenheit(fahrenheit[14])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[22], alt_text[22])}<br/>{this.displayDescription(description[22])}<br/>{this.displayFahrenheit(fahrenheit[22])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[30], alt_text[30])}<br/>{this.displayDescription(description[30])}<br/>{this.displayFahrenheit(fahrenheit[30])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[38], alt_text[38])}<br/>{this.displayDescription(description[38])}<br/>{this.displayFahrenheit(fahrenheit[38])}</td>
            </tr>
            <tr>
              <td class = "firstCol">{time[7].getHours()}:00</td>
              <td class = "verticalLine">{this.displayIcon(icon[7], alt_text[7])}<br/>{this.displayDescription(description[7])}<br/>{this.displayFahrenheit(fahrenheit[7])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[15], alt_text[15])}<br/>{this.displayDescription(description[15])}<br/>{this.displayFahrenheit(fahrenheit[15])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[23], alt_text[23])}<br/>{this.displayDescription(description[23])}<br/>{this.displayFahrenheit(fahrenheit[23])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[31], alt_text[31])}<br/>{this.displayDescription(description[31])}<br/>{this.displayFahrenheit(fahrenheit[31])}</td>
              <td class = "verticalLine">{this.displayIcon(icon[39], alt_text[39])}<br/>{this.displayDescription(description[39])}<br/>{this.displayFahrenheit(fahrenheit[39])}</td>
            </tr>
            </tbody>
          </table>
         </div> 
      )/*//*/
    }
    else{
      return(
        <div>
          <h2>Failure to Get Weather Data!</h2>
          <p>HTTP Status Code: {data.cod}</p>
          <p>{String(data)}</p>
        </div>
        )/*//*/
    }
  }
  else{
    return(
      <div>
      <h2>Failure to Get Weather Data!</h2>
      <p>{String(data)}</p>
      </div>
    );
  }
}

renderWeatherGraph(data) {
  if (data === undefined) {
    return (<div>Cannot generate graph!!!</div>);/*//*/
  }

  if ('cod' in data){
    if(data.cod === "200"){
      this.graphData = []
      var time = [];
      var dataCurrTemp = [];
      var dataMaxTemp = [];
      var dataMinTemp = [];
      var i = 0;
      var min = 999;
      var max = -999;

      //console.log("Forecast data['list']: " + JSON.stringify(data["list"]));
      
      for(i = 0; i < data["list"].length; i++){
        time[i] = data["list"][i]["dt_txt"]
        let date = moment(time[i] , 'YYYY-MM-DD HH:mm');
        var fMin = Number(this.getFahrenheit(data["list"][i]["main"]["temp_min"]));
        var fMax = Number(this.getFahrenheit(data["list"][i]["main"]["temp_max"]));
        var fCur = Number(this.getFahrenheit(data["list"][i]["main"]["temp"]));

        if(min > fMin)
        {
          min = fMin;
        }

        if(max < fMax)
        {
          max = fMax;
        }


        var dataMin = { x: date.format('D-MMM-YY HH:mm'), y: fMin}
        var dataMax = { x: date.format('D-MMM-YY HH:mm'), y: fMax}
        var dataCur = { x: date.format('D-MMM-YY HH:mm'), y: fCur}
        dataMinTemp.push(dataMin);
        dataMaxTemp.push(dataMax);
        dataCurrTemp.push(dataCur);

        // console.log("Forecast point time: " + time[i]);
      }
      this.graphData.push(dataMinTemp)
      this.graphData.push(dataCurrTemp)
      this.graphData.push(dataMaxTemp)
      // console.log(JSON.stringify(dataCurrTemp));
      // console.log(JSON.stringify(dataMinTemp));
      // console.log(JSON.stringify(dataMaxTemp));
      min = min - 5;
      max = max + 5;

      return( 
        <div>
        <AreaChart
          data={this.graphData}
          datePattern={'%d-%b-%y %H:%M'}
          xType={'time'}
          axes
          yDomainRange={[min, max]}
          grid
          areaColors={['blue', 'green', 'purple']}
          interpolate={'cardinal'}
          width={750}
          height={280}
          margin={{top: 0, right: 0, bottom: 50, left: 65}}
          axisLabels={{x: 'Time', y: '°F'}}
        />
        <legend></legend>
          <table class = "legendFormat">
          <th class = "Legend">Legend</th>
          <tr>
          <td class ="Legend">Minimum = </td>
          <td><span class ="minDot"></span></td>
           <td class ="Space"></td>
          <td class ="Legend">Current = </td>
           <td><span class ="curDot"></span></td>
           <td class ="Legend">Maximum = </td>
          <td><span class ="maxDot"></span></td>
          <td class ="Space"></td>
          </tr>
          </table>
        <br />
        </div>
      );/*//*/
      }
      else{
      return(
      <div>
      <h2>Failure to Get Weather Data!</h2>
      <p>HTTP Status Code: {data.cod}</p>
      <p>{String(data)}</p>
      </div>
      )
    }
  }
}
     

  renderData() {
    if (this.state.zip){
        return (
          <div className="CurrentWeather">
            <div className="lander">
              <h1>Five Day Forecast</h1>
              <br/>
              <h3>
                Weather Forecast for {this.state.zip}.  
              </h3>
              <p>Welcome back, {this.state.fname}!  Here is what you can expect your outdoor garden to experience over the next five days.</p>
              <div>
                {this.renderWeatherGraph(this.state.weatherdata)}
              </div>
            </div>
            <br/>
            <div>
              {this.renderWeatherData(this.state.weatherdata)}
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
    else{
      return(
        <div>
        <div className="lander">
        <h1>Five Day Forecast</h1>
        <br/>
        </div>
        <h2>Unknown Location</h2>
        <p>Please add your zip code on the profile page!</p>
        </div>
      );
    }

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
      <div className="ListWeatherData">
        {this.props.isAuthenticated ? this.renderData() : this.renderLander()}
      </div>
    );/*//*/
  }


}
