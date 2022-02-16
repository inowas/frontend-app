import { Circle, Image, Layer, Stage } from 'react-konva';
import { Dimmer, List, Loader } from 'semantic-ui-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { EGameObjectType, IGameObject } from '../../../../core/marPro/GameObject.type';
import { IGameState } from '../../../../core/marPro/GameState.type';
import { IScenario } from '../../../../core/marPro/Scenario.type';
import { IVector2D } from '../../../../core/marPro/Geometry.type';
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

const Playground = (props: IProps) => {
  const [activeGameObjects, setActiveGameObjects] = useState<IGameObject[]>([]);
  const [backgroundImage] = useImage(bg);
  const stageRef = useRef<any>(null);
  const [gameState, setGameState] = useState<IGameState>(GameState.fromScenario(props.scenario).toObject());

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
          <Stage width={props.scenario.stageSize.x} height={props.scenario.stageSize.y} ref={stageRef}>
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
