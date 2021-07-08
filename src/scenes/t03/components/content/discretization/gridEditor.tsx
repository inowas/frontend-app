import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {BoundingBox, Cells, Geometry, GridSize, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {CALCULATE_CELLS_INPUT} from '../../../../modflow/worker/t03.worker';
import {Dimmer, Form, Grid, Header, Progress} from 'semantic-ui-react';
import {DiscretizationMap, GridProperties} from './index';
import {ICalculateCellsInputData} from '../../../../modflow/worker/t03.worker.type';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {IRootReducer} from '../../../../../reducers';
import {addMessage, updateBoundaries, updateLayer, updateSoilmodel} from '../../../actions/actions';
import {asyncWorker} from '../../../../modflow/worker/worker';
import {boundaryUpdater, layersUpdater, zonesUpdater} from './updater';
import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import {messageError} from '../../../defaults/messages';
import {useDispatch, useSelector} from 'react-redux';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import React, {useEffect, useRef, useState} from 'react';
import UploadGeoJSONModal from '../create/UploadGeoJSONModal';
import _ from 'lodash';

interface IProps {
  model: ModflowModel;
  onChange: (modflowModel: ModflowModel) => void;
  onSave: () => void;
  onUndo: () => void;
}

interface IBoundaryUpdaterStatus {
  task: number;
  message: string;
}

const GridEditor = (props: IProps) => {
  const [gridSizeLocal, setGridSizeLocal] = useState<GridSize | null>(null);
  const [updaterStatus, setUpdaterStatus] = useState<IBoundaryUpdaterStatus | null>(null);

  const intersectionRef = useRef<number>();

  const dispatch = useDispatch();

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const boundaryCollection = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
  const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

  useEffect(() => {
    setGridSizeLocal(props.model.gridSize);
    intersectionRef.current = 50;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gridSizeLocal && (gridSizeLocal.nX !== gridSize.nX || gridSizeLocal.nY !== gridSize.nY)) {
      setGridSizeLocal(props.model.gridSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.model.gridSize.nX, props.model.gridSize.nY]);

  if (!soilmodel || !boundaryCollection) {
    return null;
  }

  const readOnly = props.model.readOnly;

  const update = (model: ModflowModel) => {
    if (!boundaryCollection) {
      return null;
    }
    boundaryUpdater(
      _.cloneDeep(boundaryCollection),
      model,
      (b, l) => setUpdaterStatus({
        task: 1 + boundaryCollection.length - l,
        message: `Updating ${b.name}`
      }),
      (bc) => {
        dispatch(updateBoundaries(bc));
        if (soilmodel.zonesCollection.length > 1) {
          zonesUpdater(
            model,
            soilmodel,
            soilmodel.zonesCollection,
            (z, l) => setUpdaterStatus({
              task: 1 + boundaryCollection.length + soilmodel.zonesCollection.length - l,
              message: `Updating ${z.name}`
            }),
            (zc) => {
              soilmodel.zonesCollection = zc;
              dispatch(updateSoilmodel(soilmodel));
              layersUpdater(
                model,
                soilmodel.layersCollection,
                zc,
                (layer, l) => {
                  dispatch(updateLayer(layer));
                  setUpdaterStatus({
                    task: 1 + boundaryCollection.length + soilmodel.zonesCollection.length +
                      soilmodel.layersCollection.length - l,
                    message: `Updating ${layer.name}`
                  });
                },
                () => {
                  setUpdaterStatus(null);
                },
                (e) => dispatch(addMessage(messageError('layersUpdater', e)))
              );
            },
            (e) => dispatch(addMessage(messageError('zonesUpdater', e)))
          );
        } else {
          setUpdaterStatus(null);
        }
      },
      (e) => dispatch(addMessage(messageError('boundariesUpdater', e)))
    );
  };

  const handleChangeCells = (c: Cells) => {
    const model = props.model.getClone();
    model.cells = c;
    props.onChange(model);
  };

  const handleChangeGeometry = (g: Geometry) => {
    const rotation = props.model.rotation;
    let geometryWithRotation: null | Geometry = null;
    let bb: BoundingBox = BoundingBox.fromGeoJson(g);
    if (rotation % 360 !== 0) {
      geometryWithRotation = Geometry.fromGeoJson(g.toGeoJSONWithRotation(rotation, g.centerOfMass));
      bb = BoundingBox.fromGeometryAndRotation(g, rotation);
    }

    asyncWorker({
      type: CALCULATE_CELLS_INPUT,
      data: {
        geometry: geometryWithRotation ? geometryWithRotation.toObject() : g.toObject(),
        boundingBox: bb.toObject(),
        gridSize: props.model.gridSize.toObject(),
        intersection: props.model.intersection
      } as ICalculateCellsInputData
    }).then((c: ICells) => {
      const model = props.model.getClone();
      model.cells = Cells.fromObject(c);
      model.geometry = Geometry.fromObject(g.toObject());
      model.boundingBox = BoundingBox.fromObject(bb.toObject());
      update(model);
      return props.onChange(model);
    }).catch(() => {
      dispatch(addMessage(messageError('discretization', 'Calculating cells failed.')));
    });
  };

  const handleChangeGridSize = (g: GridSize) => {
    const model = props.model.getClone();
    model.gridSize = g;
    update(model);
    return props.onChange(model);
  }

  const handleChangeRotation = (g: GridSize, i: number, r: number, c: Cells) => {
    const model = props.model.getClone();
    model.boundingBox = r % 360 !== 0 ? BoundingBox.fromGeometryAndRotation(model.geometry, r) :
      BoundingBox.fromGeoJson(model.geometry.toGeoJSON());
    model.cells = c;
    model.gridSize = g;
    model.intersection = i;
    model.rotation = r;
    update(model);
    return props.onChange(model);
  };

  if (!gridSizeLocal) {
    return null;
  }

  const {boundingBox, geometry, gridSize} = props.model;

  const tasks = boundaryCollection.length + soilmodel.zonesCollection.length + soilmodel.layersCollection.length;

  return (
    <Grid>
      {!!updaterStatus &&
      <Dimmer active={true} page={true}>
        <Header as="h2" icon={true} inverted={true}>
          {updaterStatus.message}
        </Header>
        <Progress
          percent={(100 * (updaterStatus.task / tasks)).toFixed(0)}
          indicating={true}
          progress={true}
        />
      </Dimmer>
      }
      {!readOnly &&
      <Grid.Row>
        <Grid.Column width={16}>
          <ContentToolBar
            buttonSave={true}
            buttonImport={
              <UploadGeoJSONModal
                onChange={handleChangeGeometry}
                geometry={'polygon'}
                size="medium"
              />
            }
            onSave={props.onSave}
            onUndo={props.onUndo}
          />
        </Grid.Column>
      </Grid.Row>}
      <Grid.Row>
        <Grid.Column>
          <Form>
            <Form.Group>
              <Form.Input
                label="Cell height"
                value={Math.round(dyCell(boundingBox, gridSize) * 10000) / 10}
                width={'6'}
                readOnly={true}
              />
              <Form.Input
                label="Cell width"
                value={Math.round(dxCell(boundingBox, gridSize) * 10000) / 10}
                width={'6'}
                readOnly={true}
              />
              <Form.Select
                compact={true}
                label="Length unit"
                options={[{key: 2, text: 'meters', value: 2}]}
                value={props.model.lengthUnit.toInt()}
                disabled={readOnly}
              />
            </Form.Group>
          </Form>
          <GridProperties
            boundingBox={boundingBox}
            geometry={geometry}
            gridSize={gridSize}
            intersection={props.model.intersection}
            onChange={handleChangeRotation}
            rotation={props.model.rotation}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <h3>Active Cells</h3>
          <DiscretizationMap
            cells={props.model.cells}
            boundingBox={boundingBox}
            boundaries={boundaryCollection}
            geometry={geometry}
            gridSize={gridSize}
            intersection={props.model.intersection}
            onChangeGeometry={handleChangeGeometry}
            onChangeCells={handleChangeCells}
            onChangeGridSize={handleChangeGridSize}
            readOnly={readOnly}
            rotation={props.model.rotation}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}/>
      </Grid.Row>
    </Grid>
  );
};

export default GridEditor;
