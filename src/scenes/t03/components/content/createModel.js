import React from 'react';
import PropTypes from 'prop-types';
import {sendCommand} from 'services/api';
import CreateModflowModelCommand from '../../commands/createModflowModelCommand';
import {Button, Checkbox, Form, Grid, Segment} from 'semantic-ui-react';

import createModflowModelPayloadSchema from '../../commands/createModflowModelPayloadSchema';
import {CreateModelMap} from '../maps';
import {getValidator} from 'services/jsonSchemaValidator';


class CreateModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            error: false,
            loading: false
        }
    }

    handleSave = () => {
        const command = new CreateModflowModelCommand(this.state.data);
        return sendCommand(command, () => this.props.history.push('T03/' + this.state.data.id));
    };

    handleInputChange = (e, {value, name, checked}) => {
        this.setState({
            data: {...this.state.data, [name]: value || checked}
        });
    };

    handleGridSizeChange = (e, {value, name}) => {
        this.setState({
            data: {
                ...this.state.data,
                grid_size: {
                    ...this.state.data.grid_size,
                    [name]: value
                }
            }
        });
    };

    handleMapInputChange = ({activeCells, boundingBox, geometry}) => {
        this.setState({
            data: {
                ...this.state.data,
                active_cells: activeCells,
                bounding_box: boundingBox,
                geometry
            }
        })
    };

    validate() {
        const validator = getValidator().compile(createModflowModelPayloadSchema);
        return [validator(this.state.data), validator.errors];
    }

    render() {
        return (
            <Segment color={'grey'}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form color={'grey'}>
                                <Form.Group>
                                    <Form.Input
                                        label='Name'
                                        name={'name'}
                                        value={this.state.data.name}
                                        width={14}
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Field width={1}>
                                        <label>Public</label>
                                        <Checkbox
                                            toggle
                                            checked={this.state.data.public}
                                            onChange={this.handleInputChange}
                                            name={'public'}
                                            width={2}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.TextArea
                                        label="Description"
                                        name="description"
                                        onChange={this.handleInputChange}
                                        placeholder="Description"
                                        value={this.state.data.description}
                                        width={16}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form color={'grey'}>
                                <Form.Group>
                                    <Form.Input
                                        label='Rows'
                                        name={'n_y'}
                                        value={this.state.data.grid_size.n_y}
                                        width={8}
                                        onChange={this.handleGridSizeChange}
                                    />
                                    <Form.Input
                                        label='Columns'
                                        name={'n_x'}
                                        value={this.state.data.grid_size.n_x}
                                        width={8}
                                        onChange={this.handleGridSizeChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input
                                        label='Length unit'
                                        value={this.state.data.length_unit}
                                        width={8}
                                        disabled={true}
                                    />
                                    <Form.Input
                                        label='Time unit'
                                        value={this.state.data.time_unit}
                                        width={8}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <CreateModelMap
                                activeCells={this.state.data.active_cells}
                                boundingBox={this.state.data.bounding_box}
                                geometry={this.state.data.geometry}
                                gridSize={this.state.data.grid_size}
                                styles={this.state.data.styles}
                                onChange={this.handleMapInputChange}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Button
                                type='submit'
                                onClick={this.handleSave}
                                disabled={!this.validate()[0]}
                            >
                                Save
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

CreateModel.proptypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default CreateModel;
