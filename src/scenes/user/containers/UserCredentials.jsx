import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import NavBar from '../../shared/Navbar';
import logo from '../images/favicon.png';
import {sendCommand} from 'services/api';
import UserCommand from '../commands/userCommand';

const styles = {
    link: {cursor: 'pointer'},
    wrapper: {marginTop: 40},
    form: {textAlign: 'left'},
    credentials: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(60%)'
    }
};

class UserCredentials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
            showErrorMessages: false,
            success: false,
            error: false,
            dirty: false,
            loading: false
        };
    }

    onInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        });
    };

    validate = () => {
        const {newPassword, passwordConfirmation} = this.state;
        if (newPassword.length <= 5) {
            return {
                isValid: false,
                message: 'The password has to be larger then 5 digits.'
            };
        }
        if (newPassword !== passwordConfirmation) {
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

    onSubmitClick = () => {
        const {oldPassword, newPassword} = this.state;
        const formValidation = this.validate();
        if (formValidation.isValid) {
            return this.setState({loading: true}, () =>
                sendCommand(UserCommand.changeUserPassword(this.props.user.id, oldPassword, newPassword),
                    () => this.setState({
                        error: false,
                        success: true,
                        oldPassword: '',
                        newPassword: '',
                        passwordConfirmation: '',
                        showErrorMessages: false,
                        loading: false
                    }),
                    () => this.setState({error: true, showErrorMessages: true, loading: false})
                )
            )
        }

        return this.setState({showErrorMessages: true})
    };

    renderMessage = () => {
        if (this.state.success) {
            return (
                <Message attached="top" success>
                    {'Your new password has been saved.'}
                </Message>
            );
        }

        // A request-Error was happening
        if (this.state.error) {
            return (
                <Message attached="top" error>
                    {'The current password seems to be wrong.'}
                </Message>
            );
        }

        // A Form-Validation-Error was happening
        const formValidation = this.validate();
        if (!this.state.showErrorMessages || formValidation.isValid) {
            return null;
        }

        return (
            <Message attached="top" error>
                {formValidation.message}
            </Message>
        );
    };

    render() {
        const {oldPassword, newPassword, passwordConfirmation} = this.state;
        return (
            <div>
                <NavBar/>
                <Container style={styles.credentials}>
                    <Grid textAlign="center">
                        <Grid.Column style={{maxWidth: 350}}>
                            <Header as="h2">
                                <Image src={logo}/>
                                <Header.Content>
                                    Change Password
                                </Header.Content>
                            </Header>

                            {this.renderMessage()}

                            <Form size={'small'} className="segment" style={styles.form}>
                                <Form.Field>
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        onChange={this.onInputChange}
                                        placeholder="Current password"
                                        value={oldPassword}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        onChange={this.onInputChange}
                                        placeholder="New password"
                                        value={newPassword}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Repeat new Password</label>
                                    <input
                                        type="password"
                                        name="passwordConfirmation"
                                        onChange={this.onInputChange}
                                        placeholder="Confirmation"
                                        value={passwordConfirmation}
                                    />
                                </Form.Field>
                                <Button
                                    color={'blue'}
                                    onClick={this.onSubmitClick}
                                    loading={this.state.loading}
                                >
                                    Save
                                </Button>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

UserCredentials.propTypes = {
    user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(UserCredentials);
