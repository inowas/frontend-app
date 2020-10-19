import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
    Breadcrumb,
    Button,
    Checkbox,
    CheckboxProps,
    Form,
    Grid,
    Icon,
    InputOnChangeData,
    Segment, TextAreaProps
} from 'semantic-ui-react';
import Uuid from 'uuid';
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {sendCommand} from '../../../services/api';
import {createToolInstance} from '../../dashboard/commands';
import AppContainer from '../../shared/AppContainer';
import {ModelMap} from '../../t03/components/maps';

// tslint:disable-next-line:no-empty-interface
interface IProps extends RouteComponentProps {
}

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools',
        icon: <Icon name="file"/>
    }
];

const CreateRTM = () => {

    const [fetchingError, setFetchingError] = useState<boolean>(false);
    const [name, setName] = useState<string>('New monitoring project');
    const [description, setDescription] = useState<string>('');
    const [isPublic, setPublic] = useState<boolean>(true);
    const [tool] = useState<string>('T10');

    const history = useHistory();

    const handleChange = (
        e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>,
        {value, name, checked}: CheckboxProps | InputOnChangeData | TextAreaProps
    ) => {
        const property: string = name;

        if (property === 'name') {
            setName(value as string);
        }

        if (property === 'description') {
            setDescription(value as string);
        }

        if (property === 'public') {
            setPublic(checked as boolean);
        }
    };

    const onCreateClick = () => {
        const rtm: IRtm = {
            id: Uuid.v4(),
            name,
            description,
            permissions: 'rwx',
            public: isPublic,
            tool,
            data: {
                sensors: []
            }
        };

        sendCommand(createToolInstance('T10', rtm),
            () => history.push('/tools/T10/' + rtm.id),
            () => setFetchingError(true)
        );
    };

    return (
        <AppContainer navbarItems={navigation}>
            <Breadcrumb>
                <Breadcrumb.Section>Tools</Breadcrumb.Section>
                <Breadcrumb.Divider icon={'right chevron'}/>
                <Breadcrumb.Section>{'T10'}. {name}</Breadcrumb.Section>
                <Breadcrumb.Divider icon={'right arrow'}/>
            </Breadcrumb>
            <Segment color={'grey'}>
                <Grid padded={true} columns={2}>
                    <Grid.Row stretched={true}>
                        <Grid.Column width={6}>
                            <Segment>
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label={'Name'}
                                            name={'name'}
                                            value={name}
                                            width={14}
                                            onChange={handleChange}
                                        />
                                        <Form.Field>
                                            <label>Public</label>
                                            <Checkbox
                                                toggle={true}
                                                checked={isPublic}
                                                onChange={handleChange}
                                                name={'public'}
                                                width={2}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.TextArea
                                        label="Description"
                                        name="description"
                                        onChange={handleChange}
                                        placeholder="Description"
                                        value={description}
                                        width={16}
                                    />
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Button
                                primary={true}
                                positive={!fetchingError}
                                type="submit"
                                onClick={!fetchingError ? onCreateClick : () => ({})}
                            >
                                {!fetchingError ? 'Create' : 'Error'}
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </AppContainer>
    );

};

export default CreateRTM;
