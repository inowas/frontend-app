import {
    Button,
    Checkbox,
    Form,
    Grid, Icon,
    List,
    Segment
} from 'semantic-ui-react';
import {GridSize} from '../../../core/model/geometry';
import {IGridSize} from '../../../core/model/geometry/GridSize.type';
import {IToolMetaData} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {MCDA} from '../../../core/model/mcda';
import {RouteComponentProps, withRouter} from 'react-router';
import {sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import Command from '../../shared/simpleTools/commands/command';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import uuidv4 from 'uuid';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t05-gis-mcda/',
    icon: <Icon name="file"/>
}];

const CreateProject = (props: RouteComponentProps<any>) => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [gridSize, setGridSize] = useState<IGridSize>({n_x: 10, n_y: 10});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>('New MCDA Project');
    const [validation, setValidation] = useState<string[]>([]);

    useEffect(() => {
        const newValidation: string[] = [];
        if (gridSize.n_x <= 0 || gridSize.n_y <= 0) {
            newValidation.push('Grid sizes must be greater than zero.');
        }
        return setValidation(newValidation);
    }, [gridSize]);

    const handleBlur = () => {
        switch (activeInput) {
            case 'description':
                setDescription(activeValue);
                break;
            case 'name':
                setProjectName(activeValue);
                break;
            case 'n_x':
                setGridSize({
                    ...gridSize,
                    n_x: parseFloat(activeValue)
                });
                break;
            case 'n_y':
                setGridSize({
                    ...gridSize,
                    n_y: parseFloat(activeValue)
                });
                break;
        }
        setActiveValue('');
        setActiveInput(null);
    };

    const handleChangeIsPublic = () => setIsPublic(!isPublic);

    const handleInputChange = (e: SyntheticEvent, {name, value}: any) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleSave = () => {
        const mcda = MCDA.fromDefaults();
        mcda.gridSize = GridSize.fromObject(gridSize);

        const tool: IToolMetaData = {
            id: uuidv4(),
            name: projectName,
            description,
            permissions: 'rwx',
            public: isPublic,
            tool: 'T05',
            type: 'T05',
            data: mcda.toPayload()
        };

        setIsLoading(true);
        sendCommand(
            Command.createToolInstance(tool),
            () => {
                const path = props.match.path;
                const basePath = path.split(':')[0];
                setIsLoading(false);
                props.history.push(basePath + tool.id + '/criteria');
            },
            () => setValidation(['Server Error: Please contact the webmaster!'])
        );
    };

    return (
        <AppContainer navbarItems={navigation}>
            <Segment color={'grey'}>
                <Grid padded={true} columns={2}>
                    <Grid.Row stretched={true}>
                        <Grid.Column width={10}>
                            <Segment>
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label="Name"
                                            name={'name'}
                                            value={activeInput === 'name' ? activeValue : projectName}
                                            width={14}
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Field>
                                            <label>Public</label>
                                            <Checkbox
                                                toggle={true}
                                                checked={isPublic}
                                                onChange={handleChangeIsPublic}
                                                name={'isPublic'}
                                                width={2}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.TextArea
                                        label="Description"
                                        name="description"
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        placeholder="Description"
                                        value={activeInput === 'description' ? activeValue : description}
                                        width={16}
                                    />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Segment>
                                <Form>
                                    <Form.Input
                                        type="number"
                                        label="Rows"
                                        name={'n_y'}
                                        value={activeInput === 'n_y' ? activeValue : gridSize.n_y}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Input
                                        type="number"
                                        label="Columns"
                                        name={'n_x'}
                                        value={activeInput === 'n_x' ? activeValue : gridSize.n_x}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                    />
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    {validation.length > 0 &&
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Segment>
                                <List>
                                    {validation.map((row, key) => <List.Item key={key}>{row}</List.Item>)}
                                </List>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Button
                                primary={true}
                                type="submit"
                                onClick={handleSave}
                                disabled={validation.length > 0}
                                loading={isLoading}
                            >
                                Create model
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </AppContainer>
    );
};

export default withRouter(CreateProject);
