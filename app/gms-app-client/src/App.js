import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({
      isAuthenticating: false
    });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Garden Management System</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
            {this.state.isAuthenticated
              ?
              <Fragment>
              <NavDropdown title="Explore" id="nav-dropdown">
                <LinkContainer to="/plants/new">
                  <MenuItem>Add Plant Data</MenuItem>
                </LinkContainer>
                <LinkContainer to="/plants/list">
                  <MenuItem>List Plant Data</MenuItem>
                </LinkContainer>
                <LinkContainer to="/sensors/light">
                  <MenuItem>View Light Data</MenuItem>
                </LinkContainer>
                <LinkContainer to="/charts">
                  <MenuItem>Graph Data</MenuItem>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <MenuItem>User Profile</MenuItem>
                </LinkContainer>
              </NavDropdown>
              <NavItem onClick={this.handleLogout}>Logout</NavItem>
              </Fragment>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
            }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
