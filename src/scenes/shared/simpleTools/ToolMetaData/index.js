import React from 'react';
import PropTypes from 'prop-types';
import {Breadcrumb, Button, Checkbox, Form, Grid, Modal} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';

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
            <Breadcrumb.Section
                link
                onClick={() => this.props.history.push('/tools')}
            >
                Tools
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon='right angle'/>
            <Breadcrumb.Section link>{this.state.tool.tool}: {this.state.tool.name}</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right angle'/>
            <Breadcrumb.Section active>
                {this.state.tool.name}
                {!this.props.readOnly && <Button basic size={'small'} icon='pencil' onClick={this.handleButtonClick}/>}
            </Breadcrumb.Section>
        </Breadcrumb>
    );

    renderDefaultButton = () => {
        const defaultButton = typeof this.props.defaultButton === 'boolean' ? this.props.defaultButton : true;
        if (!this.props.readOnly && defaultButton) {
            return (
                <Button
                    floated={'right'}
                    onClick={this.handleReset}
                    disabled={!this.props.isDirty || false}
                >
                    Default
                </Button>
            )
        }
    };

    renderSaveButton = () => {
        const saveButton = typeof this.props.saveButton === 'boolean' ? this.props.saveButton : true;
        if (!this.props.readOnly && saveButton) {
            return (
                <Button
                    floated={'right'}
                    positive
                    onClick={this.handleSave}
                    disabled={!this.props.isDirty || false}
                >
                    Save
                </Button>
            )
        }
    };

    render() {
        const {readOnly} = this.props;
        const {edit} = this.state;

        return (
            <div>
                <Grid padded>
                    <Grid.Column style={{paddingTop: 0, paddingBottom: 0}}>
                        {this.renderBreadcrumbs()}
                        {this.renderSaveButton()}
                        {this.renderDefaultButton()}
                    </Grid.Column>
                </Grid>

                <Modal size={'mini'} open={edit} onClose={this.handleButtonClick} dimmer={'blurring'}>
                    <Grid padded>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label='Name'
                                            name={'name'}
                                            value={this.state.tool.name}
                                            width={12}
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
                                            width={16}
                                        />
                                    </Form.Group>
                                    <Button positive onClick={this.handleSave}>Save</Button>
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
    saveButton: PropTypes.bool,
    tool: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(ToolMetaData);
