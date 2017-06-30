import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';
var axios = require('axios');

const TokenForm = React.createClass({
    getInitialState: function(){
        return {
            token: "",
            uid: "",
            err: false
        }
    },

    handleSubmit: function(event){
        event.preventDefault();
        var that = this;
        var params = new URLSearchParams();
        params.append('token', this.state.token);
        params.append('uid', this.props.params.uid);
        axios.post("/auth/verify", params).then(function(res){
            if(res.data.error){
                that.setState({
                    err: res.data.error
                });
            } else {
                localStorage.setItem('verified', true);
                that.context.router.replace('/signupfinal/' + that.props.params.uid);
            }
        }, function(err){
            console.log(err);
            that.setState({
                err: err.toString()
            });
        });
    },

    render: function() {
        var { err } = this.state;
        return (
            <Row center="xs">
                <Col xs={12} sm={6} md={4} lg={3}>
                    <Card>
                    <h2 className="card-heading">Enter Token</h2>
                    <div className="card">
                        <form onSubmit={this.handleSubmit}>

                        {err && <p className="error-message">{err}</p>}

                        <div className="field-line">
                            <TextField
                            label="Token"
                            name="token"
                            onChange={(e) => {
                                var token = e.target.value;

                                this.setState({ token: token });
                            }}
                            value={this.state.token}
                            />
                        </div>
                        <div className="button-line">
                            <Button raised type="submit">Verify</Button>
                        </div>

                        </form>
                    </div>
                    </Card>
                </Col>
                </Row>
        );
    }
});

TokenForm.contextTypes = {
  router: PropTypes.object.isRequired
};

module.exports = TokenForm;
