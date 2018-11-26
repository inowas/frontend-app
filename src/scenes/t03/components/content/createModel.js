import React from 'react';
import PropTypes from 'prop-types';
import {sendCommand} from 'services/api';
import {Button, Checkbox, Form, Grid, Segment} from 'semantic-ui-react';
import {CreateModelMap} from '../maps';
import {GridSize} from 'core/model/modflow';
import Command from '../../commands/command';

class CreateModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            name: this.props.name,
            description: this.props.description,
            geometry: null,
            boundingBox: null,
            gridSize: this.props.gridSize.toObject(),
            lengthUnit: this.props.lengthUnit,
            timeUnit: this.props.timeUnit,
            isPublic: this.props.isPublic,
            error: false,
            loading: false
        }
    }

    buildPayload = () => ({
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        geometry: this.state.geometry && this.state.geometry,
        bounding_box: this.state.boundingBox && this.state.boundingBox,
        grid_size: this.state.gridSize,
        active_cells: this.state.activeCells && this.state.activeCells,
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

    handleGridSizeChange = (e, {value, name}) => {
        const gridSize = GridSize.fromObject(this.state.gridSize);
        gridSize[name] = value;
        this.setState({gridSize: gridSize.toObject()});
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
                                        label='Rows'
                                        name={'nY'}
                                        value={(GridSize.fromObject(this.state.gridSize)).nY}
                                        width={8}
                                        onChange={this.handleGridSizeChange}
                                    />
                                    <Form.Input
                                        label='Columns'
                                        name={'nX'}
                                        value={GridSize.fromObject(this.state.gridSize).nX}
                                        width={8}
                                        onChange={this.handleGridSizeChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input
                                        label='Length unit'
                                        value={this.state.lengthUnit}
                                        width={8}
                                        disabled={true}
                                    />
                                    <Form.Input
                                        label='Time unit'
                                        value={this.state.timeUnit}
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
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    lengthUnit: PropTypes.number.isRequired,
    timeUnit: PropTypes.number.isRequired,
    isPublic: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
};

export default CreateModel;
