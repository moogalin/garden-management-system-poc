import React, { Component } from "react";
import { API } from "aws-amplify";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./ListPlants.css";
import './react-bootstrap-table-all.min.css';

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
      console.log("State: " +JSON.stringify(this.state));
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  plants() {
    return API.get("plants", "plants");
  }


  renderLander() {
    return ( <
      div className = "lander" >
      <
      h1 > Garden Management System < /h1> <
      p > Garden Management, Made Simple.Login now. < /p> <
      /div>
    );
  }

  renderPlants() {
    return (
      <div className = "plants" >
        <PageHeader> Your Plants </PageHeader>
        <div>
          {this.renderPlantsList(this.state.plants)}
        </div>
      </div>
    );
  }

  handleNoteClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderPlantsList(plants) {

    console.log("In RenderPlants: " + JSON.stringify(plants));


  return (
    <div>
    <ListGroupItem
      href="/plants/new"
      onClick={this.handlePlantClick}
    >
      <h4>
        <b>{"\uFF0B"}</b> Add a new plant
      </h4>
    </ListGroupItem>

    <BootstrapTable data={plants} striped hover>
      <TableHeaderColumn dataField='plantId' isKey={true} hidden={true}></TableHeaderColumn>
      <TableHeaderColumn dataField='name'>Plant Name</TableHeaderColumn>
      <TableHeaderColumn dataField='qty'>Quantity</TableHeaderColumn>
      <TableHeaderColumn dataField='date'>Date Planted</TableHeaderColumn>
      <TableHeaderColumn dataField='sunlight'>Sunlight Required</TableHeaderColumn>
      <TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
      <TableHeaderColumn dataField='MAC'>Associated Sensor</TableHeaderColumn>

    </BootstrapTable>
    </div>
  );
  }

  render() {
    return ( <
      div className = "Plants" > {
        this.props.isAuthenticated ? this.renderPlants() : this.renderLander()
      } <
      /div>
    );
  }
}
