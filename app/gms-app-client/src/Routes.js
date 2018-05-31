import React from "react";
import AppliedRoute from "./components/AppliedRoute";
import Profile from "./containers/Profile";
import NewPlant from "./containers/NewPlant";
import ListPlants from "./containers/ListPlants";
import ListLightData from "./containers/ListLightData";
import ListMoistureData from "./containers/ListMoistureData";
import ListHumidityData from "./containers/ListHumidityData";
import ListTemperatureData from "./containers/ListTemperatureData";
import Home from "./containers/Home";
import Signup from "./containers/Signup";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Chart from "./containers/sensorChart";
import { Switch } from "react-router-dom";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/profile" exact component={Profile} props={childProps} />
    <AppliedRoute path="/plants/new" exact component={NewPlant} props={childProps} />
    <AppliedRoute path="/plants/list" exact component={ListPlants} props={childProps} />
    <AppliedRoute path="/sensors/light" exact component={ListLightData} props={childProps} />
    <AppliedRoute path="/sensors/moisture" exact component={ListMoistureData} props={childProps} />
    <AppliedRoute path="/sensors/temperature" exact component={ListTemperatureData} props={childProps} />
    <AppliedRoute path="/sensors/humidity" exact component={ListHumidityData} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/charts" exact component={Chart} props={childProps} />
    <AppliedRoute component={NotFound} />
  </Switch>;
