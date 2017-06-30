import React, { PropTypes } from 'react';
import SignUpForm from '../components/SignUpForm.jsx';


class SignUpPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      error: '',
      user: {
        username: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    var phoneNumber = "+1" + this.state.user.phoneNumber.replace(/\s/g, '');
    // console.log(phoneNumber);
    // create a string for an HTTP body message
    const ecdPhoneNumber = encodeURIComponent(phoneNumber);
    const formData = `user=${ecdPhoneNumber}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        var uid = xhr.response.uid;
        // change the component-container state
        this.setState({
          error: ''
        });

        // set a message
        localStorage.setItem('successMessage', xhr.response.message);

        // make a redirect
        this.context.router.replace('/verify/' + uid);
      } else {
        // failure

        console.log(xhr);

        this.setState({
          error: "Something went wrong or this phone number already has an account."
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        error={this.state.error}
        user={this.state.user}
      />
    );
  }

}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

module.exports = SignUpPage;