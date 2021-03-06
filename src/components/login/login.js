import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { updateUser } from '../../redux/actions.js';
import { connect } from 'react-redux';
import { handleEnterKey } from './utils';
// import "../../reset.css";
import "./login.css";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    document.title = "Login please";
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }


  async handleLogin() {
    try {
      const body = {
        email: this.state.email,
        password: this.state.password,
      };
      if (body.email && body.password) {
        await axios.post("/api/login", body).then(response => {
          this.props.updateUser(response.data);
            if (response.data.administrator === true) {
              this.props.history.push('/managementlanding')
            } else {
              this.props.history.push('/tenantlanding')
      }});  
      } else {
        alert("Please Enter a Valid User name and Password");
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  handleKeyPress(event) {
    handleEnterKey(event, this.handleLogin)
  }

 
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value.toLowerCase() });
  }

 



  


  render() {
    console.log(this.state, "this is state")
    return (
      <div className="LoginPage">
        <div className="LoginBox">
          <div className="Title">
            The Last Small Business Property Management Tool that You'll Ever
            Need!
          </div>
          <div className="Username">
            <input
              placeholder="Email"
              name="email"
              onChange={this.handleChange
              }
            />
          </div>
          <div className="Password">
            <input
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleChange
              }
            />
          </div>
          <div className="LoginButton" onClick={this.handleLogin}>
            Login
          </div>
          <Link className="ResetCredential" to="/reset_credentials">
            Trouble signing in?
          </Link>
          {/* will need a page to reset the password  */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user : state.user
  }
}

export default connect(mapStateToProps, {updateUser}) (withRouter(Login));

