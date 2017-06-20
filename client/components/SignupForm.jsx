import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Input from 'react-toolbox/lib/input';
import {Button, IconButton} from 'react-toolbox/lib/button';
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
            <h2 className="card-heading">Sign Up</h2>
            <div className="card">
                <form action="/" onSubmit={onSubmit}>

                {err.summary && <p className="error-message">{err.summary}</p>}

                    <Input
                    label="Username"
                    name="username"
                    onChange={onChange.bind(this, 'username')}
                    value={user.username}
                    />

                    <Input
                    label="Password"
                    type="password"
                    name="password"
                    onChange={onChange.bind(this, 'password')}
                    value={user.password}
                    />

                    <Button type="submit" label="Sign Up" raised primary/>

                    <p>Already have an account? <Link to={'/login'}>Log in</Link></p>

                </form>
            </div>
        </Col>
    </Row>
);

module.exports = SignupForm;
