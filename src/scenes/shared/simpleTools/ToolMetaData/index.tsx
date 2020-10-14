import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
    Breadcrumb,
    Button,
    Checkbox,
    CheckboxProps,
    Form,
    Grid,
    InputOnChangeData,
    Modal,
    TextAreaProps
} from 'semantic-ui-react';
import tools from '../../../dashboard/defaults/toolNames';
import {IToolMetaDataEdit} from './ToolMetaData.type';

interface IProps {
    isDirty: boolean;
    onSave: (tool: IToolMetaDataEdit) => any;
    readOnly: boolean;
    tool: IToolMetaDataEdit;
}

const ToolMetaData = (props: IProps) => {
    const [tool, setTool] = useState<IToolMetaDataEdit>(props.tool);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setTool(props.tool);
    }, [props.tool]);

    const history = useHistory();

    const handleButtonClick = () => setIsEditing(!isEditing);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>,
        {value, name, checked}: CheckboxProps | InputOnChangeData | TextAreaProps
    ) => {
        const cTool = {
            ...tool,
            [name]: checked !== undefined ? checked : value
        };
        setTool(cTool);
    };

    const handleSave = () => {
        props.onSave(tool);
        setIsEditing(false);
    };

    const renderBreadcrumbs = () => {
        let fTool = {name: ''};
        const filteredTools = tools.filter((t) => tool.tool === t.slug);
        if (filteredTools.length > 0) {
            fTool = filteredTools[0];
        }

        return (
            <Breadcrumb>
                <Breadcrumb.Section
                    link={true}
                    onClick={() => history.push('/tools')}
                >
                    Tools
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron"/>
                <Breadcrumb.Section>{tool.tool}. {fTool.name}</Breadcrumb.Section>
                <Breadcrumb.Divider icon="right arrow"/>
                <Breadcrumb.Section active={true}>
                    {tool.name}
                    {!props.readOnly &&
                    <Button basic={true} size={'small'} icon="pencil" onClick={handleButtonClick}/>}
                </Breadcrumb.Section>
            </Breadcrumb>
        );
    };

    const {readOnly} = props;

    return (
        <div>
            <Grid padded={true}>
                <Grid.Column style={{paddingTop: 0, paddingBottom: 0}}>
                    {renderBreadcrumbs()}
                </Grid.Column>
            </Grid>

            <Modal size={'mini'} open={isEditing} dimmer={'blurring'}>
                <Grid padded={true}>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Form>
                                <Form.Group>
                                    <Form.Input
                                        label="Name"
                                        name={'name'}
                                        value={tool.name}
                                        width={12}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Field width={1}>
                                        <label>Public</label>
                                        <Checkbox
                                            toggle={true}
                                            checked={tool.public}
                                            onChange={handleInputChange}
                                            name={'public'}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.TextArea
                                        label="Description"
                                        disabled={readOnly}
                                        name="description"
                                        onChange={handleInputChange}
                                        placeholder="Description"
                                        value={tool.description}
                                        width={16}
                                    />
                                </Form.Group>
                                <Button onClick={handleButtonClick}>Cancel</Button>
                                <Button disabled={tool.name.length < 3} positive={true} onClick={handleSave}>
                                    Save
                                </Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal>
        </div>
    );
};

export default ToolMetaData;
