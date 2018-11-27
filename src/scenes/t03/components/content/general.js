import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Button, Checkbox, Form, Grid, Segment} from 'semantic-ui-react';
import {fetchUrl, sendCommand} from 'services/api';
import Command from "../../commands/command";

class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            isPublic: '',
            loading: true,
            dirty: false,
            error: false
        }
    }

    componentDidMount() {
        fetchUrl(
            `modflowmodels/${this.props.match.params.id}`,
            model => this.setState({
                id: model.id,
                name: model.name,
                description: model.description,
                activeCells: model.active_cells,
                boundingBox: model.bounding_box,
                geometry: model.geometry,
                gridSize: model.grid_size,
                lengthUnit: model.length_unit,
                timeUnit: model.time_unit,
                isPublic: model.public,
                permissions: model.permissions,
                isLoading: false
            }),
            error => this.setState({error, isLoading: false})
        );
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
        this.setState({loading: true});
        return sendCommand(
            Command.updateModflowModel(this.buildPayload()), () => this.setState({loading: false})
        );
    };

    handleInputChange = (e, {value, name, checked}) => {
        this.setState({
            [name]: value || checked,
            dirty: true
        });
    };

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment color={'grey'} loading={this.state.isLoading}>
                            <Form color={'grey'}>
                                <Form.Group>
                                    <Form.Input
                                        label='Name'
                                        name={'name'}
                                        value={this.state.name}
                                        width={7}
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.TextArea
                                        label="Description"
                                        disabled={this.state.readOnly}
                                        name="description"
                                        onChange={this.handleInputChange}
                                        placeholder="Description"
                                        value={this.state.description}
                                        width={8}
                                    />
                                    <Form.Field width={1}>
                                        <label>Public</label>
                                        <Checkbox
                                            toggle
                                            checked={this.state.isPublic}
                                            onChange={this.handleInputChange}
                                            name={'isPublic'}
                                        />
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                            <Button
                                type='submit'
                                onClick={this.handleSave}
                                disabled={!this.state.dirty}
                            >
                                Save
                            </Button>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

General.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};


export default withRouter(General);
