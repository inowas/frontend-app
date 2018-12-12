import React from 'react';
import PropTypes from 'prop-types';
import {SoilmodelLayer, SoilmodelZone} from 'core/model/modflow/soilmodel';
import {Accordion, Button, Form, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import {ModflowModel} from 'core/model/modflow';
import RasterDataMap from '../../maps/rasterDataMap';
import ZoneModal from './zoneModal';
import ZonesTable from './zonesTable';

class LayerParameter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            layer: props.layer.toObject(),
            selectedZone: null,
            smoothParams: {
                cycles: 1,
                distance: 1
            },
            mode: 'zones',
            parameter: props.parameter
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            layer: nextProps.layer.toObject(),
            parameter: nextProps.parameter
        }));
    }

    handleClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

    onAddZone = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = new SoilmodelZone();
        zone.priority = layer.zones.length;
        this.setState({
            selectedZone: zone.toObject()
        });
    };

    onEditZone = (id) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zones.findById(id);

        this.setState({
            selectedZone: zone
        });
    };

    onSelectMode = (e, {name, value}) => {
        this.setState({
            mode: value
        });
    };

    onChangeZoneParameter = (e, {name, value}) => {

    };

    onChangeSmoothParams = (e, {name, value}) => {
        return this.setState({
            smoothParams: {
                ...this.state.smoothParams,
                [name]: parseInt(value, 10)
            }
        })
    };

    onRemoveZone = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer).zones.remove(zone.id);

        console.log('LAYEEEER', layer);

        this.setState({
            selectedZone: null,
            showOverlay: false
        });
        this.props.onChange(layer);
    };

    onChange = e => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);

        e.forEach(row => {
            const zone = layer.zones.findById(row.id);
            if (zone && zone[this.state.parameter.name] !== row.value) {
                zone[this.state.parameter.name] = row.value;
                layer.zones.update(zone);
            }
        });

        this.props.onChange(layer);
    };

    onOrderZones = (id, order) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);

        console.log('ORDERZONES', layer, id);

        const zone = layer.zones.findById(id);
        layer.zones = layer.zones.changeOrder(zone, order);

        if (zone) {
            this.props.onChange(layer);
        }
    };

    smoothMap = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.smoothParameter(this.props.model.gridSize, this.state.parameter.name, this.state.smoothParams.cycles, this.state.smoothParams.distance);

        return this.props.onChange(layer);
    };

    recalculateMap = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zonesToParameters(this.props.model.gridSize, this.state.parameter.name);
        this.props.onChange(layer);

        this.setState({
            layer: layer.toObject()
        });
    };

    onRemoveFromTable = id => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zones.findById(id);
        zone[this.state.parameter.name] = null;

        layer.zones.update(zone);

        this.props.onChange(layer);
    };

    onSaveModal = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zones = layer.zones.update(zone);

        console.log('UPDATED LAYER', layer);

        this.props.onChange(layer);

        return this.setState({
            selectedZone: null
        });
    };

    onCancelModal = () => {
        return this.setState({
            selectedZone: null,
            showOverlay: false
        });
    };

    render() {
        const {model, readOnly} = this.props;
        const {parameter, mode, selectedZone} = this.state;
        const layer = SoilmodelLayer.fromObject(this.state.layer);

        return (
            <div>
                <Form.Field>
                    <label>Method of parameter definition</label>
                    <Form.Select
                        name="mode"
                        value={mode}
                        placeholder="mode ="
                        onChange={this.onSelectMode}
                        options={[
                            {
                                key: 'zones',
                                value: 'zones',
                                text: 'Set default value and define zones'
                            },
                            {
                                key: 'import',
                                value: 'import',
                                text: 'Import raster file'
                            }
                        ]}
                    />
                </Form.Field>
                {this.state.mode === 'import' &&
                <Segment>

                </Segment>
                }
                {mode !== 'import' &&
                <Segment>
                    <Header as="h4">{parameter.description}, {parameter.name} [{parameter.unit}]</Header>
                    <Grid divided>
                        <Grid.Column width={8}>
                            {false &&
                            <RasterDataMap
                                data={layer[parameter.name]}
                                model={model}
                                unit={null}/>
                            }
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Accordion fluid>
                                <Accordion.Title active={this.state.activeIndex === 0} index={0}
                                                 onClick={this.handleClickAccordion}>
                                    <Icon name="dropdown"/>
                                    Calculation
                                </Accordion.Title>
                                <Accordion.Content active={this.state.activeIndex === 0}>
                                    <Button
                                        icon
                                        primary
                                        fluid
                                        onClick={this.recalculateMap}
                                    >
                                        <Icon name="map"/> Recalculate Map
                                    </Button>
                                </Accordion.Content>
                                <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleClickAccordion}>
                                    <Icon name="dropdown"/>
                                    Smoothing
                                </Accordion.Title>
                                <Accordion.Content active={this.state.activeIndex === 1}>
                                    <Form.Field>
                                        <label>Cycles</label>
                                        <Form.Input
                                            type="number"
                                            name="cycles"
                                            value={this.state.smoothParams.cycles}
                                            placeholder="cycles ="
                                            onChange={this.onChangeSmoothParams}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Distance</label>
                                        <Form.Input
                                            type="number"
                                            name="distance"
                                            value={this.state.smoothParams.distance}
                                            placeholder="distance ="
                                            onChange={this.onChangeSmoothParams}
                                        />
                                    </Form.Field>
                                    <Button
                                        icon
                                        fluid
                                        onClick={this.smoothMap}
                                    >
                                        <Icon name="tint"/> Start Smoothing
                                    </Button>
                                </Accordion.Content>
                            </Accordion>
                        </Grid.Column>
                    </Grid>
                </Segment>
                }
                {mode === 'zones' &&
                <Segment>
                    <Form.Group>
                        <Button
                            icon
                            fluid
                            onClick={this.onAddZone}
                        >
                            <Icon name="add circle"/> Add new zone
                        </Button>
                    </Form.Group>
                    <ZonesTable
                        onChange={this.onChangeZoneParameter}
                        onEdit={this.onEditZone}
                        onReorder={this.onOrderZones}
                        onRemove={this.onRemoveFromTable}
                        parameter={parameter.name}
                        readOnly={readOnly}
                        zones={layer.zones}
                    />
                </Segment>
                }
                {selectedZone &&
                <ZoneModal
                    onCancel={this.onCancelModal}
                    onRemove={this.onRemoveZone}
                    onSave={this.onSaveModal}
                    zone={SoilmodelZone.fromObject(selectedZone)}
                    zones={layer.zones}
                    model={model}
                    readOnly={readOnly}
                />
                }
            </div>
        );
    }
}

LayerParameter.propTypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    parameter: PropTypes.object.isRequired,
    layer: PropTypes.instanceOf(SoilmodelLayer)
};

export default (LayerParameter);