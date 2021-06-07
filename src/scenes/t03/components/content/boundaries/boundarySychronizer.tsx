import {Boundary, BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Button, Progress} from 'semantic-ui-react';
import {IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {IBoundaryComparisonItem} from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {ModflowModel} from '../../../../../core/model/modflow';
import {asyncSendCommand, fetchUrl} from '../../../../../services/api';
import {updateBoundaries} from '../../../actions/actions';
import {useDispatch} from 'react-redux';
import AbstractCommand from '../../../../../core/model/command/AbstractCommand';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import React, {useEffect, useState} from 'react';

interface IProps {
  currentBoundaries: BoundaryCollection;
  newBoundaries: BoundaryCollection;
  model: ModflowModel;
  removeExistingBoundaries: boolean;
}

const BoundarySynchronizer = (props: IProps) => {
  const [commands, setCommands] = useState<ModflowModelCommand[]>([]);
  const [commandsErrorSent, setCommandsErrorSent] = useState<number>(0);
  const [commandsSuccessfullySent, setCommandsSuccessfullySent] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [isSynchronizing, setIsSynchronizing] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const boundaryList: IBoundaryComparisonItem[] = props.currentBoundaries.compareWith(
      props.model.stressperiods, props.newBoundaries, props.removeExistingBoundaries
    );
    setCommands(calculateCommands(boundaryList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentBoundaries, props.model, props.newBoundaries, props.removeExistingBoundaries]);

  console.log('SYNCHRONIZER');

  const calculateCommands = (boundaryList: IBoundaryComparisonItem[]) => {
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

        commands.push(ModflowModelCommand.updateBoundary(props.model.id, newBoundary));
      }

      if (item.state === 'add') {
        const newBoundary = props.newBoundaries.findById(item.id);
        if (!(newBoundary instanceof Boundary)) {
          return;
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
      for (const command of commands) {
        try {
          await asyncSendCommand(command);
          setIsSynchronizing((commandsSuccessfullySent + 1 + commandsErrorSent) < commands.length);
          setCommandsSuccessfullySent(commandsSuccessfullySent + 1);
        } catch (e) {
          setIsSynchronizing((commandsSuccessfullySent + 1 + commandsErrorSent) < commands.length);
          setCommandsErrorSent(commandsErrorSent + 1);
        }
      }
    };

    sendCommands(commands).finally(
      () => {
        fetchUrl(`modflowmodels/${props.model.id}/boundaries`,
          (data: IBoundary[]) => dispatch(updateBoundaries(BoundaryCollection.fromQuery(data))));
      }
    );
  };

  if (showProgress) {
    const percent = commandsSuccessfullySent / commands.length * 100;
    return (
      <Progress percent={percent} autoSuccess={true}>
        {percent > 99 ? 'The progress was successful' : 'Synchronizing'}
      </Progress>
    );
  }

  return (
    <Button
      fluid={true}
      positive={true}
      onClick={synchronize}
      loading={isSynchronizing}
      disabled={commands.length === commandsErrorSent + commandsSuccessfullySent}
    >
      Synchronize
    </Button>
  );
}


export default BoundarySynchronizer;

