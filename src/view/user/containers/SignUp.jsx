import '../../less/login.less';

import ConfiguredAxios from 'ConfiguredAxios';
import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';
import {hasSessionKey} from '../reducers';
import {withRouter} from 'react-router';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import logo from '../images/favicon.png';
import NavBar from './Navbar';


const styles = {
    link: {
        cursor: 'pointer'
    }
};

class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.checkAuthentication(this.props);
        this.state = {
            name: '',
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            loading: false,
            showErrorMessages: false,
            success: false,
            error: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.checkAuthentication(nextProps);
        if (this.props.userSignUpPending) {
            this.setState({
                success: true
            });
        }
    }

    checkAuthentication() {
        if (this.props.userIsLoggedIn) {
            this.pushTo('/');
        }
    }

    pushTo = (url) => {
        this.props.router.push(url);
    };

    onNameChange = e => {
        const name = e.target.value;

        this.setState({
            name,
            validInput: this.validate(
                name,
                this.state.email,
                this.state.password,
                this.state.passwordConfirmation,
                this.state.username
            )
        });
    };

    onUsernameChange = e => {
        const username = e.target.value;
        this.setState({
            username,
            validInput: this.validate(
                this.state.name,
                this.state.email,
                this.state.password,
                this.state.passwordConfirmation,
                username
            )
        });
    };

    onEmailChange = e => {
        const email = e.target.value;
        this.setState({
            email,
            validInput: this.validate(
                this.state.name,
                email,
                this.state.password,
                this.state.passwordConfirmation,
                this.state.username
            )
        });
    };

    onPasswordChange = e => {
        const password = e.target.value;
        this.setState({
            password,
            validInput: this.validate(
                this.state.name,
                this.state.email,
                password,
                this.state.passwordConfirmation,
                this.state.username
            )
        });
    };

    onPasswordConfirmationChange = e => {
        const passwordConfirmation = e.target.value;
        this.setState({
            passwordConfirmation,
            validInput: this.validate(
                this.state.name,
                this.state.email,
                this.state.password,
                passwordConfirmation,
                this.state.username
            )
        });
    };

    validateUsername = (username) => {
        const re = /^[a-zA-Z.\-]+$/;

        if (username.length <= 5) {
            return false;
        }

        return re.test(username);
    };

    validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    validateForm = () => {
        return this.validate(
            this.state.name,
            this.state.email,
            this.state.password,
            this.state.passwordConfirmation,
            this.state.username
        );
    };

    validate = (name, email, password, passwordConfirmation, username) => {
        if (name.length <= 5) {
            return {
                isValid: false,
                message: 'The name has to be larger then 5 digits.'
            };
        }

        if (!this.validateUsername(username)) {
            return {
                isValid: false,
                message: 'The username can contain only alphanumeric characters and dots.'
            };
        }

        if (!this.validateEmail(email)) {
            return {
                isValid: false,
                message: 'The email-address is not correct.'
            };
        }

        if (password.length <= 5) {
            return {
                isValid: false,
                message: 'The password has to be larger then 5 digits.'
            };
        }

        if (password !== passwordConfirmation) {
            return {
                isValid: false,
                message: 'The confirmed password is not the same as the password.'
            };
        }

        return {
            isValid: true,
            message: ''
        };
    };

    signUpRequest = (name, username, email, password, redirectTo) => {
        ConfiguredAxios.post('/users/signup.json', {
            name,
            username,
            email,
            password,
            redirectTo
        }).then(() => this.setState({success: true, loading: false})
        ).catch(() => this.setState({error: true, loading: false}));
    };

    onSignUpClick = () => {
        const formValidation = this.validateForm();
        if (formValidation.isValid) {
            const redirectTo = location.protocol + '//' + location.hostname + '/login';
            // this.props.signup(this.state.name, this.state.username, this.state.email, this.state.password, redirectTo);
            this.signUpRequest(this.state.name, this.state.username, this.state.email, this.state.password, redirectTo);
            this.setState({loading: true});
        }

        this.setState({
            showErrorMessages: true
        });
    };

    renderErrorMessage = () => {
        const formValidation = this.validateForm();
        if (!this.state.showErrorMessages || formValidation.isValid) {
            return null;
        }

        return (
            <Message attached="top" error>
                {formValidation.message}
            </Message>
        );
    };

    renderButton = () => {
        if (this.state.success) {
            return (
                <Message color={'blue'}>
                    Thank you, please check your E-Mail Inbox.
                </Message>
            );
        }

        if (this.state.error) {
            return (
                <Button
                    color={'red'}
                    fluid size="large"
                    onClick={this.onSignUpClick}
                    loading={this.state.loading}
                >
                    There was an error registering the new user.
                </Button>
            );
        }


        return (
            <Button
                color={'blue'}
                fluid size="large"
                onClick={this.onSignUpClick}
                loading={this.state.loading}
            >
                Sign up
            </Button>
        );
    };

    render() {
        return (
            <div>
                <NavBar/>
                <Container textAlign={'center'} className={'signup'}>
                    <Grid textAlign="center">
                        <Grid.Column style={{maxWidth: 350}}>
                            <Header as="h2">
                                <Image src={logo}/>
                                <Header.Content>
                                    Sign up for a new account
                                </Header.Content>
                            </Header>

                            {this.renderErrorMessage()}

                            <Form size={'small'} className="fluid segment">
                                <Form.Field>
                                    <input
                                        type="text"
                                        onChange={this.onNameChange}
                                        placeholder="Name"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        type="text"
                                        onChange={this.onUsernameChange}
                                        placeholder="Username"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        type="text"
                                        onChange={this.onEmailChange}
                                        placeholder="Email"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        onChange={this.onPasswordChange}
                                        placeholder="Password"
                                        type="password"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        onChange={this.onPasswordConfirmationChange}
                                        placeholder="Confirm Password"
                                        type="password"
                                    />
                                </Form.Field>
                                {this.renderButton()}
                            </Form>
                            <Message attached="bottom" warning>
                                Already registered?&nbsp;<a style={styles.link} onClick={() => this.pushTo('/login')}>Login
                                here!</a>.
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
        userIsLoggedIn: hasSessionKey(state.user)
    };
};

SignUp.propTypes = {
    router: PropTypes.object.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired,
    userSignUpPending: PropTypes.bool.isRequired
};

// eslint-disable-next-line no-class-assign
SignUp = withRouter(connect(mapStateToProps)(SignUp));

export default SignUp;
