import { Button, Card, Checkbox, Menu } from 'semantic-ui-react';
import { EObjectiveType, IObjectiveState, checkObjective } from '../../../../core/marPro/Objective.type';
import { sendCommand } from '../../../../services/api';
import { useState } from 'react';
import CheckButton from './CheckButton';
import GameState from '../../../../core/marPro/GameState';
import SimpleToolsCommand from '../../../shared/simpleTools/commands/SimpleToolsCommand';

interface IProps {
  gameState: GameState;
}

const Results = (props: IProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleClickSave = () => {
    setIsSaving(true);
    sendCommand(SimpleToolsCommand.updateToolInstance(props.gameState.toToolInstance()), () => {
      setIsSaving(false);
    });
  };

  const renderObjective = (objectiveState: IObjectiveState) => {
    const objective = objectiveState.objective;

    if (objective.type === EObjectiveType.BY_OBSERVATION) {
      return (
        <Menu.Item>
          <Card className="object">
            <Card.Content>
              <Card.Header>
                <Checkbox checked={checkObjective(objectiveState)} />
                {objective.parameter} in {objective.position.x} / {objective.position.y}
              </Card.Header>
            </Card.Content>
            <Card.Content textAlign="center" extra>
              {!objectiveState.value
                ? `must be between ${objective.min} and ${objective.max}`
                : `${objective.min} <= ${objectiveState.value} <= ${objective.max}`}
            </Card.Content>
          </Card>
        </Menu.Item>
      );
    }

    return (
      <Menu.Item>
        <Card className="object">
          <Card.Content>
            <Card.Header>
              <Checkbox checked={objectiveState.isAchieved} />
              {objective.type === EObjectiveType.BY_PARAMETER
                ? `Parameter ${objective.parameterId}`
                : `Resource ${objective.resourceId}`}
            </Card.Header>
          </Card.Content>
          <Card.Content textAlign="center" extra>
            {!objectiveState.value
              ? `must be between ${objective.min} and ${objective.max}`
              : `${objective.min} <= ${objectiveState.value} <= ${objective.max}`}
          </Card.Content>
        </Card>
      </Menu.Item>
    );
  };

  return (
    <Menu className="objects" inverted vertical icon="labeled">
      <Menu.Item className="header">Results</Menu.Item>
      {props.gameState.objectives.map((objective) => renderObjective(objective))}
      <Menu.Item>
        <CheckButton />
      </Menu.Item>
      <Menu.Item>
        <Button color="green" fluid loading={isSaving} onClick={handleClickSave}>
          Save
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default Results;