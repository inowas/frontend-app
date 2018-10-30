import '../../less/login.less';

import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';
import {hasSessionKey} from '../reducers';
import {withRouter} from 'react-router';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import NavBar from './Navbar';
import {putUserProfile} from '../actions/actions';
import logo from '../images/favicon.png';

const styles = {
    link: {cursor: 'pointer'},
    wrapper: {marginTop: 40},
    form: {textAlign: 'left'}
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
            this.props.putUserProfile({
                name, email, institution
            });
            this.setState({loading: true});
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
                <Container className={'profile'}>
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
        profile: state.user.profile
    };
};

const mapDispatchToProps = {
    putUserProfile: putUserProfile
};

UserProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    putUserProfile: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
