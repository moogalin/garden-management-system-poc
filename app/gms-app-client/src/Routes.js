import React from "react";
import AppliedRoute from "./components/AppliedRoute";
import Profile from "./containers/Profile";
import NewPlant from "./containers/NewPlant";
import ListPlants from "./containers/ListPlants";
import ListLightData from "./containers/ListLightData";
import Home from "./containers/Home";
import Signup from "./containers/Signup";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import { Switch } from "react-router-dom";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/profile" exact component={Profile} props={childProps} />
    <AppliedRoute path="/plants/new" exact component={NewPlant} props={childProps} />
    <AppliedRoute path="/plants/list" exact component={ListPlants} props={childProps} />
    <AppliedRoute path="/sensors/light" exact component={ListLightData} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute component={NotFound} />
  </Switch>;
