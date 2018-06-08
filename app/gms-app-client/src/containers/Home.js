import React, { Component } from "react";
import "./Home.css";
import image from './Home.png';

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <img src={image} alt={"image"}/>
        <div className="lander">
          <h1>Garden Management System</h1>
          <p><b>Note: This website is inacessible without authenticated user account. Login or sign up now</b></p>
          <br/>
          < p >
          Welcome to the Garden Management System!  This system uses sensors, small computers, and the cloud to track your garden.  Metrics can be viewed online from anywhere, even Mars!  Sign in now!
          </p>
        </div>
      </div>
    );
  }
}
