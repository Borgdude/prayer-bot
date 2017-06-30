import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';
var NumberFormat = require('react-number-format');

const LoginForm = ({
  onSubmit,
  onChange,
  err,
  successMessage,
  user
}) => (
    <Row center="xs">
        <Col xs={12} sm={8} md={6} lg={4}>
        <Card>
          <h2 className="card-heading">Login</h2>
          <div className="card">
              <form action="/" onSubmit={onSubmit}>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {err.summary && <p className="error-message">{err.summary}</p>}
              <div className="field-line">
                  <NumberFormat
                    style={{
                        maxWidth: "100%"
                    }}
                    label="Phone Number"
                    name="phoneNumber"
                    onChange={onChange}
                    value={user.phoneNumber}
                    format="### ### ####"
                    mask="_"
                    prefix={'+1'}
                    customInput={TextField}/>
              </div>

              <div className="field-line">
                  <TextField
                    style={{
                            maxWidth: "100%"
                        }}  
                    label="Password"
                    type="password"
                    name="password"
                    onChange={onChange}
                    value={user.password}
                  />
              </div>

              <div className="button-line">
                <Button raised type="submit" >Log in</Button>
              </div>

                  <p>Don't have an account? <Link to={'/signup'}>Sign Up</Link></p>

              </form>
          </div>
        </Card>
        </Col>
    </Row>
);

module.exports = LoginForm;
