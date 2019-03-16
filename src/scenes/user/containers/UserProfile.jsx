import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';
import {hasSessionKey} from '../reducers/index';
import {withRouter} from 'react-router-dom';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import NavBar from '../../shared/Navbar';
import {putUserProfile} from '../actions/actions';
import logo from '../images/favicon.png';
import {sendCommand} from '../../../services/api';
import UserCommand from '../commands/userCommand';

const styles = {
    link: {cursor: 'pointer'},
    wrapper: {marginTop: 40},
    form: {textAlign: 'left'},
    profile: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(60%)'
    }
};

class UserProfile extends React.Component {
    constructor(props) {
        const {name, institution, email} = props.profile;
        super(props);
        this.state = {
            name,
            institution,
            email,
            showErrorMessages: false,
            success: false,
            error: false,
            dirty: false,
            loading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const {name, institution, email} = nextProps.profile;
        this.setState({
            name,
            institution,
            email,
            loading: false
        });
    }

    onInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value,
            dirty: true
        });
    };

    validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    validate = (email) => {
        if (!this.validateEmail(email)) {
            return {
                isValid: false,
                message: 'The email-address is not correct.'
            };
        }

        return {
            isValid: true,
            message: ''
        };
    };

    onSubmitClick = () => {
        const {name, email, institution} = this.state;
        const formValidation = this.validate(email);
        if (formValidation.isValid) {
            const profile = {name, email, institution};
            this.setState({loading: true}, () =>
                sendCommand(UserCommand.changeUserProfile(this.props.user.id, profile),
                    () => {
                        this.setState({loading: false});
                        this.props.putUserProfile(profile);
                    },
                    () => this.setState({error: true}),
                )
            );
        }

        this.setState({
            showErrorMessages: true
        });
    };

    renderErrorMessage = () => {
        const formValidation = this.validate(this.state.email);
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
        const {name, email, institution} = this.state;
        return (
            <div>
                <NavBar/>
                <Container style={styles.profile}>
                    <Grid textAlign="center">
                        <Grid.Column style={{maxWidth: 350}}>
                            <Header as="h2">
                                <Image src={logo}/>
                                <Header.Content>
                                    User Profile
                                </Header.Content>
                            </Header>

                            {this.renderErrorMessage()}

                            <Form size={'small'} className="segment" style={styles.form}>
                                <Form.Field>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={this.onInputChange}
                                        placeholder="Name"
                                        value={name}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>E-Mail</label>
                                    <input
                                        type="text"
                                        name="email"
                                        onChange={this.onInputChange}
                                        placeholder="E-Mail"
                                        value={email}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Institution</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        onChange={this.onInputChange}
                                        placeholder="Institution"
                                        value={institution}
                                    />
                                </Form.Field>
                                <Button
                                    disabled={!this.state.dirty}
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
        userIsLoggedIn: hasSessionKey(state.user),
        profile: state.user.profile,
        user: state.user
    };
};

const mapDispatchToProps = {
    putUserProfile: putUserProfile
};

UserProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    putUserProfile: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
