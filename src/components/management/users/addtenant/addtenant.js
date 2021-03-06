import React from "react";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import { updateUnits } from "../../../../redux/actions.js";
import { connect } from "react-redux";
import './addtenant.css'
class AddTenant extends React.Component {
  constructor() {
    super();

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      unit_id: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    document.title='New User'
    axios
      .get(`/api/manager/units/${parseInt(this.props.match.params.id)}`)
      .then(response => {
        this.props.updateUnits(response.data);
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmitTenantCreation = async () => {
    try {
      const body = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        unit_id: this.state.unit_id,
        subject: `Login credentials for ${this.state.firstName} ${this.state.lastName}.`
      };
      if (
         !body.first_name &&
        !body.last_name &&
        !body.email &&
        !body.password &&
        !body.unit_id
      ) {
          alert('fields cannot be blank')
      } else {
        await axios.post(`/api/manager/tenants/new`, body)
        alert(`successfully added tenant`)

        await axios.post(`/api/email/1`, body)
        this.setState({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          unit_id: ""
        });
        this.props.history.push(`/users/${this.props.user.id}`)
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  render() {
      console.log(this.state)
    return (
      <div className='user-creation-wrapper'>
      <div className="tenant-container">
        <input
          className="form-input"
          name="firstName"
          type="text"
          placeholder="First Name"
          value={this.state.firstName}
          onChange={this.handleChange}
        />
        <input
          className="form-input"
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={this.state.lastName}
          onChange={this.handleChange}
        />
        <input
          className="form-input"
          name="email"
          type="text"
          placeholder="Email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <input
          className="form-input"
          name="password"
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <select
          value={this.state.unit_id}
          onChange={this.handleChange}
          name="unit_id"
        >
          <option value="">Select Unit Number</option>
          {this.props.units.map((unit, index) => (
            <option key={index} value={unit.id}>
              {unit.unit_number}
            </option>
          ))}
        </select>

        <button
          className="submit-button"
          onClick={this.handleSubmitTenantCreation}
        >
          Submit
        </button>
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    tenants: state.tenants,
    units: state.units
  };
};

export default connect(
  mapStateToProps,
  { updateUnits }
)(withRouter(AddTenant));
