import { EGameObjectType } from '../../../../core/marPro/GameObject.type';
import { EObjectiveType, IObjectiveState } from '../../../../core/marPro/Objective.type';
import { Group, Image, Text } from 'react-konva';
import { getImage } from '../../assets/images';
import { useState } from 'react';
import useImage from '../../hooks/useImage';

interface IProps {
  objectiveState: IObjectiveState;
  //onClick?: (gameObject: GameObject) => void;
}

const ObservationWell = (props: IProps) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [image] = useImage(getImage(EGameObjectType.OBSERVATION_WELL));

  const handleClick = () => {
    console.log('CLICK');
  };

  const handleMouseOut = (e: any) => {
    const container = e.target.getStage().container();
    container.style.cursor = 'default';
    setIsHighlighted(false);
  };

  const handleMouseOver = (e: any) => {
    const container = e.target.getStage().container();
    container.style.cursor = 'pointer';
    setIsHighlighted(true);
  };

  if (props.objectiveState.objective.type !== EObjectiveType.BY_OBSERVATION) {
    return null;
  }

  return (
    <Group x={props.objectiveState.objective.position.x} y={props.objectiveState.objective.position.y}>
      <Image
        image={image}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        shadowEnabled={isHighlighted}
        shadowColor={isHighlighted ? 'white' : undefined}
        shadowBlur={15}
        shadowOpacity={1}
        shadowOffsetX={0}
        shadowOffsetY={0}
        stroke={props.objectiveState.isAchieved ? 'green' : 'red'}
        width={44}
        height={30}
      />
      {props.objectiveState.value && <Text text={props.objectiveState.value.toFixed(2)} />}
    </Group>
  );
};

export default ObservationWell;
