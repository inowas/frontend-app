import * as turf from '@turf/turf';
import { CALCULATE_CELLS_INPUT } from '../../../modflow/worker/t03.worker';
import { EObjectiveType, IObjectiveByObservation, IObjectiveByParameter, IObjectiveByResource } from '../../../../core/marPro/Objective.type';
import { Feature } from '@turf/turf';
import { Form, InputProps, Message } from 'semantic-ui-react';
import { FormEvent, useRef, useState } from 'react';
import { Geometry, ModflowModel } from '../../../../core/model/modflow';
import { ICalculateCellsInputData } from '../../../modflow/worker/t03.worker.type';
import { ICells } from '../../../../core/model/geometry/Cells.type';
import { IRootReducer } from '../../../../reducers';
import { Image, Layer, Stage } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Point } from 'geojson';
import { asyncWorker } from '../../../modflow/worker/worker';
import { useSelector } from 'react-redux';
import GameObject from '../../../../core/marPro/GameObject';
import InfiltrationPond from '../../../t100/components/gameObjects/InfiltrationPond';
import Objective from '../../../../core/marPro/Objective';
import Scenario from '../../../../core/marPro/Scenario';
import ToggleableInput from '../../../shared/complexTools/ToggleableInput';
import useImage from '../../../t100/hooks/useImage';

interface IProps {
  onChange: (objective: Objective) => void;
  objective: Objective;
  scenario: Scenario;
}

const GameObjectsDetails = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [backgroundImage] = useImage(props.scenario.image);
  const [error, setError] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  const MarPro = useSelector((state: IRootReducer) => state.MarProEditorReducer);
  const model = MarPro.model ? ModflowModel.fromObject(MarPro.model) : null;

  const handleChangeTogglableInput = (name: string, value: string | number | null) => {
    const o = props.objective.toObject() as IObjectiveByObservation;
    const cObjective: IObjectiveByObservation = {
      ...o,
      [name]: value === null ? undefined : (typeof value === 'string' ? 0 : value)
    };
    setActiveInput(null);
    props.onChange(Objective.fromObject(cObjective));
  }

  const handleBlurVector2D = () => {
    if (!activeInput || props.objective.type !== EObjectiveType.BY_OBSERVATION) {
      return;
    }
    const o = props.objective.toObject() as IObjectiveByObservation;
    const cObjective: IObjectiveByObservation = {
      ...o,
      position: {
        ...o.position,
        [activeInput]: parseInt(activeValue)
      }
    };
    setActiveInput(null);
    calculateCell(cObjective);
  };

  const handleDragWell = (_: GameObject, e: KonvaEventObject<DragEvent>) => {
    if (props.objective.type !== EObjectiveType.BY_OBSERVATION) {
      return;
    }
    const o = props.objective.toObject() as IObjectiveByObservation;
    const cObjective: IObjectiveByObservation = {
      ...o,
      position: {
        x: e.target._lastPos.x,
        y: e.target._lastPos.y,
      }
    };

    calculateCell(cObjective);
  };

  const calculateCell = (objective: IObjectiveByObservation) => {
    if (!model) {
      return {
        x: 0,
        y: 0
      };
    }
    // Calculate coordinates

    const relX = objective.position.x / props.scenario.stageSize.x;
    const relY = objective.position.y / props.scenario.stageSize.y;

    const lng = props.scenario.referencePoints[0][1] + relX * (props.scenario.referencePoints[1][1] - props.scenario.referencePoints[0][1])
    const lat = props.scenario.referencePoints[1][0] - relY * (props.scenario.referencePoints[1][0] - props.scenario.referencePoints[0][0])

    const point: Feature<Point> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };

    // Get cell from coordinates

    const geometry = Geometry.fromGeoJson(point);

    let g = geometry.toGeoJSON();
    if (model.rotation % 360 !== 0) {
      g = turf.transformRotate(
        geometry.toGeoJSON(), -1 * model.rotation, { pivot: model.geometry.centerOfMass }
      );
    }

    asyncWorker({
      type: CALCULATE_CELLS_INPUT,
      data: {
        geometry: g,
        boundingBox: model.boundingBox.toObject(),
        gridSize: model.gridSize.toObject(),
        intersection: model.intersection
      } as ICalculateCellsInputData
    }).then((c: ICells) => {
      objective.cell = c[0];
      props.onChange(Objective.fromObject(objective));
      setError(null);
    }).catch((e) => {
      setError('Observation well has been placed outside of model bounding box.');
    });
  }

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  if (props.objective.type === EObjectiveType.BY_RESOURCE || props.objective.type === EObjectiveType.BY_PARAMETER) {
    const o = props.objective.toObject() as IObjectiveByResource | IObjectiveByParameter;
    return (<Form>
      <Form.Group widths="equal">
        <Form.Field>
          <label>Min</label>
          <ToggleableInput
            name="min"
            onChange={handleChangeTogglableInput}
            placeholder="Min"
            readOnly={false}
            type="number"
            value={o.min !== undefined ? o.min : null}
          />
        </Form.Field>
        <Form.Field>
          <label>Max</label>
          <ToggleableInput
            name="max"
            onChange={handleChangeTogglableInput}
            placeholder="Max"
            readOnly={false}
            type="number"
            value={o.max !== undefined ? o.max : null}
          />
        </Form.Field>
      </Form.Group>
    </Form>);
  }

  const o = props.objective.toObject() as IObjectiveByObservation;
  const object = props.objective.toGameObject();

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <label>Min</label>
          <ToggleableInput
            name="min"
            onChange={handleChangeTogglableInput}
            placeholder="Min"
            readOnly={false}
            type="number"
            value={o.min !== undefined ? o.min : null}
          />
        </Form.Field>
        <Form.Field>
          <label>Max</label>
          <ToggleableInput
            name="max"
            onChange={handleChangeTogglableInput}
            placeholder="Max"
            readOnly={false}
            type="number"
            value={o.max !== undefined ? o.max : null}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurVector2D}
          onChange={handleChange}
          name="x"
          type="number"
          label="Location X"
          value={activeInput === 'x' ? activeValue : o.position.x}
        />
        <Form.Input
          onBlur={handleBlurVector2D}
          onChange={handleChange}
          name="y"
          type="number"
          label="Location Y"
          value={activeInput === 'y' ? activeValue : o.position.y}
        />
      </Form.Group>
      {
        error && <Message negative>{error}</Message>
      }
      <Form.Group widths="equal">
        <Form.Input
          label="Cell X"
          readOnly={true}
          value={o.cell[0]}
        />
        <Form.Input
          label="Cell Y"
          readOnly={true}
          value={o.cell[1]}
        />
      </Form.Group>
      <div className="field">
        <label className="ui form">Set location</label>
        <Stage
          width={props.scenario.stageSize.x}
          height={props.scenario.stageSize.y}
          ref={stageRef}
          style={{ overflow: 'scroll' }}
        >
          <Layer>{backgroundImage && <Image image={backgroundImage} />}</Layer>
          {object &&
            <Layer>
              <InfiltrationPond gameObject={object} onDragEnd={handleDragWell} />
            </Layer>
          }
        </Stage>
      </div>
    </Form>
  );
};

export default GameObjectsDetails;
