import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import NavBar from '../../shared/Navbar';
import {changePassword} from '../actions/actions';
import logo from '../images/favicon.png';

const styles = {
    link: {cursor: 'pointer'},
    wrapper: {marginTop: 40},
    form: {textAlign: 'left'}
};

class UserCredentials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
            showErrorMessages: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const {webData} = nextProps;
        if (this.isSuccess(webData)) {
            this.setState({
                oldPassword: '',
                newPassword: '',
                passwordConfirmation: '',
                showErrorMessages: false
            });
        }
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
            this.props.changePassword({
                oldPassword, newPassword
            });
        }

        this.setState({
            showErrorMessages: true
        });
    };

    renderMessage = () => {
        // The request was successful
        const {webData} = this.props;
        if (this.isSuccess(webData)) {
            return (
                <Message attached="top" success>
                    {'Your new password has been saved.'}
                </Message>
            );
        }

        // A request-Error was happening
        if (this.isError()) {
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

    isError = () => {
        const request = this.props.webData['users/CHANGE_PASSWORD'];
        return request && request.type === 'error';
    };

    isLoading = () => {
        const request = this.props.webData['users/CHANGE_PASSWORD'];
        return request && request.type === 'loading';
    };

    isSuccess = (webData) => {
        if (!webData) {
            return false;
        }
        const request = webData['users/CHANGE_PASSWORD'];
        return request && request.type === 'success';
    };

    render() {
        const {oldPassword, newPassword, passwordConfirmation} = this.state;
        return (
            <div>
                <NavBar/>
                <Container className={'profile'}>
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
                                    loading={this.isLoading()}
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
        webData: state.webData
    };
};

const mapDispatchToProps = {
    changePassword: changePassword
};

UserCredentials.propTypes = {
    webData: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserCredentials));
