import { BoundaryCollection } from '../../../../core/model/modflow';
import { Divider, DropdownProps, Form, InputProps, Message, Tab } from 'semantic-ui-react';
import { Feature, Geometry, Position } from '@turf/turf';
import { FormEvent, useRef, useState } from 'react';
import { IGameObject, gameObjectTypes } from '../../../../core/marPro/GameObject.type';
import { Image, Layer, Stage } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Point } from 'geojson';
import GameObject from '../../../../core/marPro/GameObject';
import InfiltrationPond from '../gameObjects/InfiltrationPond';
import Parameters from './Parameters';
import Scenario from '../../../../core/marPro/Scenario';
import useImage from '../../hooks/useImage';
import uuid from 'uuid';

interface IProps {
  boundaries: BoundaryCollection;
  onChange: (object: GameObject) => void;
  object: GameObject;
  scenario: Scenario;
}

const GameObjects = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [backgroundImage] = useImage(props.scenario.image);
  const stageRef = useRef<any>(null);

  const handleBlurVector2D = (type: 'size' | 'location') => () => {
    if (!activeInput) {
      return;
    }
    const cObject: IGameObject = {
      ...props.object.toObject(),
      [type]: {
        ...props.object[type],
        [activeInput === 'sizeX' || activeInput === 'locationX' ? 'x' : 'y']: parseInt(activeValue),
      },
    };
    setActiveInput(null);
    props.onChange(GameObject.fromObject(cObject));
  };

  const handleChangeBoundary = (_: FormEvent, { value }: DropdownProps) => {
    const boundary = props.boundaries.all.filter((b) => b.id === value);

    if (boundary.length < 1) {
      return;
    }

    const cObject = props.object.toObject();
    cObject.boundaryId = boundary[0].id;
    cObject.boundaryType = boundary[0].type;
    props.onChange(GameObject.fromObject(cObject));
  };

  const handleUnlinkBoundary = () => {
    const cObject = props.object.toObject();
    cObject.boundaryId = undefined;
    cObject.boundaryType = undefined;
    props.onChange(GameObject.fromObject(cObject));
  };

  const handleImportParameters = () => {
    const boundary = props.boundaries.all.filter((b) => b.id === props.object.boundaryId);

    if (boundary.length < 1) {
      return;
    }

    // TODO get value: const spValues = boundary[0].getSpValues()

    const cObject = props.object.toObject();
    boundary[0].valueProperties.forEach((v, k) => {
      cObject.parameters.push({
        id: uuid.v4(),
        name: v.name,
        value: 0,
        valuePropertyKey: k,
      });
    });
    props.onChange(GameObject.fromObject(cObject));
  };

  const handleImportLocation = () => {
    const boundary = props.boundaries.all.filter((b) => b.id === props.object.boundaryId);

    if (boundary.length < 1) {
      return;
    }

    let point: Feature<Point> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
    };

    if (boundary[0].geometry.type === 'Point') {
      (point.geometry as Geometry).coordinates = boundary[0].geometry.coordinates as Position;
    } else {
      point = boundary[0].geometry.centerOfMass;
    }

    const ref = props.scenario.referencePoints;

    if (!point.geometry) {
      return;
    }

    const dX = ref[1][1] - ref[0][1];
    const relPosX = (point.geometry.coordinates[0] - ref[0][1]) / dX;
    console.log({ dX, x: point.geometry.coordinates[0], ref: ref });

    const dY = ref[1][0] - ref[0][0];
    const relPosY = (ref[1][0] - point.geometry.coordinates[1]) / dY;

    const x = relPosX * props.scenario.stageSize.x;
    const y = relPosY * props.scenario.stageSize.y;

    const cObject = props.object.toObject();
    cObject.location.x = x;
    cObject.location.y = y;

    props.onChange(GameObject.fromObject(cObject));
  };

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeType = (_: FormEvent, { name, value }: DropdownProps) => {
    const types = gameObjectTypes.filter((t) => t.type === value);

    if (types.length < 1) {
      return;
    }

    const cObject: IGameObject = {
      ...props.object.toObject(),
      size: types[0].size,
      type: types[0].type,
    };

    setActiveInput(null);
    props.onChange(GameObject.fromObject(cObject));
  };

  const handleDragGameObject = (gameObject: GameObject, e: KonvaEventObject<DragEvent>) => {
    gameObject.location = {
      x: e.target._lastPos.x,
      y: e.target._lastPos.y,
    };
    props.onChange(gameObject);
  };

  const renderParameters = () => {
    return <Parameters gameObject={props.object} onChange={props.onChange} />;
  };

  const renderSpatialSettings = () => {
    return (
      <Form>
        <Form.Group>
          <Form.Input
            onBlur={handleBlurVector2D('size')}
            onChange={handleChange}
            name="sizeX"
            type="number"
            label="Size X"
            value={activeInput === 'sizeX' ? activeValue : props.object.size.x}
          />
          <Form.Input
            onBlur={handleBlurVector2D('size')}
            onChange={handleChange}
            name="sizeY"
            type="number"
            label="Size Y"
            value={activeInput === 'sizeY' ? activeValue : props.object.size.y}
          />
          <Form.Input
            onBlur={handleBlurVector2D('location')}
            onChange={handleChange}
            name="locationX"
            type="number"
            label="Location X"
            value={activeInput === 'locationX' ? activeValue : props.object.location.x}
          />
          <Form.Input
            onBlur={handleBlurVector2D('location')}
            onChange={handleChange}
            name="locationY"
            type="number"
            label="Location Y"
            value={activeInput === 'locationY' ? activeValue : props.object.location.y}
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
            <Layer>
              <InfiltrationPond gameObject={props.object} onDragEnd={handleDragGameObject} />
            </Layer>
          </Stage>
        </div>
      </Form>
    );
  };

  return (
    <>
      <Form>
        <Form.Select
          name="type"
          label="Type"
          options={gameObjectTypes.map((t) => ({ key: t.type, text: t.type, value: t.type }))}
          onChange={handleChangeType}
          value={props.object.type}
        />
        <Divider />
        {props.scenario.modelId && props.boundaries.length > 0 && (
          <>
            <Message>
              You can link a game object to a boundary from the linked model. Since gameObjects are located by only one
              coordinate, it will import the center of mass of that boundary.
            </Message>
            <Form.Group>
              <Form.Select
                label="Link to boundary (Leave empty, if it should not be linked to a boundary."
                onChange={handleChangeBoundary}
                options={props.boundaries.all.map((b) => ({
                  key: b.id,
                  text: b.name,
                  value: b.id,
                }))}
                placeholder="No link"
                value={props.object.boundaryId}
              />
              <Form.Button label="&nbsp;" disabled={!props.object.boundaryId} onClick={handleUnlinkBoundary}>
                Unlink
              </Form.Button>
              <Form.Button label="&nbsp;" disabled={!props.object.boundaryId} onClick={handleImportLocation}>
                Import location
              </Form.Button>
              <Form.Button label="&nbsp;" disabled={!props.object.boundaryId} onClick={handleImportParameters}>
                Import Parameters
              </Form.Button>
            </Form.Group>
          </>
        )}
      </Form>
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={[
          {
            menuItem: 'Spatial Settings',
            render: () => renderSpatialSettings(),
          },
          {
            menuItem: 'Parameters',
            render: () => renderParameters(),
          },
        ]}
      />
    </>
  );
};

export default GameObjects;
