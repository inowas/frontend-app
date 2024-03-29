import { Button, Grid } from 'semantic-ui-react';
import { EGameObjectType, IDraftGameObject } from '../../../../core/marPro/GameObject.type';
import { EObjectiveType } from '../../../../core/marPro/Objective.type';
import { ICost } from '../../../../core/marPro/Tool.type';
import { IMapScale } from './types';
import { IRootReducer } from '../../../../reducers';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Path, Stage } from 'react-konva';
import { ReactNode, useRef, useState } from 'react';
import { updateGameState } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import Background from './Background';
import ConfirmBuyGameObject from './dialogs/ConfirmBuyGameObject';
import DraftGameObject from '../../../../core/marPro/DraftGameObject';
import DraftGameObjectComponent from './gameObjects/DraftGameObjectComponent';
import GameObject from '../../../../core/marPro/GameObject';
import GameObjectDialog from './dialogs/GameObjectDialog';
import GameState from '../../../../core/marPro/GameState';
import Header from './Header';
import InfiltrationPond from './gameObjects/InfiltrationPond';
import ObservationWell from './gameObjects/ObservationWell';
import ResourceManager from './shared/ResourceManager';
import Resources from './Resources';
import Results from './Results';
import River from './gameObjects/River';
import Scenario from '../../../../core/marPro/Scenario';
import Tool from '../../../../core/marPro/Tool';
import Toolbox from './Toolbox';
import useResults from '../hooks/useResults';

const scaleBy = 1.3;

const Playground = () => {
  const [activeGameObjects, setActiveGameObjects] = useState<string[]>([]);
  const stageRef = useRef<any>(null);
  const [gameObjectToAdd, setGameObjectToAdd] = useState<IDraftGameObject | null>(null);
  const [showResourceManager, setShowResourceManager] = useState<boolean>(false);

  const [mapScale, setMapScale] = useState<IMapScale>({ offset: { x: 0, y: 0 }, zoom: 0 });

  const MarPro = useSelector((state: IRootReducer) => state.MarProReducer);
  const gameState = MarPro.gameState || null;
  const scenario = MarPro.scenario ? Scenario.fromObject(MarPro.scenario) : null;

  const { refetch } = useResults(); //data, isLoading,

  const dispatch = useDispatch();

  const updateStore = (g: GameState) => dispatch(updateGameState(g));

  if (!gameState || !scenario) {
    return null;
  }

  const toggleResourceManager = () => setShowResourceManager(!showResourceManager);

  const handleAddGameObject = (object: DraftGameObject) => setGameObjectToAdd(object.toObject());

  const handleCloseDialog = (id: string) =>
    setActiveGameObjects(activeGameObjects.filter((gameObjectId) => gameObjectId !== id));

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
    console.log(gameObjectToAdd);
    if (!gameObjectToAdd) {
      return null;
    }

    const gs = GameState.fromObject(gameState);
    const newGameObject = DraftGameObject.fromObject(gameObjectToAdd).toGameObject(tool.parameters);

    gs.addGameObject(newGameObject);
    gs.updateResources(tool.costs);

    updateStore(gs);
    setGameObjectToAdd(null);
  };

  const handleChangeGameObject = (g: GameObject, costs: ICost[]) => {
    const cGameState = GameState.fromObject(gameState);
    cGameState.updateGameObject(g);
    costs.forEach((cost) => cGameState.updateResource(cost));
    updateStore(cGameState);
  };

  const handleClickGameObject = (gameObject: GameObject) =>
    activeGameObjects.filter((id) => id === gameObject.id).length === 0
      ? setActiveGameObjects([...activeGameObjects, gameObject.id])
      : null;

  const handleDragGameObject = (gameObject: GameObject) => {
    const pointerPosition = stageRef.current.getRelativePointerPosition();
    if (
      pointerPosition.x < 0 ||
      pointerPosition.y < 0 ||
      pointerPosition.x > scenario.stageSize.x ||
      pointerPosition.y > scenario.stageSize.y
    ) {
      return null;
    }
    const cGameState = GameState.fromObject(gameState);
    gameObject.location = {
      x: pointerPosition.x - 22,
      y: pointerPosition.y - 15,
    };
    cGameState.updateGameObject(gameObject);
    updateStore(cGameState);
  };

  const handleDeleteGameObject = (g: GameObject, costs: ICost[]) => {
    const cGameState = GameState.fromObject(gameState);
    costs.forEach((cost) => cGameState.updateResource(cost));
    cGameState.removeGameObject(g);

    const tool = scenario.tools.filter((tool) => tool.name === g.type);
    if (tool.length > 0) {
      tool[0].costs?.forEach((cost) => {
        cGameState.refundResource(cost);
      });
    }

    updateStore(cGameState);
  };

  const handleDragStage = (e: KonvaEventObject<any>) => {
    e.evt.preventDefault();
    setMapScale({ ...mapScale, offset: e.target._lastPos });
  };

  const handleMouseMove = () => {
    if (!gameObjectToAdd || gameObjectToAdd.hasBeenPlaced) {
      return null;
    }
    const pointerPosition = stageRef.current.getRelativePointerPosition();

    if (
      pointerPosition.x < 0 ||
      pointerPosition.y < 0 ||
      pointerPosition.x > scenario.stageSize.x ||
      pointerPosition.y > scenario.stageSize.y
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
    const tool = scenario.tools.filter((tool) => tool.name === gameObjectToAdd.type);

    if (tool.length === 0) {
      return null;
    }

    return (
      <ConfirmBuyGameObject
        onClickCancel={handleCancelPurchaseGameObject}
        onClickConfirm={handleConfirmPurchaseGameObject}
        scenario={scenario}
        tool={Tool.fromObject(tool[0])}
      />
    );
  };

  const renderGameObjectDialogs = () => {
    const aGameObjects: ReactNode[] = [];
    activeGameObjects.forEach((id) => {
      const g = gameState.objects.filter((o) => o.id === id);
      if (g.length > 0) {
        aGameObjects.push(
          <GameObjectDialog
            key={g[0].id}
            gameObject={GameObject.fromObject(g[0])}
            scenario={scenario}
            onChange={handleChangeGameObject}
            onClose={handleCloseDialog}
            onDelete={handleDeleteGameObject}
          />,
        );
      }
    });
    return aGameObjects;
  };

  const renderObservationWells = () => {
    const wells = gameState.objectives.filter((o) => o.objective.type === EObjectiveType.BY_OBSERVATION);

    if (wells.length === 0) {
      return null;
    }

    return wells.map((o, k) => <ObservationWell key={`observation_${k}`} objectiveState={o} />);
  };

  const renderGameObjects = () => {
    const gameObjects: any[] = gameState.objects.map((object) => {
      if (object.type === EGameObjectType.RIVER) {
        return <River key={object.id} gameObject={GameObject.fromObject(object)} onClick={handleClickGameObject} />;
      }
      return (
        <InfiltrationPond
          key={object.id}
          gameObject={GameObject.fromObject(object)}
          onClick={handleClickGameObject}
          onDragEnd={handleDragGameObject}
        />
      );
    });
    return gameObjects;
  };

  const renderZones = () => {
    if (scenario.zones.length === 0) {
      return null;
    }

    return (
      <Layer>
        {scenario.zones.map((zone) => (
          <Path key={zone.id} {...zone.options} />
        ))}
      </Layer>
    );
  };

  return (
    <>
      <div className='bg-noise'></div>
      <Header gameState={GameState.fromObject(gameState)} onToggleResourceManager={toggleResourceManager} />
      <Grid>
        <Grid.Row className='gameboard'>
          <Grid.Column width={'three'}>
            <Button onClick={() => refetch()}>REFETCH</Button>
            <Resources gameState={GameState.fromObject(gameState)} scenario={scenario} />
            <Toolbox
              gameObjectToAdd={gameObjectToAdd ? DraftGameObject.fromObject(gameObjectToAdd) : null}
              onAddGameObject={handleAddGameObject}
              scenario={scenario}
            />
            {gameState && <Results gameState={GameState.fromObject(gameState)} scenario={scenario} />}
          </Grid.Column>
          <Grid.Column width={'thirteen'}>
            {showResourceManager && <ResourceManager onClose={toggleResourceManager} />}
            {renderGameObjectDialogs()}
            {renderDraftGameObjectDialogs()}
            <Stage
              draggable
              width={1000}
              height={scenario.stageSize.y}
              onDragEnd={handleDragStage}
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
              ref={stageRef}
            >
              <Layer>
                <Background img={scenario.backgroundImage} />
              </Layer>
              {renderZones()}
              <Layer>{renderGameObjects()}</Layer>
              <Layer>{renderObservationWells()}</Layer>
              {gameObjectToAdd && (
                <Layer>
                  <DraftGameObjectComponent
                    gameObject={DraftGameObject.fromObject(gameObjectToAdd)}
                    onClick={handleClickDraftGameObject}
                  />
                </Layer>
              )}
            </Stage>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default Playground;
