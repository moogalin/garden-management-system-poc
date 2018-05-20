import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { API } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./ListLightData.css";
import './react-bootstrap-table-all.min.css';

export default class ListLightData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      lightdata: []
    };
  }

  async componentDidMount() {
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    const lightdata = await this.getLightData();
    this.setState({ lightdata });
    console.log(JSON.stringify(this.state));
  } catch (e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

getLightData() {
  return API.get("plants","sensors");
}

renderLightDataList(data) {
  var count = data.length;
  var data = data.slice(count-10,count);
  var data2 = data.forEach( data =>
    data.Time = new Date(data.Time).toLocaleString("en-US")
  );
  return (
    <div>
        <div>
          {"Total Datapoints: " + count
            + " Viewing: 10"}
        </div>
        <BootstrapTable data={data} striped hover>
          <TableHeaderColumn dataField='Sensor' isKey={true} hidden={true}>Sensor</TableHeaderColumn>
          <TableHeaderColumn dataField='IR'>IR</TableHeaderColumn>
          <TableHeaderColumn dataField='Time'>Time</TableHeaderColumn>
          <TableHeaderColumn dataField='Full_Spectrum'>Full Spectrum</TableHeaderColumn>
        </BootstrapTable>
      </div>
  );
}


renderLander() {
  return (
    <div className="lander">
      <h1>Garden Management System</h1>
      <p>Garden Management, Made Simple. Login now.</p>
    </div>
  );
}

renderLightData() {
  return (
    <div className="LightData">
      <PageHeader>Your Light Sensor Data</PageHeader>
      <div>
        {this.renderLightDataList(this.state.lightdata)}
      </div>
    </div>
  );
}

  render() {
    return (
      <div className="ListLightData">
        {this.props.isAuthenticated ? this.renderLightData() : this.renderLander()}
      </div>
    );
  }
}
