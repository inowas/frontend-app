import React from 'react';
import PropTypes from 'prop-types';
import {SoilmodelLayer, SoilmodelZone} from 'core/model/modflow/soilmodel';
import {Accordion, Button, Form, Grid, Header, Icon} from 'semantic-ui-react';
import {ModflowModel} from 'core/model/modflow';
import ZoneModal from './zoneModal';
import ZonesTable from './zonesTable';
import {RasterDataMap, RasterfileUploadModal} from 'scenes/shared/rasterData';
import {cloneDeep} from 'lodash';

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
            parameter: props.parameter,
            showRasterUploadModal: false
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
        return this.props.onChange(layer);
    };

    smoothMap = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.smoothParameter(this.props.model.gridSize, this.state.parameter.name, this.state.smoothParams.cycles, this.state.smoothParams.distance);
        return this.props.onChange(layer);
    };

    onAddZone = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = new SoilmodelZone();
        zone.priority = layer.zonesCollection.length;
        this.setState({
            selectedZone: zone.toObject()
        });
    };

    onChange = layer => {
        layer.zonesToParameters(this.props.model.gridSize, this.state.parameter.name);
        return this.props.onChange(layer);
    };

    onChangeSmoothParams = (e, {name, value}) => {
        return this.setState({
            smoothParams: {
                ...this.state.smoothParams,
                [name]: parseInt(value, 10)
            }
        })
    };

    onEditZone = (id) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zonesCollection.findById(id);

        this.setState({
            selectedZone: zone.toObject()
        });
    };

    onRemoveZone = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zonesCollection.remove(zone.id);

        this.props.onChange(layer);
        return this.setState({
            selectedZone: null
        });
    };

    onSaveModal = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zonesCollection = layer.zonesCollection.update(zone);
        layer.zonesToParameters(this.props.model.gridSize);
        this.props.onChange(layer);

        return this.setState({
            selectedZone: null
        });
    };

    onUploadRaster = (result) => {
        const {parameter} = this.state;
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const base = layer.zonesCollection.findBy('priority', 0, {first: true});
        base[parameter.name].value = cloneDeep(result.data);
        layer.zonesCollection.update(base);
        layer.zonesToParameters(this.props.model.gridSize, parameter.name);
        this.setState({showRasterUploadModal: false});
        return this.props.onChange(layer);
    };

    onClickUpload = () => this.setState({showRasterUploadModal: true});

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

    render() {
        const {model, readOnly} = this.props;
        const {parameter, selectedZone, showRasterUploadModal} = this.state;
        const layer = this.state.layer;
        const {activeIndex} = this.state;

        return (
            <div>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h4">{parameter.description}, {parameter.name} [{parameter.unit}]</Header>
                                <RasterDataMap
                                    data={layer[parameter.name]}
                                    model={model}
                                    unit={parameter.unit}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row >
                            <Grid.Column>
                                <Accordion>
                                    <Accordion.Title active={activeIndex === 1} index ={1} onClick={this.handleClick}>
                                        <Icon name='dropdown' />
                                        <label>Smoothing</label>
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 1}>
                                        <Form.Group>
                                            <Form.Input
                                                label='Cycles'
                                                type="number"
                                                name="cycles"
                                                value={this.state.smoothParams.cycles}
                                                placeholder="cycles="
                                                onChange={this.onChangeSmoothParams}
                                                width={5}
                                            />
                                            <Form.Input
                                                label='Distance'
                                                type="number"
                                                name="distance"
                                                value={this.state.smoothParams.distance}
                                                placeholder="distance ="
                                                onChange={this.onChangeSmoothParams}
                                                width={5}
                                            />
                                            <Form.Button fluid
                                                icon='tint'
                                                labelPosition='left'
                                                onClick={this.smoothMap}
                                                content={'Start Smoothing'}
                                                width={8}
                                                style={{marginTop: '23px'}}
                                            />
                                            <Form.Button fluid
                                                icon='trash'
                                                labelPosition='left'
                                                onClick={this.recalculateMap}
                                                content={'Remove Smoothing'}
                                                width={8}
                                                style={{marginTop: '23px'}}
                                             />
                                        </Form.Group>
                                    </Accordion.Content>
                                </Accordion>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Button icon primary
                                        onClick={this.onAddZone}
                                >
                                    <Icon name="add"/> Add Zone
                                </Button>
                                <ZonesTable
                                    onClickUpload={this.onClickUpload}
                                    onChange={this.onChange}
                                    onEdit={this.onEditZone}
                                    parameter={parameter}
                                    readOnly={readOnly}
                                    layer={SoilmodelLayer.fromObject(layer)}
                                />

                                {selectedZone &&
                                <ZoneModal
                                    onCancel={() => this.setState({selectedZone: null})}
                                    onRemove={this.onRemoveZone}
                                    onSave={this.onSaveModal}
                                    zone={SoilmodelZone.fromObject(selectedZone)}
                                    layer={SoilmodelLayer.fromObject(layer)}
                                    model={model}
                                    readOnly={readOnly}
                                />}
                                {showRasterUploadModal &&
                                <RasterfileUploadModal
                                    gridSize={model.gridSize}
                                    parameter={parameter}
                                    onCancel={() => this.setState({showRasterUploadModal: false})}
                                    onChange={this.onUploadRaster}
                                />
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>


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