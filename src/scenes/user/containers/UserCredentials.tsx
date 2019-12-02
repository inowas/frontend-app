import React, {ChangeEvent, useState} from 'react';
import {useSelector} from 'react-redux';
import {Button, Container, Form, Grid, Header, Image, Message} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {sendCommand} from '../../../services/api';
import NavBar from '../../shared/Navbar';
import UserCommand from '../commands/userCommand';
import logo from '../images/favicon.png';

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

const userCredentials = () => {

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [showErrorMessages, setShowErrorMessages] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const user = useSelector((state: IRootReducer) => state.user);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case 'oldPassword':
                return setOldPassword(value);
            case 'newPassword':
                return setNewPassword(value);
            case 'passwordConfirmation':
                return setPasswordConfirmation(value);

        }
    };

    const validate = (np: string, pwc: string) => {
        if (np.length <= 5) {
            return {
                isValid: false,
                message: 'The password has to be larger then 5 digits.'
            };
        }
        if (np !== pwc) {
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

    const onSubmitClick = () => {
        const formValidation = validate(newPassword, passwordConfirmation);
        if (formValidation.isValid) {
            setLoading(true);
            sendCommand(UserCommand.changeUserPassword(user.userName, oldPassword, newPassword),
                () => {
                    setError(false);
                    setSuccess(true);
                    setOldPassword('');
                    setNewPassword('');
                    setPasswordConfirmation('');
                    setShowErrorMessages(false);
                    setLoading(false);
                },
                () => {
                    setError(true);
                    setShowErrorMessages(true);
                    setLoading(false);
                }
            );
        }

        setShowErrorMessages(true);
    };

    const renderMessage = () => {
        if (success) {
            return (
                <Message attached="top" success={true}>
                    {'Your new password has been saved.'}
                </Message>
            );
        }

        // A request-Error was happening
        if (error) {
            return (
                <Message attached="top" error={true}>
                    {'The current password seems to be wrong.'}
                </Message>
            );
        }

        // A Form-Validation-Error was happening
        const formValidation = validate(newPassword, passwordConfirmation);
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
            <Container style={styles.credentials}>
                <Grid textAlign="center">
                    <Grid.Column style={{maxWidth: 350}}>
                        <Header as="h2">
                            <Image src={logo}/>
                            <Header.Content>
                                Change Password
                            </Header.Content>
                        </Header>

                        {renderMessage()}

                        <Form size={'small'} className="segment" style={styles.form}>
                            <Form.Field>
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    onChange={onInputChange}
                                    placeholder="Current password"
                                    value={oldPassword}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    onChange={onInputChange}
                                    placeholder="New password"
                                    value={newPassword}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Repeat new Password</label>
                                <input
                                    type="password"
                                    name="passwordConfirmation"
                                    onChange={onInputChange}
                                    placeholder="Confirmation"
                                    value={passwordConfirmation}
                                />
                            </Form.Field>
                            <Button
                                color={'blue'}
                                onClick={onSubmitClick}
                                loading={loading}
                                disabled={!(newPassword.length > 2 && newPassword === passwordConfirmation)}
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

export default userCredentials;
