import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

const SignupForm = ({
  onSubmit,
  onChange,
  err,
  successMessage,
  user
}) => (
    <Row center="xs">
      <Col xs={12} sm={6} md={4} lg={3}>
        <Card>
          <h2 className="card-heading">Sign Up</h2>
          <div className="card">
              <form action="/" onSubmit={onSubmit}>

              {err.summary && <p className="error-message">{err.summary}</p>}
              <div className="field-line">
                  <TextField
                  floatingLabelText="Username"
                  name="username"
                  onChange={onChange}
                  value={user.username}
                  />
              </div>

              <div className="field-line">
                  <TextField
                  floatingLabelText="Password"
                  type="password"
                  name="password"
                  onChange={onChange}
                  value={user.password}
                  />
              </div>

              <div className="button-line">
                <RaisedButton type="submit" label="Create New Account" primary />
              </div>

                  <p>Already have an account? <Link to={'/login'}>Log in</Link></p>

              </form>
          </div>
        </Card>
      </Col>
    </Row>
);

module.exports = SignupForm;
