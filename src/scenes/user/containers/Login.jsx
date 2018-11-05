import React from 'react';
import PropTypes from 'prop-types';

import {Action} from '../actions/index';
import {connect} from 'react-redux';
import {hasSessionKey} from '../reducers/index';
import {withRouter, Link} from 'react-router-dom';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import logo from '../images/favicon.png';

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
            loading: false
        };
    }

    checkAuthentication() {
        if (this.props.userIsLoggedIn) {
            this.props.fetchUser();
            this.props.history.push('/tools');
        }
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
        this.props.authenticate(this.state.username, this.state.password);
        this.setState({
            loading: true
        });
    };

    render() {
        this.checkAuthentication();
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
                            New to us?<br/>
                            <Link to={'/signup'}>Sign Up here!</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        userIsLoggedIn: hasSessionKey(state.session)
    };
};

const mapDispatchToProps = {
    authenticate: Action.authentication,
    fetchUser: Action.fetchUser
};

Login.propTypes = {
    authenticate: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
