import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Col,
  PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { timeParse as parse } from 'd3-time-format';
import {AreaChart} from 'react-easy-chart';
import "./ListTemperatureData.css";
import './react-bootstrap-table-all.min.css';
import moment from 'moment';

export default class ListTemperatureData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      time: "2018",
      TemperatureData: []
    };

    this.graphData = []
    this.chartData = []
  }



  async componentDidMount() {
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    var TemperatureData = await this.getTemperatureData();
    this.setState({ TemperatureData });
    var tempData =  TemperatureData

    var date_sort_asc = function (data1, data2) {
        var date1 = data1.Time, date2 = data2.Time;

        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
    };

    tempData.sort(date_sort_asc);

  } catch (e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

handleChange = async event => {

  //console.log("change id: " + event.target.id);
  //console.log("change value: " + event.target.value);
  this.setState({
    [event.target.id]: event.target.value}, this.updateTemperatureData
  )
};

async updateTemperatureData() {
  try {
      var TemperatureData = await this.getTemperatureData();
      this.setState({ TemperatureData });
      var tempData =  TemperatureData;

      var date_sort_asc = function (data1, data2) {
          var date1 = data1.Time, date2 = data2.Time;

          if (date1 > date2) return 1;
          if (date1 < date2) return -1;
          return 0;
      };

      tempData.sort(date_sort_asc);

    } catch (e) {
      alert(e);
    }

    this.renderTemperatureGraph(TemperatureData);
}

getTemperatureData() {
  var data = {"MAC": "E4:7C:F9:06:3C:A4", "Time":this.state.time};
  return API.post("plants","sensors/temperature", {
    body: data
  }).catch(error => {
    console.log(error.response)
  });
}

renderTemperatureGraph(data){
    if(data !== undefined) {
        this.graphData = []
        var count = data.length;

        // const parseDate = parse('%d-%b-%y %H:%M');
        var tempData = data.slice(count-144,count);
        var dataTC = [];
        var dataTF = [];
        var i
        for (i = 0; i < tempData.length; i++) {
            var tempDate = tempData[i].Time.replace("T"," ").substring(0,16)
            let date = moment(tempDate, 'YYYY-MM-DD HH:mm');

            var subtc = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Celsius"]}
            var subtf = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Fahrenheit"] }
            dataTC.push(subtc);
            dataTF.push(subtf);
        }
        this.graphData.push(dataTC)
        this.graphData.push(dataTF)
    }

//return HTML of what I want to display
  return(
  <div>
      <AreaChart
        data={this.graphData}
        datePattern={'%d-%b-%y %H:%M'}
        xType={'time'}
        axes
        yDomainRange={[0, 200]}
        grid
        areaColors={['orange', 'purple']}
        interpolate={'cardinal'}
        width={750}
        height={320}
        margin={{top: 0, right: 0, bottom: 50, left: 65}}
        axisLabels={{x: 'Time', y: 'deg'}}
      />
        <legend></legend>
        <table class = "legendFormat">
            <th class = "Legend">Legend</th>
            <tr>
                <td class ="Legend">Celcius = </td>
                <td><span class ="tcdot"></span></td>
                <td class ="Space"></td>
                <td class ="Legend">Fahrenheit = </td>
                <td><span class ="tfdot"></span></td>
                <td class ="Space"></td>
            </tr>
        </table>
        <br />
        </div>
    );
}

renderHistoricalSelect() {

  return (
    <div>
    <FormGroup controlId="time" bsSize="small">
      <Col componentClass={ControlLabel} sm={3}>Historical View - Select Date</Col>
        <Col sm={9}>
          <FormControl
            value={this.state.date}
            onChange={this.handleChange}
            type="Date"
          />
        </Col>
      </FormGroup>
    </div>
  );
}

renderTemperatureDataList(data) {
  if (data !== undefined) {
     var count = data.length;
    this.chartData = []
    var tempData = data.slice(count-144,count);
    var i;
     for (i = 0; i < tempData.length; i++) {
         var subtime = new Date(tempData[i].Time).toLocaleString("en-US")

        this.chartData.push({
             Sensor: tempData[i].Sensor,
             userID: tempData[i].userID,
             Temperature_F: tempData[i].Fahrenheit,
             Temperature_C: tempData[i].Celsius,
             MAC: tempData[i].MAC,
             Time: subtime});
      }
  }
  return (
    <div>
    <div>
      <b>Total Datapoints: </b>
      { count }
      <b> Viewing: </b>
      {count < 144 ? count : 144}
    <br/>
      <b>Note: </b>{"Only sensor data associated to logged in user is viewable"}
    </div>
        <BootstrapTable data={this.chartData} striped hover>
          <TableHeaderColumn dataField='Sensor' isKey={true} hidden={true}>Sensor</TableHeaderColumn>
          <TableHeaderColumn dataField='Time'>Time</TableHeaderColumn>
          <TableHeaderColumn dataField='Temperature_C'>Temperature (Celsius)</TableHeaderColumn>
          <TableHeaderColumn dataField='Temperature_F'>Temperature (Fahrenheit)</TableHeaderColumn>
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

renderTemperatureData() {
  return (
    <div className="TemperatureData">
      <PageHeader>Your Temperature Sensor Data</PageHeader>
      <div>
        {this.renderTemperatureGraph(this.state.TemperatureData)}
        {this.renderHistoricalSelect()}
        {this.renderTemperatureDataList(this.state.TemperatureData)}
      </div>
    </div>
  );
}

  render() {
    return (
      <div className="ListTemperatureData">
        {this.props.isAuthenticated ? this.renderTemperatureData() : this.renderLander()}
      </div>
    );
  }
}
