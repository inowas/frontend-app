import {Checkbox, Form, Header, Icon, InputOnChangeData, Label, Message, Segment, Table} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {Link} from 'react-router-dom';
import {fetchApiWithToken, sendCommandAsync, submitSignUpCredentials} from '../../../services/api';
import {useSelector} from 'react-redux';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import React, {useEffect, useState} from 'react';
import UserCommand from '../../user/commands/userCommand';
import getConfig from '../../../config.default';

export interface IUser {
    id: string;
    username: string;
    email: string;
    enabled: boolean;
    archived: boolean;
    name: string;
    profile: {
        name: string,
        email: string
    };
    roles: string[];
    login_token: string;
}

export interface INewUser {
    username: string;
    name: string;
    email: string;
    password: string;
}

const Users = () => {

        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [errorCreateNewUser, setErrorCreateNewUser] = useState<boolean | any>(false);
        const [errorLoading, setErrorLoading] = useState<boolean>(false);
        const [copyToClipBoardSuccessfulId, setCopyToClipBoardSuccessfulId] = useState<string>('');
        const [users, setUsers] = useState<IUser[]>([]);
        const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
        const [search, setSearch] = useState<string>('');
        const me = useSelector((state: IRootReducer) => state.user);

        const [newUser, setNewUser] = useState<INewUser>({username: '', name: '', email: '', password: ''});

        useEffect(() => {
            const f = async () => {
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    const users: IUser[] = (await fetchApiWithToken('users')).data;
                    setUsers(users);
                    sortAndSetSelectedUsers(users);
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            f();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() => {
            sortAndSetSelectedUsers(users);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [search]);

        const sortAndSetSelectedUsers = (users: IUser[]) => {
            setSelectedUsers(
                users
                    .sort((a, b) => {
                        return a.username.toLowerCase().localeCompare(b.username.toLowerCase());
                    })
                    .sort((a, b) => {
                        let result = 0;

                        if (a.roles.includes('ROLE_ADMIN')) {
                            result -= 1;
                        }

                        if (b.roles.includes('ROLE_ADMIN')) {
                            result += 1;
                        }

                        return result;
                    })
                    .sort((a, b) => {
                            if (a.archived) {
                                return 1;
                            }

                            if (b.archived) {
                                return -1;
                            }
                            return 0;
                        }
                    )
                    .filter((u) => JSON.stringify(u).includes(search))
            );
        };

        const onIsAdminCheckboxClick = (userId: string, promoteAdmin: boolean) => {
            const sc = async () => {
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    if (promoteAdmin) {
                        await sendCommandAsync(UserCommand.promoteUser(userId, 'ROLE_ADMIN'));
                        sortAndSetSelectedUsers(users.map(user => {
                            if (user.id === userId) {
                                user.roles.push('ROLE_ADMIN');
                            }

                            return user;
                        }));
                    }

                    if (!promoteAdmin) {
                        await sendCommandAsync(UserCommand.demoteUser(userId, 'ROLE_ADMIN'));
                        sortAndSetSelectedUsers(users.map(user => {
                            if (user.id === userId) {
                                user.roles = user.roles.filter(r => r !== 'ROLE_ADMIN');
                            }

                            return user;
                        }));
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
                    if (enable) {
                        await sendCommandAsync(UserCommand.enableUser(userId));
                        sortAndSetSelectedUsers(users.map(user => {
                            if (user.id === userId) {
                                user.enabled = true;
                            }

                            return user;
                        }));
                    }

                    if (!enable) {
                        await sendCommandAsync(UserCommand.disableUser(userId));
                        sortAndSetSelectedUsers(users.map(user => {
                            if (user.id === userId) {
                                user.enabled = false;
                            }

                            return user;
                        }));
                    }
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            sc();
        };

        const onDeleteUserClick = (userId: string, archive: boolean) => {
            const sc = async () => {
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    if (archive) {
                        try {
                            await sendCommandAsync(UserCommand.deleteUser(userId));
                            sortAndSetSelectedUsers(users.filter(user => user.id !== userId));
                        } catch (e) {
                            await sendCommandAsync(UserCommand.archiveUser(userId));
                            sortAndSetSelectedUsers(users.map(user => {
                                if (user.id === userId) {
                                    user.archived = true;
                                }

                                return user;
                            }));
                        } finally {
                            setIsLoading(false);
                        }
                    }

                    if (!archive) {
                        await sendCommandAsync(UserCommand.reactivateUser(userId));
                        sortAndSetSelectedUsers(users.map(user => {
                            if (user.id === userId) {
                                user.archived = false;
                            }

                            return user;
                        }));
                    }
                } catch (e) {
                    setErrorLoading(true);
                } finally {
                    setIsLoading(false);
                }
            };

            sc();
        };

        const loginUrl = (userId: string, token: string) => `${getConfig()['URL']}/login/${userId}/${token}`;

        const onCopyToClipboard = (message: string, id: string) => () => {
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
            setCopyToClipBoardSuccessfulId(id);
        };

        const handleSearchChange = (e: any, {value}: { value: string }) => {
            setSearch(value);
        };

        const renderUsers = (users: IUser[]) => {
            return (
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>E-mail</Table.HeaderCell>
                            <Table.HeaderCell>Enabled</Table.HeaderCell>
                            <Table.HeaderCell>Admin</Table.HeaderCell>
                            <Table.HeaderCell>Link</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {users.map((u) => (
                            <Table.Row key={u.id}>
                                <Table.Cell><Link to={`/admin/users/${u.id}`}>{u.username}</Link></Table.Cell>
                                <Table.Cell disabled={u.archived}>{u.name}</Table.Cell>
                                <Table.Cell disabled={u.archived}>{u.email}</Table.Cell>
                                <Table.Cell disabled={u.archived}>
                                    {<Checkbox
                                        disabled={u.id === me.id}
                                        slider={true}
                                        checked={u.enabled}
                                        onClick={() => onIsEnabledCheckboxClick(u.id, !u.enabled)}
                                    />}
                                </Table.Cell>
                                <Table.Cell disabled={u.archived}>
                                    {<Checkbox
                                        disabled={u.id === me.id}
                                        slider={true}
                                        checked={u.roles.includes('ROLE_ADMIN')}
                                        onClick={() => onIsAdminCheckboxClick(u.id, !u.roles.includes('ROLE_ADMIN'))}
                                    />}
                                </Table.Cell>
                                <Table.Cell disabled={u.archived}>
                                    <Button
                                        icon={true}
                                        onClick={onCopyToClipboard(loginUrl(u.id, u.login_token), u.id)}
                                        positive={true}
                                    >
                                        <Icon
                                            name={copyToClipBoardSuccessfulId === u.id ? 'clipboard check' : 'clipboard outline'}/>
                                    </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        icon={true}
                                        onClick={() => onDeleteUserClick(u.id, !u.archived)}
                                        negative={true}
                                    >
                                        <Icon name={u.archived ? 'redo' : 'trash'}/>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            );
        };

        const handleNewUserChange = (e: any, {value, name}: InputOnChangeData) => {
            switch (name) {
                case 'name':
                    setNewUser({...newUser, name: value});
                    break;

                case 'email':
                    setNewUser({...newUser, email: value.toLowerCase()});
                    break;
            }
        };

        const handleNewUserSave = () => {
            const {email, name, password} = newUser;

            const sc = async () => {
                setIsLoading(true);
                setErrorLoading(false);
                try {
                    await submitSignUpCredentials({name, email, password});
                    const users: IUser[] = (await fetchApiWithToken('users?' + Math.random())).data;
                    setUsers(users);
                    sortAndSetSelectedUsers(users);
                } catch (e) {
                    setErrorCreateNewUser(e);
                } finally {
                    setIsLoading(false);
                }
            };

            sc();

        };

        const newUserDataIsValid = () => {
            return newUser.email.length > 5;
        };

        return (
            <Segment color={'grey'} loading={isLoading}>
                {errorCreateNewUser && <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>{errorCreateNewUser && errorCreateNewUser.response && errorCreateNewUser.response.data && errorCreateNewUser.response.data.message}</p>
                </Message>}
                <Header as={'h2'}>Users</Header>
                <Segment color={'grey'}>
                    <Label ribbon={true} color={'blue'}>Add user</Label>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <Form.Input label={'Name'} value={newUser.name} onChange={handleNewUserChange} name={'name'}/>
                            <Form.Input label={'Email'} value={newUser.email} onChange={handleNewUserChange}
                                        name={'email'}/>
                            <Form.Input label={'Password'} value={Math.random().toString(36).slice(-8)}/>
                        </Form.Group>
                        <Button
                            disabled={!newUserDataIsValid()}
                            onClick={handleNewUserSave}
                            positive={true}
                        >
                            Save
                        </Button>
                    </Form>

                </Segment>
                <Segment color={'grey'} loading={isLoading}>
                    {errorLoading && <Message negative>
                        <Message.Header>Error</Message.Header>
                        <p>Error loading.</p>
                    </Message>}
                    <Form>
                        <Label ribbon={true} color={'blue'}>Users list</Label>
                        <Form.Input focus placeholder='Search...' size={'big'} onChange={handleSearchChange}/>
                        {selectedUsers && renderUsers(selectedUsers)}
                    </Form>
                </Segment>
            </Segment>
        );
    }
;

export default Users;
