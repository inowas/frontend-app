import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {sendCommand} from 'services/api';
import {Button, Checkbox, Form, Grid, Segment} from 'semantic-ui-react';
import {CreateModelMap} from '../maps';
import {GridSize} from 'core/model/modflow';
import Command from '../../commands/command';
import defaults from '../../defaults/createModel';

class CreateModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: defaults.id,
            name: defaults.name,
            description: defaults.description,
            geometry: null,
            boundingBox: null,
            gridSize: defaults.gridSize.toObject(),
            lengthUnit: defaults.lengthUnit,
            timeUnit: defaults.timeUnit,
            isPublic: defaults.isPublic,
            error: false,
            loading: false,
            gridSizeLocal: defaults.gridSize.toObject(),
        }
    }

    buildPayload = () => ({
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        geometry: this.state.geometry,
        bounding_box: this.state.boundingBox,
        grid_size: this.state.gridSize,
        active_cells: this.state.activeCells,
        length_unit: this.state.lengthUnit,
        time_unit: this.state.timeUnit,
        public: this.state.isPublic
    });

    handleSave = () => {
        return sendCommand(
            Command.createModflowModel(this.buildPayload()), () => this.props.history.push('T03/' + this.state.id)
        );
    };

    handleInputChange = (e, {value, name, checked}) => {
        this.setState({
            [name]: value || checked
        });
    };

    handleGridSizeChange = (e) => {
        const {type, target} = e;
        const {name, value} = target;

        if (type === 'change') {
            const gridSize = GridSize.fromObject(this.state.gridSizeLocal);
            gridSize[name] = value;
            this.setState({gridSizeLocal: gridSize.toObject()});
        }

        if (type === 'blur') {
            this.setState({gridSize: this.state.gridSizeLocal});
        }
    };

    handleMapInputChange = ({activeCells, boundingBox, geometry}) => {
        this.setState({
            activeCells: activeCells.toArray(),
            boundingBox: boundingBox.toArray(),
            geometry: geometry.toObject()
        })
    };

    validate() {
        return Command.createModflowModel(this.buildPayload()).validate();
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
                                        value={this.state.name}
                                        width={14}
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Field width={1}>
                                        <label>Public</label>
                                        <Checkbox
                                            toggle
                                            checked={this.state.isPublic}
                                            onChange={this.handleInputChange}
                                            name={'isPublic'}
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
                                        value={this.state.description}
                                        width={16}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form color={'grey'}>
                                <Form.Group>
                                    <Form.Input
                                        type='number'
                                        label='Rows'
                                        name={'nY'}
                                        value={(GridSize.fromObject(this.state.gridSizeLocal)).nY}
                                        width={8}
                                        onChange={this.handleGridSizeChange}
                                        onBlur={this.handleGridSizeChange}
                                    />
                                    <Form.Input
                                        type='number'
                                        label='Columns'
                                        name={'nX'}
                                        value={GridSize.fromObject(this.state.gridSizeLocal).nX}
                                        width={8}
                                        onChange={this.handleGridSizeChange}
                                        onBlur={this.handleGridSizeChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Select
                                        label='Length unit'
                                        style={{zIndex: 10000}}
                                        value={this.state.lengthUnit}
                                        options={[{key: 2, text: 'meters', value: 2}]}
                                        width={8}
                                    />
                                    <Form.Select
                                        label='Time unit'
                                        style={{zIndex: 10000}}
                                        value={this.state.timeUnit}
                                        options={[{key: 4, text: 'days', value: 4}]}
                                        width={8}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <CreateModelMap
                                gridSize={GridSize.fromObject(this.state.gridSize)}
                                styles={this.state.styles}
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
                                Create
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

CreateModel.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(CreateModel);
