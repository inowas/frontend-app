import React from 'react';
import PropTypes from 'prop-types';
import {SoilmodelLayer, SoilmodelZone} from 'core/model/modflow/soilmodel';
import {Accordion, Button, Form, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import {ModflowModel} from 'core/model/modflow';
import ZoneModal from './zoneModal';
import ZonesTable from './zonesTable';
import {RasterData, RasterDataMap} from 'services/geoTools/components/rasterData';

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

    recalculateMap = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zonesToParameters(this.props.model.gridSize, this.state.parameter.name);
        this.onChange(layer);

        return this.setState({
            layer: layer.toObject()
        });
    };

    smoothMap = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.smoothParameter(this.props.model.gridSize, this.state.parameter.name, this.state.smoothParams.cycles, this.state.smoothParams.distance);

        return this.onChange(layer);
    };

    onAddZone = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = new SoilmodelZone();
        zone.priority = layer.zones.length;
        this.setState({
            selectedZone: zone.toObject()
        });
    };

    onCancelModal = () => this.setState({selectedZone: null});

    onChange = layer => this.props.onChange(layer);

    onUploadRaster = (e, value) => {
        console.log('ON UPLOAD RASTER', value);
    };

    onChangeSmoothParams = (e, {name, value}) => {
        return this.setState({
            smoothParams: {
                ...this.state.smoothParams,
                [name]: parseInt(value, 10)
            }
        })
    };

    onClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

    onEditZone = (id) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zones.findById(id);

        this.setState({
            selectedZone: zone.toObject()
        });
    };

    onRemoveZone = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zones.remove(zone.id);

        this.props.onChange(layer);
        return this.setState({
            selectedZone: null
        });
    };

    onSaveModal = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zones = layer.zones.update(zone);

        this.props.onChange(layer);

        return this.setState({
            selectedZone: null
        });
    };

    onSelectMode = (e, {name, value}) => {
        this.setState({
            mode: value
        });
    };

    render() {
        const {model, readOnly} = this.props;
        const {parameter, mode, selectedZone} = this.state;
        const layer = this.state.layer;

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
                        style={{zIndex: 1001}}
                    />
                </Form.Field>
                {this.state.mode === 'import' &&
                <Segment>
                    <RasterData
                        model={model}
                        name={parameter.name}
                        unit={parameter.unit}
                        data={layer[parameter.name]}
                        readOnly={readOnly}
                        onChange={this.onUploadRaster}
                    />
                </Segment>
                }
                {mode !== 'import' &&
                <Segment>
                    <Header as="h4">{parameter.description}, {parameter.name} [{parameter.unit}]</Header>
                    <Grid divided>
                        <Grid.Column width={8}>
                            <RasterDataMap
                                data={layer[parameter.name]}
                                model={model}
                                unit={null}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Accordion fluid>
                                <Accordion.Title active={this.state.activeIndex === 0} index={0}
                                                 onClick={this.onClickAccordion}>
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
                                <Accordion.Title active={this.state.activeIndex === 1} index={1}
                                                 onClick={this.onClickAccordion}>
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
                        onChange={this.onChange}
                        onEdit={this.onEditZone}
                        parameter={parameter.name}
                        readOnly={readOnly}
                        layer={SoilmodelLayer.fromObject(layer)}
                    />
                </Segment>
                }
                {selectedZone &&
                <ZoneModal
                    onCancel={this.onCancelModal}
                    onRemove={this.onRemoveZone}
                    onSave={this.onSaveModal}
                    zone={SoilmodelZone.fromObject(selectedZone)}
                    layer={SoilmodelLayer.fromObject(layer)}
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