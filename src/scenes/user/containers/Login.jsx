import React from 'react';
import PropTypes from 'prop-types';

import {Action} from '../actions/index';
import {connect} from 'react-redux';
import {hasSessionKey} from '../reducers/index';
import {withRouter, Link, Redirect} from 'react-router-dom';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import logo from '../images/favicon.png';
import {submitLoginCredentials} from '../../../services/api';

const styles = {
    login: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(60%)'
    }
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            loading: false,
            error: null
        };
    }

    onUsernameChange = e => {
        this.setState({
            username: e.target.value
        });
    };

    onPasswordChange = e => {
        this.setState({
            password: e.target.value
        });
    };

    onLoginClick = () => {
        const {username, password} = this.state;
        return this.setState({loading: true},
            () => submitLoginCredentials({username, password},
                response => {
                    this.props.login(username, response.data.token);
                },
                (e) => {
                    this.props.loginError();
                    this.setState({loading: false, error: e});

                }
            )
        );
    };

    render() {

        if (this.props.userIsLoggedIn) {
            return <Redirect to={'/tools'}/>
        }

        return (
            <Container textAlign={'center'} style={styles.login}>
                <Grid textAlign="center">
                    <Grid.Column style={{maxWidth: 350}}>
                        <Header as="h2">
                            <Image src={logo}/>
                            <Header.Content>
                                Log-in to your account
                            </Header.Content>
                        </Header>
                        {this.state.error &&
                        <Message negative><p>Wrong username/email or password. <br/>Please try again.</p></Message>
                        }
                        <Form size={'small'} className="fluid segment">
                            <Form.Field>
                                <input
                                    onChange={this.onUsernameChange}
                                    placeholder="Username or email"
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    onChange={this.onPasswordChange}
                                    placeholder="Password"
                                    type="password"
                                />
                            </Form.Field>
                            <Button
                                color={'blue'}
                                fluid size="large"
                                onClick={this.onLoginClick}
                            >
                                Login
                            </Button>
                        </Form>
                        <Message attached="bottom" warning>
                            New to us?<br/>
                            <Link to={'/signup'}>Sign Up here!</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    userIsLoggedIn: hasSessionKey(state.session)
});

const mapDispatchToProps = {
    authenticate: Action.authentication,
    login: Action.login,
    loginError: Action.loginError,
};

Login.propTypes = {
    history: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    loginError: PropTypes.func.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
