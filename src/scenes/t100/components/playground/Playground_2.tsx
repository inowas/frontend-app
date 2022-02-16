import { Circle, Image, Layer, Stage } from 'react-konva';
import { Dimmer, List, Loader } from 'semantic-ui-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { EGameObjectType, IGameObject } from '../../../../core/marPro/GameObject.type';
import { IGameState } from '../../../../core/marPro/GameState.type';
import { IScenario } from '../../../../core/marPro/Scenario.type';
import { IVector2D } from '../../../../core/marPro/Geometry.type';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { getSnappingPoint } from '../utils';
import { styles } from './styles';
import Dialog from '../shared/Dialog';
import Footer from './Footer';
import GameObject from '../../../../core/marPro/GameObject';
import GameState from '../../../../core/marPro/GameState';
import Header from './Header';
import InfiltrationPond from '../gameObjects/InfiltrationPond';
import River from '../gameObjects/River';
import Toolbox from './Toolbox';
import bg from '../../assets/mar-gameboard-01-riverbed.png';
import useImage from '../../hooks/useImage';

interface IProps {
  scenario: IScenario;
}

const scaleBy = 1.3;

const getDistance = (p1: Vector2d, p2: Vector2d) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const getCenter = (p1: Vector2d, p2: Vector2d) => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

const Playground = (props: IProps) => {
  const [activeGameObjects, setActiveGameObjects] = useState<IGameObject[]>([]);
  const [backgroundImage] = useImage(bg);
  const stageRef = useRef<any>(null);
  const [gameState, setGameState] = useState<IGameState>(GameState.fromScenario(props.scenario).toObject());

  const [center, setCenter] = useState<Vector2d | null>(null);
  const [dist, setDist] = useState<number>();

  const calculateGrid = (scenario: IScenario) => {
    const r_x = 800;
    const r_y = 0;
    const g_x = scenario.gridSize.x;
    const g_y = scenario.gridSize.y;
    const c_x = 44;
    const c_y = 30;

    const points: Vector2d[] = [];
    for (let y = 0; y < g_y; y++) {
      for (let x = 0; x < g_x; x++) {
        points.push({
          x: r_x + ((x - y) * c_x) / 2,
          y: r_y + ((x + y) * c_y) / 2,
        });
      }
    }
    return points;
  };

  const [grid, setGrid] = useState<IVector2D[]>(calculateGrid(props.scenario));

  useEffect(() => {
    setGrid(calculateGrid(props.scenario));
  }, [props.scenario]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDropNewObject = (e: DragEvent<HTMLDivElement>) => {
    console.log(e);

    const newGameObject = GameObject.createWell();
    newGameObject.location = getSnappingPoint(grid, e.clientX, e.clientY);

    setGameState({
      ...gameState,
      objects: [...gameState.objects, newGameObject.toObject()],
    });
  };

  const handleClickPoint = (e: any) => {
    console.log(e);
  };

  const handleCloseDialog = (id: string) => () =>
    setActiveGameObjects(activeGameObjects.filter((gameObject) => gameObject.id !== id));

  const handleClickGameObject = (gameObject: IGameObject) =>
    activeGameObjects.filter((g) => g.id === gameObject.id).length === 0
      ? setActiveGameObjects([...activeGameObjects, gameObject])
      : null;

  const handleTouch = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    let lastCenter = center;
    let lastDist = dist;
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];
    const stage = stageRef.current;
    if (stage !== null) {
      if (touch1 && touch2) {
        if (stage.isDragging()) {
          stage.stopDrag();
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          lastCenter = getCenter(p1, p2);
          return;
        }
        const newCenter = getCenter(p1, p2);

        const dist = getDistance(p1, p2);

        if (!lastDist) {
          lastDist = dist;
        }

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        const scale = stage.scaleX() * (dist / lastDist);

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        const dx = newCenter.x - lastCenter.x;
        const dy = newCenter.y - lastCenter.y;

        const newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        setDist(dist);
        setCenter(newCenter);
      }
    }
  };

  const handleTouchEnd = () => {
    setDist(0);
    setCenter(null);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  };

  const renderGameObjects = () => {
    const gameObjects: any[] = gameState.objects.map((object, k) => {
      if (object.type === EGameObjectType.RIVER) {
        return <River key={object.id} gameObject={object} onClick={handleClickGameObject} />;
      }
      return <InfiltrationPond key={object.id} gameObject={object} grid={grid} onClick={handleClickGameObject} />;
    });
    return gameObjects;
  };

  return (
    <>
      <Header />
      <Toolbox scenario={props.scenario} />
      <div style={styles.body} onDrop={handleDropNewObject} onDragOver={handleDragOver}>
        {activeGameObjects.map((gameObject) => (
          <Dialog
            key={`dialog_${gameObject.id}`}
            header={gameObject.type}
            image={gameObject.type}
            content={
              <List>
                <List.Item>object_id: {gameObject.id}</List.Item>
              </List>
            }
            onClose={handleCloseDialog(gameObject.id)}
          />
        ))}
        {!backgroundImage ? (
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        ) : (
          <Stage
            draggable
            width={props.scenario.stageSize.x}
            height={props.scenario.stageSize.y}
            onTouchMove={handleTouch}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            ref={stageRef}
          >
            <Layer>{backgroundImage && <Image image={backgroundImage} />}</Layer>
            <Layer>{renderGameObjects()}</Layer>
            <Layer>
              {grid.map((cell, k) => (
                <Circle key={k} onClick={handleClickPoint} fill="grey" radius={2} x={cell.x} y={cell.y} />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Playground;
