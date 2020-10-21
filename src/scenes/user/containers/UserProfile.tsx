import React, {ChangeEvent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {sendCommand} from '../../../services/api';
import NavBar from '../../shared/Navbar';
import {putUserProfile} from '../actions/actions';
import UserCommand from '../commands/userCommand';
import logo from '../images/favicon.png';

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

const UserProfile = () => {

    const dispatch = useDispatch();
    const user = useSelector((state: IRootReducer) => state.user);

    const [name, setName] = useState<string>('');
    const [institution, setInstitution] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [showErrorMessages, setShowErrorMessages] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<boolean>(false);
    const [dirty, setDirty] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setName(user.profile.name);
        setInstitution(user.profile.institution);
        setEmail(user.profile.email);
        setLoading(false);
    }, [user.profile]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (e.target.name) {
            case 'name':
                setDirty(true);
                return setName(value);
            case 'email':
                setDirty(true);
                return setEmail(value);
            case 'institution':
                setDirty(true);
                return setInstitution(value);
        }
    };

    const validateEmail = (em: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(em);
    };

    const validate = (em: string) => {
        if (!validateEmail(em)) {
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

    const onSubmitClick = () => {
        const formValidation = validate(email);
        if (formValidation.isValid) {
            const profile = {name, email, institution};
            setLoading(true);
            sendCommand(UserCommand.changeUserProfile(user.userName, profile),
                () => {
                    setLoading(false);
                    return dispatch(putUserProfile(profile));
                },
                () => setError(true)
            );
        }

        setShowErrorMessages(true);
    };

    const renderErrorMessage = () => {
        const formValidation = validate(email);
        if (!showErrorMessages || formValidation.isValid) {
            return null;
        }

        return (
            <Message attached="top" error={true}>
                {formValidation.message}
            </Message>
        );
    };

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

                        {renderErrorMessage()}

                        <Form size={'small'} className="segment" style={styles.form}>
                            <Form.Field>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={onInputChange}
                                    placeholder="Name"
                                    value={name}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>E-Mail</label>
                                <input
                                    type="text"
                                    name="email"
                                    onChange={onInputChange}
                                    placeholder="E-Mail"
                                    value={email}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Institution</label>
                                <input
                                    type="text"
                                    name="institution"
                                    onChange={onInputChange}
                                    placeholder="Institution"
                                    value={institution}
                                />
                            </Form.Field>
                            <Button
                                disabled={!dirty}
                                color={'blue'}
                                onClick={onSubmitClick}
                                loading={loading}
                            >
                                Save
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        </div>
    );
};

export default UserProfile;
