import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {BoundingBox, Cells, Geometry, GridSize, ModflowModel} from '../../../../../core/model/modflow';
import {CALCULATE_CELLS_INPUT} from '../../../../modflow/worker/t03.worker';
import {DiscretizationMap, GridProperties} from './index';
import {Form, Grid} from 'semantic-ui-react';
import {ICalculateCellsInputData} from '../../../../modflow/worker/t03.worker.type';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {IGridSize} from '../../../../../core/model/geometry/GridSize.type';
import {IRootReducer} from '../../../../../reducers';
import {addMessage} from '../../../actions/actions';
import {asyncWorker} from '../../../../modflow/worker/worker';
import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import {messageError} from '../../../defaults/messages';
import {useDispatch, useSelector} from 'react-redux';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import React, {useEffect, useState} from 'react';
import UploadGeoJSONModal from '../create/UploadGeoJSONModal';

interface IProps {
  model: ModflowModel;
  onChange: (modflowModel: ModflowModel) => void;
  onSave: (updateNeeded: boolean) => void;
  onUndo: () => void;
}

const GridEditor = (props: IProps) => {
  const [gridSize, setGridSize] = useState<IGridSize>(props.model.gridSize.toObject());

  const dispatch = useDispatch();

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const boundaryCollection = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;

  useEffect(() => {
    setGridSize(props.model.gridSize.toObject());
  }, [props.model]);

  if (!boundaryCollection) {
    return null;
  }

  const readOnly = props.model.readOnly;

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
      return props.onChange(model);
    }).catch(() => {
      dispatch(addMessage(messageError('discretization', 'Calculating cells failed.')));
    });
  };

  const handleChangeGridSize = (g: GridSize) => {
    const model = props.model.getClone();
    model.gridSize = g;
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
    return props.onChange(model);
  };

  const {boundingBox, geometry} = props.model;

  return (
    <Grid>
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
            onSave={() => props.onSave(true)}
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
                value={Math.round(dyCell(boundingBox, GridSize.fromObject(gridSize)) * 10000) / 10}
                width={'6'}
                readOnly={true}
              />
              <Form.Input
                label="Cell width"
                value={Math.round(dxCell(boundingBox, GridSize.fromObject(gridSize)) * 10000) / 10}
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
            gridSize={GridSize.fromObject(gridSize)}
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
            gridSize={GridSize.fromObject(gridSize)}
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
