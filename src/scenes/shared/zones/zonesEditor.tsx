import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {Accordion, Button, Form, Grid, Header, Icon} from 'semantic-ui-react';
import {SoilmodelLayer, SoilmodelZone} from '../../../../../core/model/modflow/soilmodel';
import {RasterDataMap, RasterfileUploadModal} from '../../../../../scenes/shared/rasterData';
import {IGridSize} from '../../../core/model/geometry/GridSize.type';
import {ILayer} from '../../../core/model/zones/Layer.type';
import {IRasterParameter} from '../../../core/model/zones/RasterParameter.type';
import ZoneModal from './zoneModal';
import ZonesTable from './zonesTable';
import {IZone} from '../../../core/model/zones/Zone.type';

interface IProps {
    layer: ILayer;
    gridSize: IGridSize;
    onChange: (layer: ILayer) => any;
    parameter: IRasterParameter;
    readOnly?: boolean;
}

interface ISmoothParameters {
    cycles: number;
    distance: number;
}

const zonesEditor = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [layer, setLayer] = useState<ILayer>(props.layer);
    const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
    const [smoothParams, setSmoothParams] = useState<ISmoothParameters>({cycles: 1, distance: 1});
    const [parameter, setParameter] = useState<IRasterParameter>(props.parameter);
    const [rasterUploadModal, setRasterUploadModal] = useState<boolean>(false);

    useEffect(() => {
        setLayer(props.layer);
        setParameter(props.parameter);
    }, [props.layer, props.parameter]);

    const recalculateMap = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zonesToParameters(this.props.model.gridSize, this.state.parameter.name);
        return props.onChange(layer);
    };

    const smoothMap = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.smoothParameter(this.props.model.gridSize, this.state.parameter.name, this.state.smoothParams.cycles, this.state.smoothParams.distance);
        return this.props.onChange(layer);
    };

    const handleAddZone = () => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = new SoilmodelZone();
        zone.priority = layer.zonesCollection.length;
        this.setState({
            selectedZone: zone.toObject()
        });
    };

    const handleChange = (layer) => {
        layer.zonesToParameters(this.props.model.gridSize, this.state.parameter.name);
        return this.props.onChange(layer);
    };

    const handleChangeSmoothParams = (e, {name, value}) => {
        return this.setState({
            smoothParams: {
                ...this.state.smoothParams,
                [name]: parseInt(value, 10)
            }
        });
    };

    const handleEditZone = (id) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zonesCollection.findById(id);

        this.setState({
            selectedZone: zone.toObject()
        });
    };

    const handleRemoveZone = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zonesCollection.remove(zone.id);

        this.props.onChange(layer);
        return this.setState({
            selectedZone: null
        });
    };

    const handleSaveModal = (zone) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        layer.zonesCollection = layer.zonesCollection.update(zone);
        layer.zonesToParameters(this.props.model.gridSize);
        this.props.onChange(layer);

        return this.setState({
            selectedZone: null
        });
    };

    const handleUploadRaster = (result) => {
        const {parameter} = this.state;
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const base = layer.zonesCollection.findBy('priority', 0, {first: true});
        base[parameter.name].value = cloneDeep(result.data);
        layer.zonesCollection.update(base);
        layer.zonesToParameters(this.props.model.gridSize, parameter.name);
        this.setState({showRasterUploadModal: false});
        return this.props.onChange(layer);
    };

    const handleClickUpload = () => this.setState({showRasterUploadModal: true});

    const handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

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
                <Grid.Row>
                    <Grid.Column>
                        <Accordion>
                            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                                <Icon name="dropdown"/>
                                <label>Smoothing</label>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                <Form.Group>
                                    <Form.Input
                                        label="Cycles"
                                        type="number"
                                        name="cycles"
                                        value={this.state.smoothParams.cycles}
                                        placeholder="cycles="
                                        onChange={this.onChangeSmoothParams}
                                        width={5}
                                        readOnly={this.props.readOnly}
                                    />
                                    <Form.Input
                                        label="Distance"
                                        type="number"
                                        name="distance"
                                        value={this.state.smoothParams.distance}
                                        placeholder="distance ="
                                        onChange={this.onChangeSmoothParams}
                                        width={5}
                                        readOnly={this.props.readOnly}
                                    />
                                    <Form.Button fluid={true}
                                                 icon="tint"
                                                 labelPosition="left"
                                                 onClick={this.smoothMap}
                                                 content={'Start Smoothing'}
                                                 width={8}
                                                 style={{marginTop: '23px'}}
                                                 disabled={this.props.readOnly}
                                    />
                                    <Form.Button fluid={true}
                                                 icon="trash"
                                                 labelPosition="left"
                                                 onClick={this.recalculateMap}
                                                 content={'Remove Smoothing'}
                                                 width={8}
                                                 style={{marginTop: '23px'}}
                                                 disabled={this.props.readOnly}
                                    />
                                </Form.Group>
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button icon={true} primary={true}
                                onClick={this.onAddZone}
                                disabled={this.props.readOnly}
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
};

export default (zonesEditor);
