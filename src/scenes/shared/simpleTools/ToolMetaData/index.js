import React from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Form, Grid, Menu, Segment} from "semantic-ui-react";

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
        this.setState({tool}, this.props.onChange(tool));
    };

    handleSave = () => {
        this.props.onSave(this.state.tool);
    };

    render() {
        const {readOnly} = this.props;
        const {edit} = this.state;
        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Item name='home' active>
                        {this.state.tool.name}
                    </Menu.Item>
                    <Menu.Item onClick={this.handleButtonClick}>
                        <Button basic icon={'pencil alternate'}/>
                    </Menu.Item>
                </Menu>

                {edit &&
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Segment color={'grey'}>
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
                                    <Button type='submit' onClick={this.handleSave}>Save</Button>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                }
            </div>
        );
    }
}

ToolMetaData.propTypes = {
    tool: PropTypes.object.isRequired,
    readOnly: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default ToolMetaData;
