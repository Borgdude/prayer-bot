import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';
var NumberFormat = require('react-number-format');

const SignupForm = ({
  onSubmit,
  onChange,
  error,
  successMessage,
  user
}) => (
    <Row center="xs">
      <Col xs={12} sm={6} md={4} lg={3}>
        <Card>
          <h2 className="card-heading">Sign Up</h2>
          <div className="card">
              <form action="/" onSubmit={onSubmit}>

              {error && <p className="error-message">{error}</p>}
              <div className="field-line">
                  <NumberFormat
                    label="Phone Number"
                    name="phoneNumber"
                    onChange={onChange}
                    value={user.phoneNumber}
                    format="### ### ####"
                    mask="_"
                    prefix={'+1'}
                    customInput={TextField}/>
              </div>

              <div className="button-line">
                <Button type="submit">Create New Account</Button>
              </div>

                  <p>Already have an account? <Link to={'/login'}>Log in</Link></p>

              </form>
          </div>
        </Card>
      </Col>
    </Row>
);

module.exports = SignupForm;
