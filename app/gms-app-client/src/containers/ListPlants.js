import React, { Component } from "react";
import ReactTable from "react-table"
import { API } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./ListPlants.css";

export default class ListPlants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      plants: []
    };
  }

  async componentDidMount() {
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    const plants = await this.plants();
    this.setState({ plants });
  } catch (e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

plants() {
  return API.get("plants", "plants");
}

renderPlantsList(plants) {
  return (
    <div>
        <ReactTable
          data={plants}
          columns={[
                {
                  accessor: "name"
                },
                {
                  id: "qty",
                },
                {
                  accessor: "date"
                },
                {
                  accessor: "sunlight"
                },
                {
                  accessor: "age"
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

  renderPlants() {
    return (
      <div className="plants">
        <PageHeader>Your Plants</PageHeader>
        <div>
          {this.renderPlantsList(this.state.plants)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="Plants">
        {this.props.isAuthenticated ? this.renderPlants() : this.renderLander()}
      </div>
    );
  }
}
