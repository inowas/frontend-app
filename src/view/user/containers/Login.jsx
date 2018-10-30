import '../../less/login.less';

import React from 'react';
import PropTypes from 'prop-types';

import { Action } from '../actions';
import {connect} from 'react-redux';
import {hasSessionKey} from '../reducers';
import {withRouter} from 'react-router';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import logo from '../images/favicon.png';
import Navbar from './Navbar';

const styles = {
    link: {
        cursor: 'pointer'
    }
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            loading: false
        };
    }

    checkAuthentication() {
        if (this.props.userIsLoggedIn) {
            this.props.router.push('/tools');
        }
    }

    pushToSignUp = () => {
        this.props.router.push('/signup');
    };

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
        this.props.authenticate(this.state.username, this.state.password);
        this.setState({
            loading: true
        });
    };

    render() {
        this.checkAuthentication();
        return (
            <div>
                <Navbar />
                <Container textAlign={'center'} className={'login'}>
                    <Grid textAlign="center">
                        <Grid.Column style={{maxWidth: 350}}>
                            <Header as="h2">
                                <Image src={logo}/>
                                <Header.Content>
                                    Log-in to your account
                                </Header.Content>
                            </Header>
                            <Form size={'small'} className="fluid segment">
                                    <Form.Field>
                                        <input
                                            onChange={this.onUsernameChange}
                                            placeholder="Username"
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
                               New to us?&nbsp;<a onClick={this.pushToSignUp} style={styles.link}>Sign Up here!</a>.
                            </Message>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userIsLoggedIn: hasSessionKey(state.session)
    };
};

const mapDispatchToProps = {
    authenticate: Action.authentication
};

Login.propTypes = {
    authenticate: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired
};

// eslint-disable-next-line no-class-assign
Login = withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

export default Login;
