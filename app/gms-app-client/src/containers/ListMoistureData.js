import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { API } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { timeParse as parse } from 'd3-time-format';
import {AreaChart} from 'react-easy-chart';
import "./ListMoistureData.css";
import './react-bootstrap-table-all.min.css';
import moment from 'moment';

export default class ListMoistureData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      moistData: []
    };
    
    this.graphData = []
    this.chartData = []
  }

  
  
  async componentDidMount() {
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    var moistData = await this.getMoistData();
    this.setState({ moistData });    
    var tempData =  moistData
    
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

getMoistData() {
  var data = {"MAC": "E4:7C:F9:06:3C:A4"};
  return API.post("plants","sensors/moisture", {
    body: data
  }).catch(error => {
    console.log(error.response)
  });  
}

renderMoistGraph(data){
    if(data !== undefined) {
        this.graphData = []
        var count = data.length;
        
        // const parseDate = parse('%d-%b-%y %H:%M');
        var tempData = data.slice(count-144,count);
        var dataM1 = [];
        var dataM2 = [];
        var dataM3 = [];
        var dataM4 = [];
        var i
        for (i = 0; i < tempData.length; i++) {
            var tempDate = tempData[i].Time.replace("T"," ").substring(0,16)
            let date = moment(tempDate, 'YYYY-MM-DD HH:mm');
            
            var subm1 = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Moisture_1"]}
            var subm2 = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Moisture_2"] }
            var subm3 = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Moisture_3"] }
            var subm4 = { x: date.format('D-MMM-YY HH:mm'), y: tempData[i]["Moisture_4"] }
            dataM1.push(subm1);
            dataM2.push(subm2);
            dataM3.push(subm3);
            dataM4.push(subm4);
        }
        this.graphData.push(dataM1)
        this.graphData.push(dataM2)
        this.graphData.push(dataM3)
        this.graphData.push(dataM4)
        console.log(JSON.stringify(this.graphData));
    }

//return HTML of what I want to display
  return(
  <div>
      <AreaChart
        data={this.graphData}
        datePattern={'%d-%b-%y %H:%M'}
        xType={'time'}
        axes
        yDomainRange={[0, 100]}
        grid
        areaColors={['orange', 'purple', 'green', 'blue']}
        interpolate={'cardinal'}
        width={750}
        height={320}
        margin={{top: 0, right: 0, bottom: 50, left: 65}}
        axisLabels={{x: 'Time', y: '%'}}
      />
        <legend></legend>
        <table class = "legendFormat">
            <th class = "Legend">Legend</th>
            <tr>
                <td class="Legend">Moisture_1 = </td>
                <td><span class="M1dot"></span></td>
                <td class="Space"></td>
                <td class="Legend">Moisture_2 = </td>
                <td><span class="M2dot"></span></td>
                <td class="Space"></td>
                <td class="Legend">Moisture_3 = </td>
                <td><span class="M3dot"></span></td>
                <td class="Space"></td>
                <td class="Legend">Moisture_4 = </td>
                <td><span class="M4dot"></span></td>
                <td class="Space"></td>
            </tr>
        </table>
        <br />
        </div>
    );
}

renderMoistDataList(data) {
  if (data !== undefined) {
     var count = data.length;
    this.chartData = []
    var tempData = data.slice(count-144,count);
    var i
      console.log(JSON.stringify(tempData));
     for (i = 0; i < tempData.length; i++) {
        var subtime = new Date(tempData[i].Time).toLocaleString("en-US")
         
        this.chartData.push({
             Sensor: tempData[i].Sensor, 
             userID: tempData[i].userID, 
             Moisture_1: tempData[i].Moisture_1, 
             Moisture_2: tempData[i].Moisture_2,
             Moisture_3: tempData[i].Moisture_3,
             Moisture_4: tempData[i].Moisture_4,
             MAC: tempData[i].MAC, 
             Time: subtime});
      }
  }
  return (
    <div>
        <div>
          {"Total Datapoints: " + count
            + " Viewing: " + (count < 144 ? count : 144)
          }
        <br/>
          {"Note: Only sensor data associated to logged in user is viewable"}
        </div>
        <BootstrapTable data={this.chartData} striped hover>
          <TableHeaderColumn dataField='Sensor' isKey={true} hidden={true}>Sensor</TableHeaderColumn>
          <TableHeaderColumn dataField='Time'>Time</TableHeaderColumn>
          <TableHeaderColumn dataField='Moisture_1'>Moisture_1</TableHeaderColumn>
          <TableHeaderColumn dataField='Moisture_2'>Moisture_2</TableHeaderColumn>
          <TableHeaderColumn dataField='Moisture_3'>Moisture_3</TableHeaderColumn>
          <TableHeaderColumn dataField='Moisture_4'>Moisture_4</TableHeaderColumn>
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

renderMoistureData() {
  return (
    <div className="moistData">
      <PageHeader>Your Moisture Sensor Data</PageHeader>
      <div>
        {this.renderMoistGraph(this.state.moistData)}
        {this.renderMoistDataList(this.state.moistData)}
      </div>
    </div>
  );
}

  render() {
    return (
      <div className="ListMoistureData">
        {this.props.isAuthenticated ? this.renderMoistureData() : this.renderLander()}
      </div>
    );
  }
}
