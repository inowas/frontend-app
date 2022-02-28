import { Dimmer, List, Loader } from 'semantic-ui-react';
import { DragEvent, useRef, useState } from 'react';
import { EGameObjectType, IGameObject } from '../../../../core/marPro/GameObject.type';
import { IGameState } from '../../../../core/marPro/GameState.type';
import { IMapScale } from '../types';
import { Image, Layer, Stage } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { styles } from './styles';
import Dialog from '../shared/Dialog';
import Footer from './Footer';
import GameObject from '../../../../core/marPro/GameObject';
import GameState from '../../../../core/marPro/GameState';
import Header from './Header';
import InfiltrationPond from '../gameObjects/InfiltrationPond';
import ResultModal from './ResultModal';
import River from '../gameObjects/River';
import Scenario from '../../../../core/marPro/Scenario';
import Toolbox from './Toolbox';
import bg from '../../assets/mar-gameboard-01-riverbed.png';
import useImage from '../../hooks/useImage';

interface IProps {
  scenario: Scenario;
}

const scaleBy = 1.3;

const Playground = (props: IProps) => {
  const [activeGameObjects, setActiveGameObjects] = useState<IGameObject[]>([]);
  const [backgroundImage] = useImage(bg);
  const stageRef = useRef<any>(null);
  const [gameState, setGameState] = useState<IGameState>(GameState.fromScenario(props.scenario).toObject());
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const [mapScale, setMapScale] = useState<IMapScale>({ offset: { x: 0, y: 0 }, zoom: 0 });

  const toggleResultModal = () => setShowResultModal(!showResultModal);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDropNewObject = (e: DragEvent<HTMLDivElement>) => {
    console.log(e);

    const newGameObject = GameObject.createWell();

    newGameObject.location = { x: e.screenX - mapScale.offset.x, y: e.screenY - mapScale.offset.y };

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

  const handleDragStage = (e: KonvaEventObject<any>) => {
    e.evt.preventDefault();
    setMapScale({ ...mapScale, offset: e.target._lastPos });
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
      return <InfiltrationPond key={object.id} gameObject={object} onClick={handleClickGameObject} />;
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
            width={1280}
            height={props.scenario.stageSize.y}
            onDragEnd={handleDragStage}
            onWheel={handleWheel}
            ref={stageRef}
          >
            <Layer>{backgroundImage && <Image image={backgroundImage} />}</Layer>
            <Layer>{renderGameObjects()}</Layer>
          </Stage>
        )}
      </div>
      <Footer onClickCheck={toggleResultModal} />
      {showResultModal && (
        <ResultModal
          gameState={GameState.fromObject(gameState)}
          onClose={toggleResultModal}
          scenario={props.scenario}
        />
      )}
    </>
  );
};

export default Playground;
