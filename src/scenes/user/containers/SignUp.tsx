import {submitSignUpCredentials} from '../../../services/api';
import React, {ChangeEvent, useState} from 'react';

import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import {Link, Redirect} from 'react-router-dom';
import {hasSessionKey} from '../reducers';
import {useSelector} from 'react-redux';
import logo from '../images/favicon.png';

import {IRootReducer} from '../../../reducers';
import getConfig from '../../../config.default';

const {USERS_CAN_REGISTER} = getConfig();

const styles = {
    signup: {
        position: 'relative',
        top: '30%',
        transform: 'translateY(40%)'
    }
};

interface IValidation {
    isValid: boolean;
    message: string;
}

const SignUp = () => {

    const session = useSelector((state: IRootReducer) => state.session);
    const userIsLoggedIn = hasSessionKey(session);

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showErrorMessages, setShowErrorMessages] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    if (userIsLoggedIn) {
        return <Redirect to={'/tools'}/>;
    }

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onPasswordConfirmationChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirmation(e.target.value);
    };

    const validateEmail = (e: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(e);
    };

    const validate = (n: string, e: string, pw: string, pwc: string): IValidation => {
        if (n.length <= 5) {
            return {
                isValid: false,
                message: 'The name has to be larger then 5 digits.'
            };
        }

        if (!validateEmail(e)) {
            return {
                isValid: false,
                message: 'The email-address is not correct.'
            };
        }

        if (pw.length <= 5) {
            return {
                isValid: false,
                message: 'The password has to be larger then 5 digits.'
            };
        }

        if (pw !== pwc) {
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

    const signUpRequest = (n: string, e: string, pw: string) => {
        setLoading(true);
        submitSignUpCredentials({name: n, email: e, password: pw}).then(() => {
            setSuccess(true);
            setLoading(false);
        }).catch(() => {
            setError(true);
            setLoading(false);
        });
    };

    const onSignUpClick = () => {
        const formValidation = validate(name, email, password, passwordConfirmation);
        if (formValidation.isValid) {
            signUpRequest(name, email, password);
            setLoading(true);
        }

        setShowErrorMessages(true);
    };

    const renderErrorMessage = () => {
        const formValidation = validate(name, email, password, passwordConfirmation);
        if (!showErrorMessages || formValidation.isValid) {
            return null;
        }

        return (
            <Message attached="top" error={true}>
                {formValidation.message}
            </Message>
        );
    };

    const renderButton = () => {
        if (success) {
            return (
                <Message color={'blue'}>
                    You are registered successfully. You can sign in at the login page.
                </Message>
            );
        }

        if (error) {
            return (
                <Button
                    color={'red'}
                    fluid={true}
                    size={'large'}
                    onClick={onSignUpClick}
                    loading={loading}
                >
                    There was an error registering the new user.
                </Button>
            );
        }

        return (
            <Button
                color={'blue'}
                fluid={true}
                size={'large'}
                onClick={onSignUpClick}
                loading={loading}
                disabled={!USERS_CAN_REGISTER}
            >
                Sign up
            </Button>
        );
    };

    return (
        <Container textAlign={'center'} style={styles.signup}>
            <Grid textAlign="center">
                <Grid.Column style={{maxWidth: 350}}>
                    <Header as="h2">
                        <Image src={logo}/>
                        <Header.Content>
                            Sign up for a new account
                        </Header.Content>
                    </Header>

                    {renderErrorMessage()}

                    <Form size={'small'} className="fluid segment">
                        <Form.Field>
                            <input
                                type="text"
                                onChange={onNameChange}
                                placeholder="Name"
                                disabled={!USERS_CAN_REGISTER}
                            />
                        </Form.Field>
                        <Form.Field>
                            <input
                                type="text"
                                onChange={onEmailChange}
                                placeholder="Email"
                                disabled={!USERS_CAN_REGISTER}
                            />
                        </Form.Field>
                        <Form.Field>
                            <input
                                onChange={onPasswordChange}
                                placeholder="Password"
                                type="password"
                                disabled={!USERS_CAN_REGISTER}
                            />
                        </Form.Field>
                        <Form.Field>
                            <input
                                onChange={onPasswordConfirmationChange}
                                placeholder="Confirm Password"
                                type="password"
                                disabled={!USERS_CAN_REGISTER}
                            />
                        </Form.Field>
                        {renderButton()}
                    </Form>
                    {USERS_CAN_REGISTER &&
                    <Message attached="bottom" warning={true}>
                        Already registered?<br/>
                        <Link to={'/login'}>Login here!</Link>
                    </Message>
                    }
                    {!USERS_CAN_REGISTER &&
                    <Message attached="bottom" warning={true}>
                        Registration closed.<br/>
                        <Link to={'/login'}>Login here!</Link>
                    </Message>
                    }
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default SignUp;
