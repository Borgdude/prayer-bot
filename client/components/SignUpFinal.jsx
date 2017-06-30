import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';
var axios = require('axios');

const SignUpFinal = React.createClass({
    getInitialState: function(){
        return {
            password: '',
            password2: '',
            same: true
        }
    },

    handleSubmit: function(event){
        event.preventDefault();
        var that = this;
        var params = new URLSearchParams();
        params.append('password', this.state.password);
        params.append('memberid', this.props.params.uid);
        axios.post("/auth/truesignup", params).then(function(res){
            console.log(res.data);
            localStorage.removeItem("verified");
            window.location.reload();
            that.context.router.replace('/login');
        }, function(err){
            console.log(err);
            that.setState({
                err: err
            });
        });
    },

    render: function() {
        var { err, password, password2 } = this.state;
        return (
            <Row center="xs">
                <Col xs={12} sm={6} md={4} lg={3}>
                    <Card>
                    <h2 className="card-heading">Finally Sign Up</h2>
                    <p>Enter password</p>
                    <div className="card">
                        <form action="/" onSubmit={this.handleSubmit}>

                        {err && <p className="error-message">{err.summary}</p>}
                        <div className="field-line">
                            <TextField
                            label="Password"
                            type="password"
                            name="password"
                            onChange={(e) => {
                                var password = e.target.value;

                                this.setState({password: password});
                            }}
                            value={this.state.password}
                            />
                        </div>
                        <div className="field-line">
                            <TextField
                            label="Password Again"
                            type="password"
                            name="password2"
                            onChange={(e) => {
                                var password = e.target.value;

                                this.setState({password2: password});
                            }}
                            value={this.state.password2}
                            />
                        </div>

                        {(password !== password2) && <p className="error-message">Passwords must be the same</p>}

                        <div className="button-line">
                            <Button raised type="submit" disabled={(password !== password2) || (password.length < 5 && password2.length < 5)}>Sign Up</Button>
                        </div>

                        </form>
                    </div>
                    </Card>
                </Col>
                </Row>
        );
    }
});

SignUpFinal.contextTypes = {
  router: PropTypes.object.isRequired
};

module.exports = SignUpFinal;
