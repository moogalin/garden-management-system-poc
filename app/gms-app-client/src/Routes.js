import React from "react";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import { Switch } from "react-router-dom";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute component={NotFound} />
  </Switch>;
