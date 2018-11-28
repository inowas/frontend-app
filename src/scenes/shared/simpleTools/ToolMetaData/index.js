import React from 'react';
import PropTypes from 'prop-types';
import {Breadcrumb, Button, Checkbox, Form, Grid, Modal} from 'semantic-ui-react';

class ToolMetaData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tool: props.tool,
            edit: false
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            tool: props.tool
        })
    }

    handleButtonClick = () => {
        this.setState({
            edit: !this.state.edit
        })
    };

    handleInputChange = (e, {value, name, checked}) => {
        const tool = {...this.state.tool, [name]: value || checked};
        this.setState({tool}, () => this.props.onChange(tool));
    };

    handleSave = () => {
        this.props.onSave(this.state.tool);
        this.setState({edit: false})
    };

    renderBreadcrumbs = () => (
        <Breadcrumb size='large'>
            <Breadcrumb.Section link>Tools</Breadcrumb.Section>
            <Breadcrumb.Divider/>
            <Breadcrumb.Section link>{this.props.tool.type}</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right angle'/>
            <Breadcrumb.Section active>
                {this.state.tool.name}
                {!this.props.readOnly && <Button basic size={'small'} icon='pencil' onClick={this.handleButtonClick}/>}
            </Breadcrumb.Section>
        </Breadcrumb>
    );

    render() {
        const {readOnly} = this.props;
        const isDirty = this.props.isDirty === true;
        const {edit} = this.state;
        return (
            <div>
                <Grid padded>
                    <Grid.Column style={{paddingTop: 0, paddingBottom: 0}}>
                        {this.renderBreadcrumbs()}
                        {!this.props.readOnly &&
                        <Button
                            floated={'right'}
                            positive
                            onClick={this.handleSave}
                            disabled={!isDirty}
                        >
                            Save
                        </Button>
                        }
                    </Grid.Column>
                </Grid>

                <Modal size={'small'} open={edit} onClose={this.handleButtonClick}>
                    <Grid padded>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Form color={'grey'}>
                                    <Form.Group>
                                        <Form.Input
                                            label='Name'
                                            name={'name'}
                                            value={this.state.tool.name}
                                            width={7}
                                            onChange={this.handleInputChange}
                                        />
                                        <Form.Field width={1}>
                                            <label>Public</label>
                                            <Checkbox
                                                toggle
                                                checked={this.state.tool.public}
                                                onChange={this.handleInputChange}
                                                name={'public'}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.TextArea
                                            label="Description"
                                            disabled={readOnly}
                                            name="description"
                                            onChange={this.handleInputChange}
                                            placeholder="Description"
                                            value={this.state.tool.description}
                                            width={8}
                                        />
                                    </Form.Group>
                                    <Button positive type='submit' onClick={this.handleSave}>Save</Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal>
            </div>
        );
    }
}

ToolMetaData.propTypes = {
    isDirty: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    tool: PropTypes.object.isRequired
};

export default ToolMetaData;
