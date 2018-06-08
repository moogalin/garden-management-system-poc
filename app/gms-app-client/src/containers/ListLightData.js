import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Col,
  PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { timeParse as parse } from 'd3-time-format';
import {AreaChart} from 'react-easy-chart';
import "./ListLightData.css";
import './react-bootstrap-table-all.min.css';
import moment from 'moment';

export default class ListLightData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      time: "2018",
      LightData: []
    };

    this.graphData = []
    this.chartData = []
  }



  async componentDidMount() {
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    var LightData = await this.getLightData();
    this.setState({ LightData });
    var tempData =  LightData

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
    [event.target.id]: event.target.value}, this.updateLightData
  )
};


async updateLightData() {

  try {
    var LightData = await this.getLightData();

    this.setState({ LightData });
    var tempData =  LightData;

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

  this.renderLightGraph(LightData);
}

getLightData() {
  var data = {"MAC": "E4:7C:F9:06:3C:A4", "Time":this.state.time};
  return API.post("plants","sensors/light", {
    body: data
  }).catch(error => {
    console.log(error.response)
  });
}

renderLightGraph(data){
    if(data !== undefined) {
        this.graphData = []
        var count = data.length;

        // const parseDate = parse('%d-%b-%y %H:%M');
        var tempData = data.slice(count-144,count);
        var dataIR = [];
        var dataFS = [];
        var dataV = [];
        var i
        for (i = 0; i < tempData.length; i++) {
            var tempDate = tempData[i].Time.replace("T"," ").substring(0,16)
            let date = moment(tempDate, 'YYYY-MM-DD HH:mm');

            var subData = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["IR"]}
            var subfs = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Full_Spectrum"] }
            var subv = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Visible"] }
            dataIR.push(subData);
            dataFS.push(subfs);
            dataV.push(subv)
        }
        this.graphData.push(dataIR)
        this.graphData.push(dataFS)
        this.graphData.push(dataV)

    }

//return HTML of what I want to display
  return(
  <div>
      <AreaChart
        data={this.graphData}
        // xType={'text'}
        datePattern={'%d-%b-%y %H:%M'}
        xType={'time'}
        axes
        yDomainRange={[0, 70000]}
        grid
        areaColors={['orange', 'purple', 'green']}
        interpolate={'cardinal'}
        width={750}
        height={320}
        margin={{top: 0, right: 0, bottom: 50, left: 65}}
        axisLabels={{x: 'Time', y: 'LUX'}}
        // style={'.label'}
      />
        <legend></legend>
        <table class = "legendFormat">
            <th class = "Legend">Legend</th>
            <tr>
                <td class="Legend">Infrared = </td>
                <td><span class="IRdot"></span></td>
                <td class="Space"></td>
                <td class="Legend">Full Spectrum = </td>
                <td><span class="FSdot"></span></td>
                <td class="Space"></td>
                <td class="Legend">Visible = </td>
                <td><span class="Vdot"></span></td>
                <td class="Space"></td>
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

renderLightDataList(data) {
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
             Visible: tempData[i].Visible,
             IR: tempData[i].IR,
             Full_Spectrum: tempData[i].Full_Spectrum,
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
        {this.renderLightGraph(this.state.LightData)}
        {this.renderHistoricalSelect()}
        {this.renderLightDataList(this.state.LightData)}
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
