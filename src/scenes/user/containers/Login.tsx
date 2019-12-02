import React, {ChangeEvent, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {submitLoginCredentials} from '../../../services/api';
import {Action} from '../actions/index';
import logo from '../images/favicon.png';
import {hasSessionKey} from '../reducers';

const styles = {
    login: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(60%)'
    }
};

const login = () => {

    const dispatch = useDispatch();
    const session = useSelector((state: IRootReducer) => state.session);
    const userIsLoggedIn = hasSessionKey(session);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onLoginClick = () => {
        setLoading(true);
        submitLoginCredentials({username, password})
            .then((r: any) => dispatch(Action.login(username, r.data.token)))
            .catch((e) => {
                dispatch(Action.loginError());
                setLoading(false);
                setError(e);
            });
    };

    if (userIsLoggedIn) {
        return <Redirect to={'/tools'}/>;
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
                    {error &&
                    <Message negative={true}>
                        <p>Wrong username/email or password. <br/>Please try again.</p>
                    </Message>
                    }
                    <Form size={'small'} className="fluid segment" loading={loading}>
                        <Form.Field>
                            <input
                                onChange={onUsernameChange}
                                placeholder="Username or email"
                            />
                        </Form.Field>
                        <Form.Field>
                            <input
                                onChange={onPasswordChange}
                                placeholder="Password"
                                type="password"
                            />
                        </Form.Field>
                        <Button
                            color={'blue'}
                            fluid={true}
                            size={'large'}
                            onClick={onLoginClick}
                        >
                            Login
                        </Button>
                    </Form>
                    <Message attached="bottom" warning={true}>
                        New to us?<br/>
                        <Link to={'/signup'}>Sign Up here!</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default login;
