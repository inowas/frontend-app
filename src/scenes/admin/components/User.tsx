import {
    Button,
    Form,
    Grid,
    Message,
    Segment,
} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {IUser} from './Users';
import {deleteToolInstance, updateToolInstanceMetadata} from '../../dashboard/commands';
import {fetchApiWithToken, sendCommand, sendCommandAsync} from '../../../services/api';
import {isEqual} from 'lodash';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import ToolsDataTable from './ToolsDataTable';
import UserCommand from '../../user/commands/userCommand';
import getConfig from '../../../config.default';

export interface IUserDetails extends IUser {
    tools: {
        created_at: string;
        description: string;
        id: string;
        name: string;
        public: boolean;
        tool: string;
        updated_at: string;
        user_id: string;
        user_name: string;
    }[]
}

interface IProps {
    id: string
}

const User = (props: IProps) => {

        const me = useSelector((state: IRootReducer) => state.user);

        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [errorLoading, setErrorLoading] = useState<boolean>(false);
        const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
        const [copyToClipBoardSuccessful, setCopyToClipBoardSuccessful] = useState<boolean>(false);

        const [username, setUsername] = useState<string>('');
        const [name, setName] = useState<string>('');
        const [email, setEmail] = useState<string>('');
        const [newPassword, setNewPassword] = useState<string | null>(null);

        useEffect(() => {
            const f = async () => {
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    const user: IUserDetails = (await fetchApiWithToken(`users/${props.id}`)).data;
                    setUserDetails(user);
                    setUsername(user.username);
                    setName(user.name);
                    setEmail(user.email);
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            f();
        }, [props.id]);

        const isDirty = () => {
            const copy = {...userDetails, username, name, email};
            return !isEqual(userDetails, copy);
        };

        const onIsAdminCheckboxClick = (userId: string, promoteAdmin: boolean) => {
            const sc = async () => {
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    if (promoteAdmin && userDetails) {
                        await sendCommandAsync(UserCommand.promoteUser(userId, 'ROLE_ADMIN'));
                        setUserDetails({...userDetails, roles: userDetails.roles.concat(['ROLE_ADMIN'])});
                    }

                    if (!promoteAdmin && userDetails) {
                        await sendCommandAsync(UserCommand.demoteUser(userId, 'ROLE_ADMIN'));
                        setUserDetails({...userDetails, roles: userDetails.roles.filter(r => r !== 'ROLE_ADMIN')});
                    }
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            sc();
        };

        const onIsEnabledCheckboxClick = (userId: string, enable: boolean) => {
            const sc = async () => {
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    if (enable && userDetails) {
                        await sendCommandAsync(UserCommand.enableUser(userId));
                        setUserDetails({...userDetails, enabled: true});
                    }

                    if (!enable && userDetails) {
                        await sendCommandAsync(UserCommand.disableUser(userId));
                        setUserDetails({...userDetails, enabled: false});
                    }
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            sc();
        };

        const onUpdateClick = () => {
            const u = async () => {
                if (!userDetails) {
                    return;
                }
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    if (userDetails.username !== username && username.length > 5) {
                        await sendCommand(UserCommand.changeUsername(userDetails.id, username));
                        setUserDetails({...userDetails, username});
                    }

                    if (userDetails.name !== name || userDetails.email !== email) {
                        await sendCommand(UserCommand.changeUserProfile(userDetails.id, {name, email}));
                        setUserDetails({
                            ...userDetails, name, email,
                            profile: {...userDetails.profile, name, email}
                        });
                    }

                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            u();
        };

        const onArchiveClick = (userId: string, archive: boolean) => {
            const u = async () => {
                if (!userDetails) {
                    return;
                }
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    if (archive) {
                        await sendCommand(UserCommand.archiveUser(userId));
                        setUserDetails({...userDetails, archived: true});
                    }

                    if (!archive) {
                        await sendCommand(UserCommand.reactivateUser(userId));
                        setUserDetails({...userDetails, archived: false});
                    }
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            u();
        };

        const onResetPasswordClick = () => {
            const u = async () => {
                if (!userDetails) {
                    return;
                }
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    const newPassword = Math.random().toString(36).slice(-8);
                    await sendCommand(UserCommand.changeUserPassword(userDetails.id, '', newPassword));
                    setNewPassword(newPassword);
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            u();
        };

        const onRevokeLoginTokenClick = () => {
            const u = async () => {
                if (!userDetails) {
                    return;
                }
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    await sendCommand(UserCommand.revokeLoginToken(userDetails.id));
                    const user: IUserDetails = (await fetchApiWithToken(`users/${props.id}`)).data;
                    setUserDetails(user);
                    setCopyToClipBoardSuccessful(false);
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            u();
        };

        const loginUrl = (userId: string, token: string) => `${getConfig()['URL']}/login/${userId}/${token}`;

        const onCopyToClipboard = (message: string) => () => {
            const dummy = document.createElement('textarea');
            // to avoid breaking orgain page when copying more words
            // cant copy when adding below this code
            // dummy.style.display = 'none'
            document.body.appendChild(dummy);
            // Be careful if you use texarea.
            // setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
            dummy.value = message;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            setCopyToClipBoardSuccessful(true);
        };

        const onChangeMetadata = (tool: string, id: string, name: string, description: string, isPublic: boolean) => {
            const sc = async () => {

                if (!userDetails) {
                    return;
                }

                setIsLoading(true);
                setErrorLoading(false);
                try {
                    await sendCommandAsync(updateToolInstanceMetadata(tool, {id, name, description, isPublic}));
                    setUserDetails({
                        ...userDetails, tools: userDetails.tools.map((t) => {
                            if (t.id === id) {
                                t.public = isPublic;
                            }
                            return t;
                        })
                    });

                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            sc();
        };

        const onDeleteToolClick = (tool: string, id: string) => {
            const sc = async () => {
                if (!userDetails) {
                    return;
                }

                setIsLoading(true);
                setErrorLoading(false);
                try {
                    await sendCommandAsync(deleteToolInstance(tool, id));
                    setUserDetails({...userDetails, tools: userDetails.tools.filter((t) => t.id !== id)});
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            sc();
        };

        return (
            <Segment color={'grey'}>
                {errorLoading && <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>There was an error fetching the userdata.</p>
                </Message>}
                {userDetails && <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment color={'red'} loading={isLoading}>
                                <Form>
                                    <Form.Group>
                                        <Form.Checkbox
                                            label='Administrator'
                                            toggle={true}
                                            disabled={userDetails.id === me.id}
                                            checked={userDetails.roles.includes('ROLE_ADMIN')}
                                            onClick={() => onIsAdminCheckboxClick(userDetails.id, !userDetails.roles.includes('ROLE_ADMIN'))}
                                        />
                                        <Form.Checkbox
                                            label='Enabled'
                                            disabled={userDetails.id === me.id}
                                            onClick={() => onIsEnabledCheckboxClick(userDetails.id, !userDetails.enabled)}
                                            toggle={true}
                                            checked={userDetails.enabled}
                                        />
                                        <Form.Checkbox
                                            label='Archived'
                                            disabled={userDetails.id === me.id}
                                            onClick={() => onArchiveClick(userDetails.id, !userDetails.archived)}
                                            toggle={true}
                                            checked={userDetails.archived}
                                        />
                                    </Form.Group>
                                    <Form.Input
                                        label='Username'
                                        value={username}
                                        onChange={(e, data) => setUsername(data.value)}
                                    />
                                    <Form.Input
                                        label='Name'
                                        value={name}
                                        onChange={(e, data) => setName(data.value)}
                                    />
                                    <Form.Input
                                        label='E-mail'
                                        value={email}
                                        onChange={(e, data) => setEmail(data.value)}
                                    />
                                    <Button
                                        positive={true}
                                        disabled={!isDirty()}
                                        onClick={onUpdateClick}
                                    >
                                        Update
                                    </Button>
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment color={'red'} loading={isLoading}>
                                <Form>
                                    <Form.TextArea type={'textarea'} label={'Login Link'}
                                                   value={loginUrl(userDetails.id, userDetails.login_token)}/>
                                    <Button
                                        negative={true}
                                        onClick={onRevokeLoginTokenClick}
                                    >
                                        Revoke Login Link
                                    </Button>
                                    <Button
                                        floated={'right'}
                                        positive={true}
                                        onClick={onCopyToClipboard(loginUrl(userDetails.id, userDetails.login_token))}
                                        disabled={copyToClipBoardSuccessful}
                                    >
                                        Copy To Clipboard
                                    </Button>
                                </Form>
                            </Segment>
                            <Segment color={'red'} loading={isLoading}>
                                <Form>
                                    <Form.Input
                                        label='Password'
                                        value={newPassword || '********'}
                                    />
                                    <Button
                                        negative={true}
                                        onClick={onResetPasswordClick}
                                    >
                                        Reset Password
                                    </Button>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <ToolsDataTable
                                tools={userDetails.tools}
                                onChangeMetadata={onChangeMetadata}
                                onDelete={onDeleteToolClick}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>}
            </Segment>
        );
    }
;

export default User;
