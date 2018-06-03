import LoaderButton from "../components/LoaderButton";
import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import "./Profile.css";
import { dropdown, dropdownDisabled} from "../utils/Dropdown";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      fname: "",
      lname: "",
      email: "",
      zip: "",
      unclaimed_macs:[],
      claimed_macs:[],
      claim_mac:"",
      about: "",
      profile:[]
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const profile = await this.profile();
      this.setState({ profile });
      console.log(JSON.stringify(profile));
      console.log(profile[0].fname);
      this.setState({fname: [profile[0].fname]});
      this.setState({lname: [profile[0].lname]});
      this.setState({email: [profile[0].email]});
      this.setState({zip:   [profile[0].zip]});
      this.setState({about: [profile[0].about]});
    } catch (e) {
      alert(e);
    }

    try {
      const claimed_macs= await this.getClaimedMACs();
      this.setState({ claimed_macs });
      console.log(JSON.stringify(claimed_macs));
    } catch (e) {
      alert(e);
    }

    try {
      const unclaimed_macs = await this.getUnClaimedMACs();
      this.setState({ unclaimed_macs });
      console.log(JSON.stringify(unclaimed_macs));
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  profile() {
    return API.get("plants", "user");
  }

  getClaimedMACs() {
    return API.get("plants", "pis/claimed");
  }

  getUnClaimedMACs() {
    return API.get("plants", "pis/unclaimed");
  }



  validateForm() {
    return true;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.updateProfile({
        fname: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        zip: Number(this.state.zip),
        about: this.state.about
      });
      this.setState({ isLoading: false });
      console.log("Email: " + this.state.email);
      alert("Sucess! Profile updated");
    } catch (e) {
      console.log(e);
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  updateProfile(data) {
    return API.put("plants", "user/id", {
      body: data
    }).catch(error => {
      console.log(error.response)
    });
  }

  render() {
    return (
      <div className="Profile">
      <h1> User Profile </h1>
      <form onSubmit={this.handleSubmit}>
      <div className="ProfileFormGroup">
        <FormGroup controlId="fname" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}> First Name </Col>
          <Col sm={9}>
            <FormControl
              autoFocus
              type="string"
              placeholder="First Name"
              value={this.state.fname}
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
      </div>
      <div className="ProfileFormGroup">
        <FormGroup controlId="lname" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}> Last Name </Col>
          <Col sm={9}>
            <FormControl
              autoFocus
              type="string"
              placeholder="Last Name"
              value={this.state.lname}
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
      </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="email" bsSize="small">
            <Col componentClass={ControlLabel} sm={3}> Email </Col>
            <Col sm={9}>
              <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                disabled
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="zip" bsSize="small">
            <Col componentClass={ControlLabel} sm={3}> Zip Code </Col>
            <Col sm={9}>
              <FormControl
                value={this.state.zip}
                pattern="[0-9]{5}"
                onChange={this.handleChange}
                placeholder="Five digit zip code"
                type="string"
              />
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="claim_mac" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}>Claim a sensor</Col>
            <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.claim_mac}
                  onChange={this.handleChange}
                >
                <option value="blank"></option>
                { dropdown(this.state.unclaimed_macs, "MAC") }
                </FormControl>
            </Col>
          </FormGroup>
        </div>
        <div className="ProfileFormGroup">
          <FormGroup controlId="claim_mac" bsSize="small">
          <Col componentClass={ControlLabel} sm={3}>Claimed sensors (read only)</Col>
            <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                >
                <option value="blank" selected></option>
                { dropdownDisabled(this.state.claimed_macs, "MAC") }
                </FormControl>
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
                placeholder="Tell me about yourself"
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
