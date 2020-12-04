import {Button, Form, Grid, Message, Segment} from 'semantic-ui-react';
import {IUser} from './Users';
import {fetchApiWithToken} from '../../../services/api';
import React, {useEffect, useState} from 'react';

interface IUserDetails extends IUser {
    tools: any
}

interface IProps {
    id: string
}

const User = (props: IProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);

    useEffect(() => {
        const f = async () => {
            setIsLoading(true);
            setErrorLoading(false);
            try {
                const user: IUserDetails = (await fetchApiWithToken(`users/${props.id}`)).data;
                setUserDetails(user);
            } catch (e) {
                setErrorLoading(true);
            } finally {
                setIsLoading(false);
            }
        };

        f();
    }, [props.id]);

    return (
        <Segment color={'grey'} loading={isLoading}>
            {errorLoading && <Message negative>
                <Message.Header>Error</Message.Header>
                <p>There was an error fetching the userdata.</p>
            </Message>}
            {userDetails && <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Segment color={'red'}>
                            <Form success={false}>
                                <Form.Input
                                    label='Username'
                                    value={userDetails.username}
                                />
                                <Form.Input
                                    label='Name'
                                    value={userDetails.name}
                                />
                                <Form.Input
                                    label='E-mail'
                                    value={userDetails.email}
                                />
                                <Form.Group>
                                    <Form.Checkbox
                                        label='Enabled'
                                        toggle={true}
                                        checked={userDetails.enabled}
                                    />
                                    <Form.Checkbox
                                        label='Administrator'
                                        toggle={true}
                                        checked={userDetails.roles.includes('ROLE_ADMIN')}
                                    />
                                </Form.Group>
                                <Message
                                    success
                                    header='Form Completed'
                                    content="You're all signed up for the newsletter"
                                />
                                <Button positive={true}>Update</Button>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>}
        </Segment>
    );
};

export default User;
