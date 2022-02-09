import { Circle, Image, Layer, Stage } from 'react-konva';
import { Dimmer, List, Loader } from 'semantic-ui-react';
import { EGameObjectType, IGameObject } from '../../../../core/marPro/GameObject.type';
import { IGameState } from '../../../../core/marPro/GameState.type';
import { IScenario } from '../../../../core/marPro/Scenario.type';
import { IVector2D } from '../../../../core/marPro/Geometry.type';
import { Vector2d } from 'konva/lib/types';
import { styles } from './styles';
import { useEffect, useRef, useState } from 'react';
import Dialog from '../shared/Dialog';
import GameState from '../../../../core/marPro/GameState';
import InfiltrationPond from '../gameObjects/InfiltrationPond';
import River from '../gameObjects/River';
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
    const angle = 30;
    const r_x = 800;
    const r_y = 0;
    const g_x = 20;
    const g_y = 40;
    const c_x = 44;
    const c_y = 30;
    const dxx = Math.cos((angle * Math.PI) / 180) * c_x;
    const dyx = Math.cos(((90 - angle) * Math.PI) / 180) * c_y;
    const dxy = Math.sin((angle * Math.PI) / 180) * c_x;
    const dyy = Math.sin(((90 - angle) * Math.PI) / 180) * c_y;
    const dx = c_x * Math.cos(angle) + c_y * Math.cos(60);
    const dy = c_x * Math.sin(angle) + c_y * Math.sin(60);

    console.log({
      dxx,
      dyx,
      dxy,
      dyy,
    });

    const points: Vector2d[] = [];
    for (let y = 0; y < g_y; y++) {
      for (let x = 0; x < g_x; x++) {
        points.push({
          x: r_x + ((x - y) * c_x) / 2,
          y: r_y + ((x + y) * c_y) / 2,
        });
      }
      //r_x += dx;
      //r_y -= dy;
    }
    return points;
  };

  const [grid, setGrid] = useState<IVector2D[]>(calculateGrid(props.scenario));

  useEffect(() => {
    setGrid(calculateGrid(props.scenario));
  }, [props.scenario]);

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
    <div style={styles.body}>
      {activeGameObjects.map((gameObject) => (
        <Dialog
          key={`dialog_${gameObject.id}`}
          header={gameObject.type}
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
  );

  /*return (
    <div style={styles.body}>
      <div style={styles.bgNoise}>xx</div>
      <div
        style={{
          ...styles.boardBg,
          background: `url(${bg}) no-repeat`,
        }}
      >
        {renderGameObjects()}
      </div>
    </div>
  );*/
};

export default Playground;
