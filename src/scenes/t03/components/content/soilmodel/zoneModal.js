import React from 'react';
import {Button, Form, Grid, Modal, Segment} from 'semantic-ui-react';
import ZonesMap from '../../maps/zonesMap';
import PropTypes from 'prop-types';
import {SoilmodelZone, ZonesCollection} from 'core/model/modflow/soilmodel';
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
        const geoJson = e.layer.toGeoJSON();
        const zone = this.state.zone;

        zone.geometry = Geometry.fromGeoJson(geoJson.geometry);
        zone.activeCells = calculateActiveCells(zone.geometry, this.props.model.boundingBox, this.props.model.gridSize);

        return this.setState({
            isError: !zone.geometry,
            zone: zone
        });
    };

    onEditPath = e => {
        const layers = e.layers;

        layers.eachLayer(layer => {
            const geoJson = layer.toGeoJSON();
            const zone = this.state.zone;

            zone.geometry = Geometry.fromGeoJson(geoJson.geometry);
            zone.activeCells = calculateActiveCells(zone.geometry, this.props.model.boundingBox, this.props.model.gridSize);

            return this.setState({
                isError: !zone.geometry,
                zone: zone
            });
        });
    };

    render() {
        const {model, readOnly, zones} = this.props;
        const {isError, zone} = this.state;

        console.log('STATE', this.state);

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
                                        zones={zones}
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
                                <Form.Field>
                                    <label>top</label>
                                    <Form.Input
                                        type="number"
                                        name="top"
                                        value={zone.top || zone.top === 0 ? zone.top : ''}
                                        placeholder="top"
                                        onChange={this.onChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>botm</label>
                                    <Form.Input
                                        type="number"
                                        name="botm"
                                        value={zone.botm || zone.botm === 0 ? zone.botm : ''}
                                        placeholder="botm ="
                                        onChange={this.onChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>hk</label>
                                    <Form.Input
                                        type="number"
                                        name="hk"
                                        value={zone.hk || zone.hk === 0 ? zone.hk : ''}
                                        placeholder="hk ="
                                        onChange={this.onChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>hani</label>
                                    <Form.Input
                                        type="number"
                                        name="hani"
                                        value={zone.hani || zone.hani === 0 ? zone.hani : ''}
                                        placeholder="hani ="
                                        onChange={this.onChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>vka</label>
                                    <Form.Input
                                        type="number"
                                        name="vka"
                                        value={zone.vka || zone.vka === 0 ? zone.vka : ''}
                                        placeholder="vka ="
                                        onChange={this.onChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>ss</label>
                                    <Form.Input
                                        type="number"
                                        name="ss"
                                        value={zone.ss || zone.ss === 0 ? zone.ss : ''}
                                        placeholder="ss ="
                                        onChange={this.onChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>sy</label>
                                    <Form.Input
                                        type="number"
                                        name="sy"
                                        value={zone.sy || zone.sy === 0 ? zone.sy : ''}
                                        placeholder="sy ="
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
    zones: PropTypes.instanceOf(ZonesCollection),
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    readOnly: PropTypes.bool
};

export default ZoneModal;