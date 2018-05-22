import React, { Component } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewPlant.css";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      name: "",
      qty: "",
      date: "",
      age: "",
      sunlight: ""
    };
  }

  validateForm() {
    return this.state.name.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleDropdownChange = event => {
    var index = event.nativeEvent.target.selectedIndex;
    this.setState({
      [event.target.id]: event.nativeEvent.target[index].text
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.createPlant({
        name: this.state.name,
        qty: this.state.qty,
        date: this.state.date,
        age: this.state.age,
        sunlight: this.state.sunlight
      });
      this.setState({ isLoading: false });
      alert("Sucess! Plant added");
    } catch (e) {
      console.log(e);
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createPlant(data) {
    return API.post("plants", "plants", {
      body: data
    }).catch(error => {
      console.log(error.response)
    });
  }

  render() {
    return (
      <div className="NewPlant">
      <h1>Add Plant</h1>
      <form onSubmit={this.handleSubmit}>
        <div className="ProfileFormGroup">
          <FormGroup controlId="name" bsSize="small">
            <Col componentClass={ControlLabel} sm={3}>Plant Name</Col>
            <Col sm={9}>
              <FormControl
                autoFocus
                type="string"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="qty" bsSize="small">
            <Col componentClass={ControlLabel} sm={3}>Quantity</Col>
            <Col sm={9}>
              <FormControl
                value={this.state.qty}
                onChange={this.handleChange}
                type="number"
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="date" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}>Date Planted</Col>
            <Col sm={9}>
              <FormControl
                value={this.state.date}
                onChange={this.handleChange}
                type="Date"
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="age" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}>Age</Col>
            <Col sm={9}>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={this.state.age}
                onChange={this.handleChange}
              >
                <option valie="blank"></option>
                <option value="Seed">Seed</option>
                <option value="Starter">Starter</option>
                <option value="transplant">Transplant</option>
                <option value="Bearing Fruit">Bearing Fruit</option>
              </FormControl>
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="sunlight" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}>Sunlight Required</Col>
            <Col sm={9}>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={this.state.sunlight}
                onChange={this.handleChange}
              >
                <option valie="blank"></option>
                <option value="Full">Full</option>
                <option value="Partial">Partial</option>
                <option value="Shade">Shade</option>
              </FormControl>
            </Col>
          </FormGroup>
        </div>
        <div className="UserProfileSubmitButton">
          <LoaderButton
            bsSize="small"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Submit"
            loadingText="Submitting…"
          />
        </div>
      </form>
      </div>
    );
  }
}
