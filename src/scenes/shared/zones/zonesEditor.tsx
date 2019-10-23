import React, {ChangeEvent, MouseEvent, useState} from 'react';
import {Accordion, AccordionTitleProps, Form, Grid, Header, Icon, InputOnChangeData} from 'semantic-ui-react';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import GridSize from '../../../core/model/geometry/GridSize';
import {ZonesCollection} from '../../../core/model/gis';
import Layer from '../../../core/model/gis/Layer';
import {ILayerParameterZone} from '../../../core/model/gis/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../../core/model/gis/LayerParameterZonesCollection';
import RasterParameter from '../../../core/model/gis/RasterParameter';
import {IRasterFileMetadata} from '../../../services/api/types';
import {RasterDataMap} from '../rasterData';
import RasterfileUploadModal from '../rasterData/rasterfileUploadModal';
import ZonesTable from './zonesTable';

interface IUploadData {
    data: Array2D<number>;
    metadata: IRasterFileMetadata | null;
}

interface IProps {
    boundingBox: BoundingBox;
    layer: Layer;
    gridSize: GridSize;
    onAddRelation: (relation: ILayerParameterZone, parameterId?: string) => any;
    onChange: (relations: LayerParameterZonesCollection, parameterId?: string) => any;
    onRemoveRelation: (relation: ILayerParameterZone, parameterId?: string) => any;
    onSmoothLayer: (params: ISmoothParametersWithId) => any;
    parameter: RasterParameter;
    relations: LayerParameterZonesCollection;
    readOnly: boolean;
    zones: ZonesCollection;
}

interface ISmoothParameters {
    cycles: number;
    distance: number;
}

interface ISmoothParametersWithId {
    cycles: number;
    distance: number;
    parameterId: string;
}

const zonesEditor = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [smoothParams, setSmoothParams] = useState<ISmoothParameters>({cycles: 1, distance: 1});
    const [rasterUploadModal, setRasterUploadModal] = useState<boolean>(false);

    const recalculateMap = () => props.onChange(props.relations, props.parameter.id);

    const smoothMap = () => props.onSmoothLayer({
        ...smoothParams,
        parameterId: props.parameter.id
    });

    const handleAddRelation = (relation: ILayerParameterZone) => props.onAddRelation(relation, props.parameter.id);

    const handleChangeRelation = (relations: LayerParameterZonesCollection) =>
        props.onChange(relations, props.parameter.id);

    const handleChangeSmoothParams = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        const cSmoothParams = {
            ...smoothParams,
            [name]: parseInt(value, 10)
        };

        return setSmoothParams(cSmoothParams);
    };

    const handleRemoveRelation = (relation: ILayerParameterZone) =>
        props.onRemoveRelation(relation, props.parameter.id);

    const handleUploadRaster = (result: IUploadData) => {
        const cRelations = props.relations.all.map((r) => {
            if (r.priority === 0) {
                r.value = result.data;
            }
            return r;
        });
        setRasterUploadModal(false);
        props.onChange(LayerParameterZonesCollection.fromObject(cRelations), props.parameter.id);
    };

    const handleCancelUploadModal = () => setRasterUploadModal(false);

    const handleClickUpload = () => setRasterUploadModal(true);

    const handleClick = (e: MouseEvent, titleProps: AccordionTitleProps) => {
        const {index} = titleProps;
        if (index) {
            const newIndex = activeIndex === index ? -1 : index;
            return setActiveIndex(typeof newIndex === 'string' ? parseInt(newIndex, 10) : newIndex);
        }
    };

    const rParameter = props.layer.parameters.filter((p) => p.id === props.parameter.id);

    return (
        <div>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h4">{props.parameter.title}, {props.parameter.id} [{props.parameter.unit}]</Header>
                        {rParameter.length > 0 &&
                            <RasterDataMap
                                boundingBox={props.boundingBox}
                                data={rParameter[0].value}
                                gridSize={props.gridSize}
                                unit={props.parameter.unit}
                            />
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Accordion styled={true} fluid={true}>
                            <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
                                <Icon name="dropdown"/>
                                <label>Smoothing</label>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                <Form.Group>
                                    <Form.Input
                                        label="Cycles"
                                        type="number"
                                        name="cycles"
                                        value={smoothParams.cycles}
                                        placeholder="cycles="
                                        onChange={handleChangeSmoothParams}
                                        width={4}
                                        readOnly={props.readOnly}
                                    />
                                    <Form.Input
                                        label="Distance"
                                        type="number"
                                        name="distance"
                                        value={smoothParams.distance}
                                        placeholder="distance ="
                                        onChange={handleChangeSmoothParams}
                                        width={4}
                                        readOnly={props.readOnly}
                                    />
                                    <Form.Button
                                        fluid={true}
                                        icon="tint"
                                        labelPosition="left"
                                        onClick={smoothMap}
                                        content={'Start Smoothing'}
                                        width={8}
                                        style={{marginTop: '23px'}}
                                        disabled={props.readOnly}
                                    />
                                    <Form.Button
                                        fluid={true}
                                        icon="trash"
                                        labelPosition="left"
                                        onClick={recalculateMap}
                                        content={'Remove Smoothing'}
                                        width={9}
                                        style={{marginTop: '23px'}}
                                        disabled={props.readOnly}
                                    />
                                </Form.Group>
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <ZonesTable
                            onAddRelation={handleAddRelation}
                            onClickUpload={handleClickUpload}
                            onChange={handleChangeRelation}
                            onRemoveRelation={handleRemoveRelation}
                            parameter={props.parameter}
                            readOnly={props.readOnly}
                            zones={props.zones}
                            relations={props.relations}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {rasterUploadModal && !props.readOnly &&
            <RasterfileUploadModal
                gridSize={props.gridSize}
                parameter={props.parameter}
                onCancel={handleCancelUploadModal}
                onChange={handleUploadRaster}
            />
            }
        </div>
    );
};

export default (zonesEditor);
