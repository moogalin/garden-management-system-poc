import React, { Component } from "react";
import ReactTable from "react-table"
import { API } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./ListLightData.css";

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
  return (
    <div>
        <div>
          {"Total Datapoints: " + count
            + " Viewing: 10"}
        </div>
        <ReactTable
          data={data.slice(count-10,count)}
          columns={[
                {
                  accessor: "Sensor"
                },
                {
                  accessor: "Visible",
                },
                {
                  accessor: "IR"
                },
                {
                  accessor: "Time"
                },
                {
                  accessor: "Full_Spectrum"
                }
              ]
            }
        />
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
