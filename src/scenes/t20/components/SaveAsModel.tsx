import { BoundaryCollection, ModflowModel } from '../../../core/model/modflow';
import { BoundaryFactory } from '../../../core/model/modflow/boundaries';
import { Button, Icon, List, Message, Modal } from 'semantic-ui-react';
import { IBoundary } from '../../../core/model/modflow/boundaries/Boundary.type';
import { IModflowModel } from '../../../core/model/modflow/ModflowModel.type';
import { IRootReducer } from '../../../reducers';
import { IStressPeriods } from '../../../core/model/modflow/Stressperiods.type';
import { appendBoundaryData } from './appendBoundaryData';
import { cloneToolInstance } from '../../dashboard/commands';
import { fetchApiWithToken, sendCommand } from '../../../services/api';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModflowModelCommand from '../../modflow/commands/modflowModelCommand';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import uuid from 'uuid';

interface IProps {
  onClose: () => void;
}

const SaveAsModel = (props: IProps) => {
  const [appendingStressperiods, setAppendingStressperiods] = useState<boolean>(false);
  const [appendingStressperiodsSuccess, setAppendingStressperiodsSuccess] = useState<boolean>(false);
  const [appendingBoundaries, setAppendingBoundaries] = useState<boolean>(false);
  const [appendingBoundariesSuccess, setAppendingBoundariesSuccess] = useState<boolean>(false);
  const [cloningModel, setCloningModel] = useState<boolean>(false);
  const [cloningModelSuccess, setCloningModelSuccess] = useState<boolean>(false);
  const [fetchingModel, setFetchingModel] = useState<boolean>(false);
  const [fetchingModelSuccess, setFetchingModelSuccess] = useState<boolean>(false);
  const [fetchingBoundaries, setFetchingBoundaries] = useState<boolean>(false);
  const [fetchingBoundariesSuccess, setFetchingBoundariesSuccess] = useState<boolean>(false);

  const [boundaryUpdater, setBoundaryUpdater] = useState<{
    message: string;
    fetching: boolean;
  }>({
    message: 'Start updating Boundaries ...',
    fetching: false,
  });

  const [newModel, setNewModel] = useState<IModflowModel | null>(null);
  const [newBoundaries, setNewBoundaries] = useState<IBoundary[] | null>(null);

  const T20 = useSelector((state: IRootReducer) => state.T20);
  const model = T20.model ? ModflowModel.fromObject(T20.model) : null;

  const appendBoundaries = useCallback(
    (m: ModflowModel, results: { boundaries: IBoundary[]; stressperiods: IStressPeriods }) => {
      const b = results.boundaries.shift();
      if (b) {
        const bi = BoundaryFactory.fromObject(b);
        setBoundaryUpdater({
          message: `Updating boundary ${bi.name}.`,
          fetching: true,
        });
        sendCommand(
          ModflowModelCommand.updateBoundary(m.id, bi),
          () => {
            setBoundaryUpdater({
              message: `Finished updating boundary ${bi.name}.`,
              fetching: true,
            });
            appendBoundaries(m, results);
          },
          (err) => handleError(err)
        );
      } else {
        setAppendingBoundaries(false);
        setAppendingBoundariesSuccess(true);
      }
    },
    []
  );

  const appendStressperiods = useCallback(
    (m: ModflowModel, results: { boundaries: IBoundary[]; stressperiods: IStressPeriods }) => {
      setAppendingStressperiods(true);
      const command = ModflowModelCommand.updateModflowModelDiscretization(
        m.id,
        m.geometry.toObject(),
        m.boundingBox.toObject(),
        m.gridSize.toObject(),
        m.cells.toObject(),
        results.stressperiods,
        m.lengthUnit.toInt(),
        m.timeUnit.toInt(),
        m.rotation,
        m.intersection
      );

      return sendCommand(command, () => {
        setAppendingStressperiods(false);
        setAppendingStressperiodsSuccess(true);

        setAppendingBoundaries(true);
        appendBoundaries(m, results);
      });
    },
    [appendBoundaries]
  );

  useEffect(() => {
    if (newModel && newBoundaries && T20.rtmodelling) {
      const rtm = T20.rtmodelling ? RTModelling.fromObject(T20.rtmodelling) : null;
      if (rtm) {
        const m = ModflowModel.fromObject(newModel);
        const result = appendBoundaryData(BoundaryCollection.fromObject(newBoundaries), m, rtm);

        if (!result) {
          return handleError('ERROR APPENDING BOUNDARY DATA');
        }

        appendStressperiods(m, result);

        setAppendingStressperiods(true);
        const command = ModflowModelCommand.updateModflowModelDiscretization(
          m.id,
          m.geometry.toObject(),
          m.boundingBox.toObject(),
          m.gridSize.toObject(),
          m.cells.toObject(),
          result.stressperiods,
          m.lengthUnit.toInt(),
          m.timeUnit.toInt(),
          m.rotation,
          m.intersection
        );

        return sendCommand(command, () => {
          setAppendingStressperiods(false);
          setAppendingStressperiodsSuccess(true);
        });
      }
    }
  }, [appendStressperiods, newModel, newBoundaries, T20.rtmodelling]);

  if (!model) {
    return null;
  }

  const handleError = (err: any) => {
    console.log({ err });
  };

  const fetchModel = async (id: string) => {
    if (!fetchingModel) {
      setFetchingModel(true);
      try {
        const m = (await fetchApiWithToken(`modflowmodels/${id}`)).data;
        const mfModel = ModflowModel.fromObject(m);
        setNewModel(mfModel.toObject());
        setFetchingModel(false);
        setFetchingModelSuccess(true);

        setFetchingBoundaries(true);

        await fetchBoundaries(m.id);

        setFetchingModelSuccess(true);
      } catch (err) {
        setFetchingModelSuccess(false);
        handleError(err);
      } finally {
        setFetchingModel(false);
      }
    }
  };

  const fetchBoundaries = async (id: string) => {
    try {
      const b = (await fetchApiWithToken(`modflowmodels/${id}/boundaries`)).data;
      const bc = BoundaryCollection.fromQuery(b);
      setNewBoundaries(bc.toObject());
      setFetchingBoundariesSuccess(true);
    } catch (err) {
      setFetchingBoundariesSuccess(false);
      handleError(err);
    } finally {
      setFetchingBoundaries(false);
    }
  };

  const handleSave = () => {
    const newId = uuid.v4();
    setCloningModel(true);
    return sendCommand(
      cloneToolInstance('T03', model.id, newId),
      () => {
        setCloningModel(false);
        setCloningModelSuccess(true);
        fetchModel(newId);
      },
      (err) => {
        setCloningModel(false);
        handleError(err);
      }
    );
  };

  const everythingIsDone = () =>
    !cloningModel && !fetchingModel && !fetchingBoundaries && !appendingStressperiods && !appendingBoundaries;

  const everythingHadSuccess = () =>
    cloningModelSuccess &&
    fetchingModelSuccess &&
    fetchingBoundariesSuccess &&
    appendingStressperiodsSuccess &&
    appendingBoundariesSuccess;

  const renderList = (listItems: Array<{ name: string; loading: boolean; success: boolean | null }>) =>
    listItems.map((item, idx) => (
      <List.Item key={idx}>
        <List.Icon
          name={item.loading ? 'circle notched' : item.success ? 'check circle' : 'remove circle'}
          size={'large'}
          verticalAlign={'middle'}
          loading={item.loading}
        />
        <List.Content>
          <List.Header>{item.name}</List.Header>
        </List.Content>
      </List.Item>
    ));

  const renderBoundaries = () =>
    boundaryUpdater.fetching
      ? `Step 5: Appending Boundaries: ${boundaryUpdater.message}`
      : 'Step 5: Appending Boundaries';

  return (
    <Modal closeIcon onClose={props.onClose} open={true}>
      <Modal.Header>Save as Model</Modal.Header>
      <Modal.Content>
        <List>
          {renderList([
            { name: 'Step 1: Cloning model', loading: cloningModel, success: cloningModelSuccess },
            { name: 'Step 2: Fetching model', loading: fetchingModel, success: fetchingModelSuccess },
            { name: 'Step 3: Fetching Boundaries', loading: fetchingBoundaries, success: fetchingBoundariesSuccess },
            {
              name: 'Step 4: Appending Stressperiods',
              loading: appendingStressperiods,
              success: appendingStressperiodsSuccess,
            },
            { name: renderBoundaries(), loading: appendingBoundaries, success: appendingBoundariesSuccess },
          ])}
        </List>
        {everythingHadSuccess() && (
          <Message
            positive
            icon="check"
            header="Success"
            content="Saving model has been successful. You will find it in your t03 instances in the dashboard."
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.onClose}>{everythingHadSuccess() ? 'Okay' : 'Cancel'}</Button>
        {!everythingHadSuccess() && (
          <Button icon labelPosition="left" loading={!everythingIsDone()} onClick={handleSave} positive>
            <Icon name="play" />
            Run
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default SaveAsModel;
