import {Checkbox, Icon, Message, Search, Segment, Table} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {Link} from 'react-router-dom';
import {fetchApiWithToken, sendCommandAsync} from '../../../services/api';
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

const Users = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [copyToClipBoardSuccessfulId, setCopyToClipBoardSuccessfulId] = useState<string>('');
    const [users, setUsers] = useState<IUser[]>([]);
    const me = useSelector((state: IRootReducer) => state.user);

    useEffect(() => {
        const f = async () => {
            setIsLoading(true);
            setErrorLoading(false);
            try {
                const users: IUser[] = (await fetchApiWithToken('users')).data;
                sortAndSetUsers(users);
            } catch (e) {
                setErrorLoading(true);
            } finally {
                setIsLoading(false);
            }
        };

        f();
    }, []);

    const sortAndSetUsers = (users: IUser[]) => {
        setUsers(
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
        );
    };

    const onIsAdminCheckboxClick = (userId: string, promoteAdmin: boolean) => {
        const sc = async () => {
            setIsLoading(true);
            setErrorLoading(false);
            try {
                if (promoteAdmin) {
                    await sendCommandAsync(UserCommand.promoteUser(userId, 'ROLE_ADMIN'));
                    sortAndSetUsers(users.map(user => {
                        if (user.id === userId) {
                            user.roles.push('ROLE_ADMIN');
                        }

                        return user;
                    }));
                }

                if (!promoteAdmin) {
                    await sendCommandAsync(UserCommand.demoteUser(userId, 'ROLE_ADMIN'));
                    sortAndSetUsers(users.map(user => {
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
                    sortAndSetUsers(users.map(user => {
                        if (user.id === userId) {
                            user.enabled = true;
                        }

                        return user;
                    }));
                }

                if (!enable) {
                    await sendCommandAsync(UserCommand.disableUser(userId));
                    sortAndSetUsers(users.map(user => {
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

    const onArchiveUserClick = (userId: string, archive: boolean) => {
        const sc = async () => {
            setIsLoading(true);
            setErrorLoading(false);
            try {
                if (archive) {
                    await sendCommandAsync(UserCommand.archiveUser(userId));
                    sortAndSetUsers(users.map(user => {
                        if (user.id === userId) {
                            user.archived = true;
                        }

                        return user;
                    }));
                }

                if (!archive) {
                    await sendCommandAsync(UserCommand.reactivateUser(userId));
                    sortAndSetUsers(users.map(user => {
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
                                    onClick={() => onArchiveUserClick(u.id, !u.archived)}
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

    return (
        <Segment color={'grey'} loading={isLoading}>
            {errorLoading && <Message negative>
                <Message.Header>Error</Message.Header>
                <p>There was an error fetching the userdata.</p>
            </Message>}
            <Search loading={isLoading}/>
            {users && renderUsers(users)}
        </Segment>
    );
};

export default Users;
