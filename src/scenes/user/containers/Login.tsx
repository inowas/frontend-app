import {Action} from '../actions/index';
import {AxiosResponse} from 'axios';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {Link, useHistory, useParams} from 'react-router-dom';
import {hasSessionKey} from '../reducers';
import {submitLoginCredentials, submitTokenLogin} from '../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import React, {ChangeEvent, useEffect, useState} from 'react';
import logo from '../images/favicon.png';

const styles = {
    login: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(60%)'
    }
};

const Login = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const {id, token} = useParams<{id: string, token: string}>();
    const session = useSelector((state: IRootReducer) => state.session);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!(id && token)) {
            return;
        }

        const f = async () => {
            setLoading(true);
            try {
                const response: AxiosResponse<{ token: string }> = await submitTokenLogin(id, token);
                const data = response.data;
                dispatch(Action.login('', data.token));
                history.push('/tools');
            } catch (e) {
                setError(e);
                history.push('/login');
            } finally {
                setLoading(false);
            }
        };

        f();

        return () => {
            setLoading(true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect( () => {
        const userIsLoggedIn = hasSessionKey(session);
        if (userIsLoggedIn) {
            history.push('/tools');
        }
    }, [history, session])

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

export default Login;
