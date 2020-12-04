import {Icon, Message, Segment, Table} from 'semantic-ui-react';
import {fetchApiWithToken} from '../../../services/api';
import React, {useEffect, useState} from 'react';

interface IUser {
    email: string;
    enabled: boolean;
    id: string;
    name: string;
    profile: {
        name: string,
        email: string
    };
    roles: string[];
    username: string;
}

const Users = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);
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
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {users.map((u) => (
                        <Table.Row key={u.id}>
                            <Table.Cell>{u.username}</Table.Cell>
                            <Table.Cell>{u.name}</Table.Cell>
                            <Table.Cell>{u.email}</Table.Cell>
                            <Table.Cell textAlign={'center'}>{u.enabled && <Icon name={'checkmark'}/>}</Table.Cell>
                            <Table.Cell>{u.roles.includes('ROLE_ADMIN') && <Icon name={'checkmark'}/>}</Table.Cell>
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
