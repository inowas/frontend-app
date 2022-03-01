import { Image } from 'react-konva';
import { getImage } from '../../assets/images';
import { useState } from 'react';
import GameObject from '../../../../core/marPro/GameObject';
import useImage from '../../hooks/useImage';

interface IProps {
  gameObject: GameObject;
  isDraft?: boolean;
  onDragEnd: (gameObject: GameObject) => void;
  onClick?: (gameObject: GameObject) => void;
}

const InfiltrationPond = (props: IProps) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [image] = useImage(getImage(props.gameObject.type));

  const handleClick = () => {
    if (!props.onClick) {
      return null;
    }
    props.onClick(props.gameObject);
  };

  const handleDragEnd = () => props.onDragEnd(props.gameObject);

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
      onDragEnd={handleDragEnd}
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
