import React from 'react';
import {Button, Form, Grid, Modal, Segment} from 'semantic-ui-react';
import ZonesMap from '../../maps/zonesMap';
import PropTypes from 'prop-types';
import {SoilmodelLayer, SoilmodelZone} from 'core/model/modflow/soilmodel';
import {Geometry, ModflowModel} from 'core/model/modflow';
import {calculateActiveCells} from 'services/geoTools';

class ZoneModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isError: !props.zone.geometry,
            zone: props.zone.toObject()
        };
    }

    onChange = (e, {name, value}) => {
        const zone = this.state.zone;
        zone[name] = value;
        this.setState({
            zone: zone
        });
    };

    onCreatePath = e => {
        const polygon = e.layer;
        const zone = SoilmodelZone.fromObject(this.state.zone);

        zone.geometry = Geometry.fromGeoJson(polygon.toGeoJSON());
        zone.activeCells = calculateActiveCells(zone.geometry, this.props.model.boundingBox, this.props.model.gridSize);

        return this.setState({
            isError: !zone.geometry,
            zone: zone.toObject()
        });
    };

    onEditPath = e => {
        const layers = e.layers;

        layers.eachLayer(layer => {
            const zone = SoilmodelZone.fromObject(this.state.zone);

            zone.geometry = Geometry.fromGeoJson(layer.toGeoJSON());
            zone.activeCells = calculateActiveCells(zone.geometry, this.props.model.boundingBox, this.props.model.gridSize);

            return this.setState({
                isError: !zone.geometry,
                zone: zone.toObject()
            });
        });
    };

    render() {
        const {model, readOnly, layer} = this.props;
        const {isError, zone} = this.state;

        return (
            <Modal size={'large'} open onClose={this.props.onCancel} dimmer={'inverted'}>
                <Modal.Header>Edit Location</Modal.Header>
                <Modal.Content>
                    <Grid divided={'vertically'}>
                        <Grid.Row columns={2}>
                            <Grid.Column width={12}>
                                <Segment attached="bottom">
                                    <ZonesMap
                                        model={model}
                                        onCreatePath={this.onCreatePath}
                                        onEditPath={this.onEditPath}
                                        readOnly={readOnly}
                                        zone={SoilmodelZone.fromObject(zone)}
                                        layer={layer}
                                    />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Form.Field>
                                    <label>Name</label>
                                    <Form.Input
                                        type="text"
                                        name="name"
                                        value={zone.name}
                                        placeholder="name ="
                                        onChange={this.onChange}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.onCancel}>Cancel</Button>
                    <Button
                        disabled={isError}
                        positive
                        onClick={() => this.props.onSave(SoilmodelZone.fromObject(this.state.zone))}
                    >
                        Save
                    </Button>
                    <Button
                        negative
                        onClick={() => this.props.onRemove(SoilmodelZone.fromObject(this.state.zone))}
                    >
                        Delete Zone
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

ZoneModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    zone: PropTypes.instanceOf(SoilmodelZone).isRequired,
    layer: PropTypes.instanceOf(SoilmodelLayer).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    readOnly: PropTypes.bool
};

export default ZoneModal;