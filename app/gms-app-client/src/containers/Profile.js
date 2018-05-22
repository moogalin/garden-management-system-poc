import LoaderButton from "../components/LoaderButton";
import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import "./Profile.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      location: "",
      password: "",
      raspberry: "",
      about: ""
    };
  }

  validateForm() {

  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

  }

  render() {
    return (
      <div className="Profile">
      <h1> User Profile </h1>
      <br/> Under Construction <br/>
      <form horizontal onSubmit={this.handleSubmit}>
        <div className="ProfileFormGroup">
          <FormGroup controlId="email" bsSize="small">
            <Col componentClass={ControlLabel} sm={3}> Email </Col>
            <Col sm={9}>
              <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="location" bsSize="small">
            <Col componentClass={ControlLabel} sm={3}> Location </Col>
            <Col sm={9}>
              <FormControl
                value={this.state.location}
                onChange={this.handleChange}
                type="string"
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="raspberry" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}>Raspberry Pi MAC </Col>
            <Col sm={9}>
              <FormControl
                value={this.state.raspberry}
                onChange={this.handleChange}
                type="string"
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="about" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}>About Me</Col>
            <Col sm={9}>
              <FormControl
                value={this.state.about}
                onChange={this.handleChange}
                componentClass="textarea"
              />
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
