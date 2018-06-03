import React, { Component } from "react";
import { API } from "aws-amplify";
import {BootstrapTable, TableHeaderColumn, DeleteButton} from 'react-bootstrap-table';
import { PageHeader, ListGroup, ListGroupItem, button} from "react-bootstrap";
import "./ListPlants.css";
import './react-bootstrap-table-all.min.css';

export default class ListPlants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isDeleting: false,
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

  handlePlantClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }


  deletePlant(keyObj) {
    return API.del("plants", `plants/delete`, {
      body: keyObj
    }).catch(error => {
      console.log(error.response)
    });
  }

  handleDeleteButtonClick = async event => {
    event.preventDefault();

    var deleteKeys = this.refs.table.state.selectedRowKeys;

    console.log("DELETE KEY: " + deleteKeys[0] + "DELETE KEY 2: " + deleteKeys[1]);

    const confirmed = window.confirm("Are you sure you want to delete the selected plant(s)?");

    if (!confirmed) {
      return;
    }
    this.setState({ isDeleting: true });

    try {
      console.log("try");
      for (var i = 0; i < deleteKeys.length; i++) {
        console.log("There's a var");
        await this.deletePlant({
          plantId: deleteKeys[i]
        });
      }
      const plants = await this.plants();
      this.setState({ plants });

    } catch(e) {
      alert(e);
      this.setState({ isDeleting: false });
  }
}

  deleteButton(cell, row) {
    return (
      <button
      type="submit"
      >
        <span className="glyphicon glyphicon-trash"></span>
      </button>
    );
  }

  renderPlantsList(plants) {

    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true
    };

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
    <BootstrapTable data={plants}  striped hover selectRow = { selectRowProp } ref='table' deleteRows>
      <TableHeaderColumn dataField='plantId' isKey={true} hidden={true}></TableHeaderColumn>
      <TableHeaderColumn dataField='name'>Plant Name</TableHeaderColumn>
      <TableHeaderColumn dataField='qty'>Quantity</TableHeaderColumn>
      <TableHeaderColumn dataField='date'>Date Planted</TableHeaderColumn>
      <TableHeaderColumn dataField='sunlight'>Sunlight Required</TableHeaderColumn>
      <TableHeaderColumn dataField='age'>Age</TableHeaderColumn>
      <TableHeaderColumn dataField='MAC'>Associated Sensor</TableHeaderColumn>
      <TableHeaderColumn dataField='button' dataFormat={this.deleteButton.bind(this)} width='5%'/>

    </BootstrapTable>
    <ListGroupItem
      onClick={this.handleDeleteButtonClick.bind(this)}
    >
      <h4>
      <b>{"\uFF0D"}</b> Delete selected plant(s)
      </h4>
    </ListGroupItem>
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
