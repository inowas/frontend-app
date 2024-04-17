import { Boundary, BoundaryCollection } from '../../../../../core/model/modflow/boundaries';
import { Button, Progress } from 'semantic-ui-react';
import { IBoundary } from '../../../../../core/model/modflow/boundaries/Boundary.type';
import { IBoundaryComparisonItem } from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import { ModflowModel } from '../../../../../core/model/modflow';
import { asyncSendCommand, fetchUrl } from '../../../../../services/api';
import { updateBoundaries } from '../../../actions/actions';
import { useDispatch } from 'react-redux';
import AbstractCommand from '../../../../../core/model/command/AbstractCommand';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import React, { useEffect, useState } from 'react';

interface IProps {
  currentBoundaries: BoundaryCollection;
  newBoundaries: BoundaryCollection;
  model: ModflowModel;
  removeExistingBoundaries: boolean;
  recalculateActiveCells: boolean;
}

const BoundarySynchronizer = (props: IProps) => {
  const [commands, setCommands] = useState<ModflowModelCommand[]>([]);
  const [commandsSent, setCommandsSent] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [isSynchronizing, setIsSynchronizing] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const boundaryList: IBoundaryComparisonItem[] = props.currentBoundaries.compareWith(
      props.model.stressperiods, props.newBoundaries, props.removeExistingBoundaries, props.recalculateActiveCells,
    );
    setCommands(calculateCommands(boundaryList, props.recalculateActiveCells));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentBoundaries, props.model, props.newBoundaries, props.removeExistingBoundaries, props.recalculateActiveCells]);

  const calculateCommands = (boundaryList: IBoundaryComparisonItem[], recalculateActiveCells: boolean) => {
    const commands: ModflowModelCommand[] = [];
    boundaryList.forEach((item) => {
      if (item.state === 'noUpdate') {
        return;
      }

      if (item.state === 'update') {
        const newBoundary = props.newBoundaries.findById(item.id);
        if (!(newBoundary instanceof Boundary)) {
          return;
        }

        if (recalculateActiveCells) {
          newBoundary.recalculateCells(props.model.boundingBox, props.model.gridSize);
        }

        commands.push(ModflowModelCommand.updateBoundary(props.model.id, newBoundary));
      }

      if (item.state === 'add') {
        const newBoundary = props.newBoundaries.findById(item.id);
        if (!(newBoundary instanceof Boundary)) {
          return;
        }

        if (recalculateActiveCells) {
          newBoundary.recalculateCells(props.model.boundingBox, props.model.gridSize);
        }

        commands.push(ModflowModelCommand.addBoundary(props.model.id, newBoundary));
      }

      if (item.state === 'delete') {
        commands.push(ModflowModelCommand.removeBoundary(props.model.id, item.id));
      }
    });

    return commands;
  };

  const synchronize = () => {
    setShowProgress(true);
    setIsSynchronizing(true);

    const sendCommands = async (commands: AbstractCommand[]) => {
      let numberOfSentCommands = 0;
      for (const command of commands) {
        try {
          await asyncSendCommand(command);
        } catch (e) {
          console.error(e);
        } finally {
          setCommandsSent(numberOfSentCommands++);
          setIsSynchronizing(numberOfSentCommands < commands.length);
        }
      }

      setShowProgress(false);
      setIsSynchronizing(false);
      setCommandsSent(commands.length);
    };

    sendCommands(commands).finally(
      () => {
        fetchUrl(`modflowmodels/${props.model.id}/boundaries`,
          (data: IBoundary[]) => dispatch(updateBoundaries(BoundaryCollection.fromQuery(data))));
      },
    );
  };

  if (showProgress) {
    const percent = (commandsSent / commands.length) * 100;
    return (
      <Progress percent={percent} autoSuccess={true}>
        {percent > 99 ? 'The progress was successful' : 'Synchronizing'}
      </Progress>
    );
  }

  const synchronizationHasFinished = commands.length === commandsSent;
  const nothingToSynchronize = commands.length === 0;

  return (
    <Button
      fluid={true}
      color={synchronizationHasFinished ? 'green' : 'blue'}
      onClick={synchronize}
      loading={isSynchronizing}
      disabled={synchronizationHasFinished || nothingToSynchronize}
    >
      {nothingToSynchronize ? 'Nothing to synchronize' : ''}
      {synchronizationHasFinished ? 'Synchronized' : 'Synchronize'}
    </Button>
  );
};


export default BoundarySynchronizer;

