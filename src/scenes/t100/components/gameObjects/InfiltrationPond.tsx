import { IGameObject } from '../../../../core/marPro/GameObject.type';
import { Image } from 'react-konva';
import { useState } from 'react';
import img from '../../assets/well.png';
import useImage from '../../hooks/useImage';

interface IProps {
  gameObject: IGameObject;
  isDraft?: boolean;
  onClick: (gameObject: IGameObject) => void;
}

const InfiltrationPond = (props: IProps) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [image] = useImage(img);

  const handleClick = () => props.onClick(props.gameObject);

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

  return (
    <Image
      draggable
      image={image}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      opacity={props.isDraft ? 0.5 : 1}
      shadowEnabled={isHighlighted}
      shadowColor={isHighlighted ? 'white' : undefined}
      shadowBlur={15}
      shadowOpacity={1}
      shadowOffsetX={0}
      shadowOffsetY={0}
      x={props.gameObject.location.x}
      y={props.gameObject.location.y}
      width={44}
      height={30}
    />
  );
};

export default InfiltrationPond;
