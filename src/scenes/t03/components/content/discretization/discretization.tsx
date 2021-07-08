import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Dimmer, Grid, Header, Menu, Progress, Segment} from 'semantic-ui-react';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import {IModflowModel} from '../../../../../core/model/modflow/ModflowModel.type';
import {IRootReducer} from '../../../../../reducers';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {
  addMessage,
  removeMessage,
  updateBoundaries, updateLayer,
  updateMessage,
  updateModel,
  updateSoilmodel
} from '../../../actions/actions';
import {boundaryUpdater, layersUpdater, zonesUpdater} from './updater';
import {messageDirty, messageError, messageSaving} from '../../../defaults/messages';
import {sendCommand} from '../../../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import GridEditor from './gridEditor';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import React, {useEffect, useRef, useState} from 'react';
import StressperiodsEditor from './stressperiodsEditor';
import _ from 'lodash';

interface IBoundaryUpdaterStatus {
  task: number;
  message: string;
}

const Discretization = () => {
  const menuItems = [
    {id: 'grid', name: 'Spatial discretization'},
    {id: 'stressperiods', name: 'Time discretization'}
  ];
  const [model, setModel] = useState<IModflowModel>();
  const [selected, setSelected] = useState<string>(menuItems[0].id);
  const [updaterStatus, setUpdaterStatus] = useState<IBoundaryUpdaterStatus | null>(null);

  const modelRef = useRef<ModflowModel>();
  const editingState = useRef<{ [key: string]: IMessage | null }>({
    dirty: null,
    saving: null
  });

  const dispatch = useDispatch();

  const handleChangeModel = (m: ModflowModel) => {
    modelRef.current = m;
    setModel(m.toObject());
    if (!editingState.current.dirty) {
      dispatch(addMessage(messageDirty('discretization')));
    }
  };

  const handleChangeSelected = (id: string) => () => setSelected(id);

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const modelFromProps = T03.model ? ModflowModel.fromObject(T03.model) : null;
  const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
  const messages = MessagesCollection.fromObject(T03.messages);
  const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

  useEffect(() => {
    if (modelFromProps) {
      modelRef.current = modelFromProps;
      setModel(modelFromProps.toObject());
    }
    return function cleanup() {
      handleSave(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    editingState.current = messages.getEditingState('discretization');
  }, [messages]);

  const handleUndo = () => {
    if (!editingState.current.dirty || !modelFromProps) {
      return;
    }
    dispatch(removeMessage(editingState.current.dirty));
    setModel(modelFromProps.toObject());
  };

  const handleSave = (updateNeeded: boolean) => {
    if (!modelRef.current || !editingState.current.dirty || !model) {
      return;
    }
    if (updateNeeded) {
      update(ModflowModel.fromObject(model));
    }
    const m = modelRef.current;
    const message = messageSaving('discretization');
    dispatch(addMessage(message));
    const command = ModflowModelCommand.updateModflowModelDiscretization(
      m.id,
      m.geometry.toObject(),
      m.boundingBox.toObject(),
      m.gridSize.toObject(),
      m.cells.toObject(),
      m.stressperiods.toObject(),
      m.lengthUnit.toInt(),
      m.timeUnit.toInt(),
      m.rotation,
      m.intersection
    );

    return sendCommand(command, () => {
        if (editingState.current.dirty) {
          dispatch(removeMessage(editingState.current.dirty));
        }
        dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
        dispatch(updateModel(m));
      }
    );
  };

  const update = (model: ModflowModel) => {
    if (!boundaries || !soilmodel) {
      return null;
    }
    boundaryUpdater(
      _.cloneDeep(boundaries),
      model,
      (b, l) => setUpdaterStatus({
        task: 1 + boundaries.length - l,
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
              task: 1 + boundaries.length + soilmodel.zonesCollection.length - l,
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
                    task: 1 + boundaries.length + soilmodel.zonesCollection.length +
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

  const renderDetails = (id: string) => {
    if (!model || !boundaries) {
      return null;
    }

    switch (id) {
      case 'grid': {
        return (
          <GridEditor
            model={ModflowModel.fromObject(model)}
            onChange={handleChangeModel}
            onSave={handleSave}
            onUndo={handleUndo}
          />
        );
      }
      case 'stressperiods': {
        return (
          <StressperiodsEditor
            model={ModflowModel.fromObject(model)}
            boundaries={boundaries}
            onChange={handleChangeModel}
            onSave={handleSave}
            onUndo={handleUndo}
          />
        );
      }
    }
  };

  if (!soilmodel || !boundaries) {
    return null;
  }

  const tasks = boundaries.length + soilmodel.zonesCollection.length + soilmodel.layersCollection.length;

  return (
      <Segment color={'grey'}>
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
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Menu
                fluid={true}
                vertical={true}
                tabular={true}
              >
                <Menu.Item>&nbsp;</Menu.Item>
                {menuItems.map((i) =>
                  <Menu.Item
                    key={i.id}
                    active={i.id === selected}
                    onClick={handleChangeSelected(i.id)}
                  >
                    {i.name}
                  </Menu.Item>
                )}
              </Menu>
            </Grid.Column>
            <Grid.Column width={13}>
              {renderDetails(selected)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
  );
};

export default Discretization;
