import { Dimmer, Grid, List, Loader } from 'semantic-ui-react';
import { DragEvent, useRef, useState } from 'react';
import { EGameObjectType, IDraftGameObject, IGameObject } from '../../../../core/marPro/GameObject.type';
import { IGameState } from '../../../../core/marPro/GameState.type';
import { IMapScale } from '../types';
import { IVector2D } from '../../../../core/marPro/Geometry.type';
import { Image, Layer, Stage } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import ConfirmBuyGameObject from '../dialogs/ConfirmBuyGameObject';
import Dialog from '../shared/Dialog';
import DraftGameObject from '../../../../core/marPro/DraftGameObject';
import DraftGameObjectComponent from '../gameObjects/DraftGameObjectComponent';
import Footer from './Footer';
import GameObject from '../../../../core/marPro/GameObject';
import GameState from '../../../../core/marPro/GameState';
import Header from './Header';
import InfiltrationPond from '../gameObjects/InfiltrationPond';
import ResultModal from './ResultModal';
import River from '../gameObjects/River';
import Scenario from '../../../../core/marPro/Scenario';
import Tool from '../../../../core/marPro/Tool';
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
  const [gameObjectToAdd, setGameObjectToAdd] = useState<IDraftGameObject | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const [mapScale, setMapScale] = useState<IMapScale>({ offset: { x: 0, y: 0 }, zoom: 0 });

  const toggleResultModal = () => setShowResultModal(!showResultModal);

  const handleAddGameObject = (object: DraftGameObject) => setGameObjectToAdd(object.toObject());

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDropNewObject = (e: DragEvent<HTMLDivElement>) => {
    const newGameObject = GameObject.createWell();

    newGameObject.location = {
      x: e.nativeEvent.offsetX - mapScale.offset.x - 22,
      y: e.nativeEvent.offsetY - mapScale.offset.y - 15,
    };

    setGameState({
      ...gameState,
      objects: [...gameState.objects, newGameObject.toObject()],
    });
  };

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    console.log(stageRef.current.getRelativePointerPosition());
  };

  const handleCloseDialog = (id: string) => () =>
    setActiveGameObjects(activeGameObjects.filter((gameObject) => gameObject.id !== id));

  const handleClickDraftGameObject = () => {
    if (!gameObjectToAdd) {
      return null;
    }

    setGameObjectToAdd({
      ...gameObjectToAdd,
      hasBeenPlaced: true,
    });
  };

  const handleCancelPurchaseGameObject = () => setGameObjectToAdd(null);

  const handleConfirmPurchaseGameObject = (tool: Tool) => {
    if (!gameObjectToAdd) {
      return null;
    }

    const gs = GameState.fromObject(gameState);
    const newGameObject = DraftGameObject.fromObject(gameObjectToAdd).toGameObject();

    gs.addGameObject(newGameObject);
    if (tool.cost) {
      gs.updateResource(tool.cost);
    }

    setGameState(gs.toObject());

    setGameObjectToAdd(null);
  };

  const handleClickGameObject = (gameObject: IGameObject) =>
    activeGameObjects.filter((g) => g.id === gameObject.id).length === 0
      ? setActiveGameObjects([...activeGameObjects, gameObject])
      : null;

  const handleDragStage = (e: KonvaEventObject<any>) => {
    e.evt.preventDefault();
    console.log(e);
    setMapScale({ ...mapScale, offset: e.target._lastPos });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!gameObjectToAdd || gameObjectToAdd.hasBeenPlaced) {
      return null;
    }
    const pointerPosition = stageRef.current.getRelativePointerPosition();

    if (
      pointerPosition.x < 0 ||
      pointerPosition.y < 0 ||
      pointerPosition.x > props.scenario.stageSize.x ||
      pointerPosition.y > props.scenario.stageSize.y
    ) {
      return null;
    }
    setGameObjectToAdd({
      ...gameObjectToAdd,
      location: {
        x: pointerPosition.x - 22,
        y: pointerPosition.y - 15,
      },
    });
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

  const renderDraftGameObjectDialogs = () => {
    if (!gameObjectToAdd || !gameObjectToAdd.hasBeenPlaced) {
      return null;
    }
    const tool = props.scenario.tools.filter((tool) => tool.name === gameObjectToAdd.type);

    if (tool.length === 0) {
      return null;
    }

    return (
      <ConfirmBuyGameObject
        onClickCancel={handleCancelPurchaseGameObject}
        onClickConfirm={handleConfirmPurchaseGameObject}
        tool={Tool.fromObject(tool[0])}
      />
    );
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
      <div className="bg_noise"></div>
      <Header gameState={GameState.fromObject(gameState)} />
      <Grid>
        <Grid.Row style={{ paddingTop: 0 }}>
          <Grid.Column width={'two'}>
            <Toolbox
              gameObjectToAdd={gameObjectToAdd ? DraftGameObject.fromObject(gameObjectToAdd) : null}
              onAddGameObject={handleAddGameObject}
              scenario={props.scenario}
            />
          </Grid.Column>
          <Grid.Column width={'fourteen'}>
            <div onDrop={handleDropNewObject} onDragOver={handleDragOver}>
              {activeGameObjects.map((gameObject) => (
                <Dialog
                  key={`dialog_${gameObject.id}`}
                  header={gameObject.type}
                  image={gameObject.type}
                  content={
                    <List>
                      <List.Item>object_id: {gameObject.id}</List.Item>
                      <List.Item>
                        [{gameObject.location.x}, {gameObject.location.y}]
                      </List.Item>
                    </List>
                  }
                  onClose={handleCloseDialog(gameObject.id)}
                />
              ))}
              {renderDraftGameObjectDialogs()}
              {!backgroundImage ? (
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              ) : (
                <Stage
                  draggable
                  width={1280}
                  height={props.scenario.stageSize.y}
                  onClick={handleClick}
                  onDragEnd={handleDragStage}
                  onMouseMove={handleMouseMove}
                  onWheel={handleWheel}
                  ref={stageRef}
                >
                  <Layer>{backgroundImage && <Image image={backgroundImage} />}</Layer>
                  <Layer>{renderGameObjects()}</Layer>
                  {gameObjectToAdd && (
                    <Layer>
                      <DraftGameObjectComponent
                        gameObject={DraftGameObject.fromObject(gameObjectToAdd)}
                        onClick={handleClickDraftGameObject}
                      />
                    </Layer>
                  )}
                </Stage>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
