import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { API } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import {AreaChart} from 'react-easy-chart';
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
  var data = {"MAC": "E4:7C:F9:06:3C:A4"};
  return API.post("plants","sensors/light", {
    body: data
  }).catch(error => {
    console.log(error.response)
  });
}

renderLightGraph(data){
//check data validity, if using
  if (data !== undefined) {
    var count = data.length;
    //var data = data.slice(count-10,count);
    var data2 = data.forEach( data =>
      data.Time = new Date(data.Time).toLocaleString("en-US")
    );
  }
//return HTML of what I want to display
  return(
      <AreaChart
        // datePattern={'%H:%M'}
        xType={'text'}
        axes
        yDomainRange={[0, 100]}
        grid
        areaColors={['orange', 'purple']}
        interpolate={'cardinal'}
        width={750}
        height={300}
        axisLabels={{x: 'Hour', y: '%'}}
        style={{ '.label': { fill: 'black' } }}
        data={[
          [
            { x: '12AM', y: 20 },
            { x: '1AM', y: 10 },
            { x: '2AM', y: 85 },
            { x: '3AM', y: 45 },
            { x: '4AM', y: 15 }
          ], [
            { x: '12AM', y: 10 },
            { x: '1AM', y: 15 },
            { x: '2AM', y: 13 },
            { x: '3AM', y: 90 },
            { x: '4AM', y: 10 }
          ]
        ]}
      />
    );
}

renderLightDataList(data) {
  if (data != undefined) {
    var count = data.length;
    var data = data.slice(count-10,count);
    var data2 = data.forEach( data =>
      data.Time = new Date(data.Time).toLocaleString("en-US")
    );
  }
  return (
    <div>
        <div>
          {"Total Datapoints: " + count
            + " Viewing: " + (count < 10 ? count : 10)
          }
        <br/>
          {"Note: Only sensor data associated to logged in user is viewable"}
        </div>
        <BootstrapTable data={data} striped hover>
          <TableHeaderColumn dataField='Sensor' isKey={true} hidden={true}>Sensor</TableHeaderColumn>
          <TableHeaderColumn dataField='Time'>Time</TableHeaderColumn>
          <TableHeaderColumn dataField='IR'>IR</TableHeaderColumn>
          <TableHeaderColumn dataField='Visible'>Visible</TableHeaderColumn>
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
        {this.renderLightGraph(this.state.lightdata)}
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
