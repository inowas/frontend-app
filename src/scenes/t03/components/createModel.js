import React from 'react';
import {sendCommand} from 'services/api';
import CreateModflowModel from '../commands/createModflowModel';
import {Button, Checkbox, Form, Grid, Popup, Segment} from 'semantic-ui-react';
import Ajv from 'ajv';
import ajv0 from 'ajv/lib/refs/json-schema-draft-04';
import createModflowModelPayloadSchema from '../commands/createModflowModelPayload';
import {Map, Marker, TileLayer, FeatureGroup, Circle} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const style = {
    map: {
        height: '400px',
        width: '100%'
    }
};

class CreateModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }

    handleSave = () => {
        const command = new CreateModflowModel(this.state.data);
        return sendCommand(command)
    };

    handleInputChange = (e, {value, name, checked}) => {
        this.setState({
            data: {...this.state.data, [name]: value || checked}
        });
    };

    validate() {
        const ajv = new Ajv({schemaId: 'id'});
        ajv.addMetaSchema(ajv0);
        const val = ajv.compile(createModflowModelPayloadSchema);
        return [val(this.state.data), val.errors];
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
                                        name={'grid_size_n_y'}
                                        value={this.state.data.grid_size.n_y}
                                        width={8}
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Input
                                        label='Columns'
                                        name={'grid_size_n_x'}
                                        value={this.state.data.grid_size.n_x}
                                        width={8}
                                        onChange={this.handleInputChange}
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
                            <Map center={[51.505, -0.09]} zoom={13} style={style.map}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                />
                                <Marker position={[51.505, -0.09]}>
                                    <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
                                </Marker>
                                <FeatureGroup>
                                    <EditControl
                                        position='topright'
                                        draw={{
                                            rectangle: false
                                        }}
                                    />
                                    <Circle center={[51.51, -0.06]} radius={200} />
                                </FeatureGroup>
                            </Map>
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

export default CreateModel;
