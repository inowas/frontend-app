import {Icon, Message, Segment, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {fetchApiWithToken} from '../../../services/api';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import React, {useEffect, useState} from 'react';
import getConfig from '../../../config.default';

export interface IUser {
    id: string;
    username: string;
    email: string;
    enabled: boolean;
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

    useEffect(() => {
        const f = async () => {
            setIsLoading(true);
            setErrorLoading(false);
            try {
                const users: IUser[] = (await fetchApiWithToken('users')).data;
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
                );
            } catch (e) {
                setErrorLoading(true);
            } finally {
                setIsLoading(false);
            }
        };

        f();
    }, []);

    const createLoginUrl = (userId: string, token: string) => `${getConfig()['URL']}/login/${userId}/${token}`;

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
                        <Table.HeaderCell>Login Link</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {users.map((u) => (
                        <Table.Row key={u.id}>
                            <Table.Cell><Link to={`/admin/users/${u.id}`}>{u.username}</Link></Table.Cell>
                            <Table.Cell>{u.name}</Table.Cell>
                            <Table.Cell>{u.email}</Table.Cell>
                            <Table.Cell textAlign={'center'}>{u.enabled && <Icon name={'checkmark'}/>}</Table.Cell>
                            <Table.Cell>{u.roles.includes('ROLE_ADMIN') && <Icon name={'checkmark'}/>}</Table.Cell>
                            <Table.Cell>
                                <Button icon={true}
                                        onClick={onCopyToClipboard(createLoginUrl(u.id, u.login_token), u.id)}
                                        basic={true}>
                                    <Icon
                                        name={copyToClipBoardSuccessfulId === u.id ? 'clipboard check' : 'clipboard outline'}/>
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
            {users && renderUsers(users)}
        </Segment>
    );
};

export default Users;
