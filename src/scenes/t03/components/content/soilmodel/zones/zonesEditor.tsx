import {
  Accordion,
  AccordionTitleProps, Button,
  Form,
  Header,
  Icon,
  InputOnChangeData,
  Loader
} from 'semantic-ui-react';
import {Array2D} from '../../../../../../core/model/geometry/Array2D.type';
import {ICell} from '../../../../../../core/model/geometry/Cells.type';
import {ILayerParameterZone} from '../../../../../../core/model/modflow/soilmodel/LayerParameterZone.type';
import {IRasterFileMetadata} from '../../../../../../services/api/types';
import {
  LayerParameterZonesCollection,
  RasterParameter,
  ZonesCollection
} from '../../../../../../core/model/modflow/soilmodel';
import {ModflowModel} from '../../../../../../core/model/modflow';
import {RasterDataMap, RasterfileUploadModal} from '../../../../../shared/rasterData';
import {getActiveCellFromCoordinate} from '../../../../../../services/geoTools';
import {rasterDownload} from '../../../../../shared/rasterData/helpers';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import CellAnalyzer, {CellAnalyzerParameters} from '../../../../../shared/rasterData/CellAnalyzer';
import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import SoilmodelLayer from '../../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import ZonesTable from './zonesTable';
import uuid from 'uuid';
import {distinct} from '../../../../../modflow/defaults/colorScales';
import {GeoJson} from '../../../../../../core/model/geometry/Geometry.type';

interface IUploadData {
  data: Array2D<number>;
  metadata: IRasterFileMetadata | null;
}

interface IProps {
  boundaries?: BoundaryCollection;
  layer: SoilmodelLayer;
  model: ModflowModel;
  onAddRelation: (relation: ILayerParameterZone, parameterId?: string) => any;
  onChange: (relations: LayerParameterZonesCollection, parameterId?: string) => any;
  onRemoveRelation: (relation: ILayerParameterZone, parameterId?: string) => any;
  onSmoothLayer: (params: ISmoothParametersWithId) => any;
  parameter: RasterParameter;
  readOnly: boolean;
  showHeadline?: boolean;
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

interface ICellInformation {
  latlng: [number, number];
  cell: ICell;
  parameters: CellAnalyzerParameters;
}

interface IActiveZone {
  color: string;
  geometry: GeoJson;
  name: string;
}

const ZonesEditor = (props: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeZones, setActiveZones] = useState<IActiveZone[]>([]);
  const [cellInfo, setCellInfo] = useState<ICellInformation | null>(null);
  const [smoothParams, setSmoothParams] = useState<ISmoothParameters>({cycles: 1, distance: 1});
  const [rasterUploadModal, setRasterUploadModal] = useState<boolean>(false);
  const [rerenderKey, setRerenderKey] = useState<string>(uuid.v4());

  const relations = props.layer.getRelationsByParameter(props.parameter.id);

  useEffect(() => {
    const az: IActiveZone[] = [];
    props.zones.all.forEach((z, k) => {
      const relation = relations.filterBy('zoneId', z.id);
      if (relation.length > 0 && relation[0].priority !== 0) {
        az.push({
          color: k < distinct.length ? distinct[k] : distinct[0],
          geometry: z.geometry as GeoJson,
          name: z.name
        });
      }
    });

    setActiveZones(az);
    setRerenderKey(uuid.v4());
  }, [props.layer]);

  const recalculateMap = () => props.onChange(relations, props.parameter.id);

  const smoothMap = () => props.onSmoothLayer({
    ...smoothParams,
    parameterId: props.parameter.id
  });

  const handleAddRelation = (relation: ILayerParameterZone) => props.onAddRelation(relation, props.parameter.id);

  const handleChangeRelation = (cRelations: LayerParameterZonesCollection) =>
    props.onChange(cRelations, props.parameter.id);

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
    const cRelations = relations.all.map((r) => {
      if (r.priority === 0) {
        r.value = result.data;
      }
      return r;
    });
    setRasterUploadModal(false);
    props.onChange(LayerParameterZonesCollection.fromObject(cRelations), props.parameter.id);
  };

  const handleClickCell = (latlng: [number, number]) => {
    const cell = getActiveCellFromCoordinate(latlng, props.model.boundingBox, props.model.gridSize);
    if (
      cell[0] < 0 || cell[0] > (props.model.gridSize.nX - 1) || cell[1] < 0 || cell[1] > (props.model.gridSize.nY - 1)
    ) {
      setCellInfo(null);
      return;
    }

    const params = props.layer.parameters.map((p) => {
      const value = props.layer.getValueOfParameter(p.id);
      if (typeof value === 'number') {
        return {name: p.id, value};
      }
      if (Array.isArray(value) && value.length >= cell[1] && value[cell[1]].length >= cell[0]) {
        return {name: p.id, value: value[cell[1]][cell[0]]}
      }
      return {name: p.id, value: NaN};
    })

    setCellInfo({latlng, cell, parameters: params});
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

  const handleDismiss = () => setCellInfo(null);

  const renderRasterDownload = () => {
    const rParameter = props.layer.parameters.filter((p) => p.id === props.parameter.id);
    const data = (rParameter[0].value === null || rParameter[0].value === undefined) &&
    rParameter[0].data.file ? rParameter[0].data.data : rParameter[0].value;

    if (data === null || !Array.isArray(data) || data === undefined) {
      return;
    }

    const handleDownload = () => {
      rasterDownload(data, props.model.boundingBox, props.model.gridSize);
    }

    return (
      <React.Fragment>
        <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClick}>
          <Icon name="dropdown"/> Export
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Button
            fluid={true}
            primary={true}
            icon={true}
            labelPosition="left"
            onClick={handleDownload}
          >
            <Icon name="download"/>
            Download Raster
          </Button>
        </Accordion.Content>
      </React.Fragment>
    );
  };

  const renderMap = () => {
    const rParameter = props.layer.parameters.filter((p) => p.id === props.parameter.id);

    if (rParameter.length === 0) {
      return <Loader active={true} inline="centered"/>;
    }

    const data = (rParameter[0].value === null || rParameter[0].value === undefined) &&
    rParameter[0].data.file ? rParameter[0].data.data : rParameter[0].value;

    if (data === null || data === undefined) {
      return <Loader active={true} inline="centered"/>;
    }

    return (
      <CellAnalyzer
        cell={cellInfo ? cellInfo.cell : undefined}
        latlng={cellInfo ? cellInfo.latlng : undefined}
        onDismiss={handleDismiss}
        open={cellInfo !== null}
        parameters={cellInfo ? cellInfo.parameters : undefined}
      >
        <RasterDataMap
          key={rerenderKey}
          model={props.model}
          boundaries={props.boundaries}
          data={data as Array2D<number> | number}
          onClickCell={handleClickCell}
          unit={props.parameter.unit}
          zones={activeZones}
        />
      </CellAnalyzer>
    );
  };

  return (
    <div>
      {props.showHeadline &&
      <Header as="h4">
        {props.parameter.title}, {props.parameter.id} [{props.parameter.unit}]
      </Header>
      }
      {renderMap()}
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
        {renderRasterDownload()}
      </Accordion>
      <ZonesTable
        onAddRelation={handleAddRelation}
        onClickUpload={handleClickUpload}
        onChange={handleChangeRelation}
        onRemoveRelation={handleRemoveRelation}
        parameter={props.parameter}
        readOnly={props.readOnly}
        zones={props.zones}
        relations={relations}
      />
      {rasterUploadModal && !props.readOnly &&
      <RasterfileUploadModal
        gridSize={props.model.gridSize}
        parameter={props.parameter}
        onCancel={handleCancelUploadModal}
        onChange={handleUploadRaster}
      />
      }
    </div>
  );
};

export default (ZonesEditor);
