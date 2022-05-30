import { Image } from 'react-konva';
import { useState } from 'react';
import GameObject from '../../../../core/marPro/GameObject';
import Konva from 'konva';
import river from '../../assets/river.svg';
import useImage from '../../hooks/useImage';

interface IProps {
  gameObject: GameObject;
  onClick: (gameObject: GameObject) => void;
}

const River = (props: IProps) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [image] = useImage(river);

  const drawHitFromCache = (img: Konva.Image) => {
    if (img) {
      img.cache({
        pixelRatio: 4,
      });
      img.drawHitFromCache(0.1);
    }
  };

  const handleRef = (node: Konva.Image) => {
    drawHitFromCache(node);
  };

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
      image={image}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      ref={handleRef}
      shadowEnabled={isHighlighted}
      shadowColor={isHighlighted ? 'white' : undefined}
      shadowBlur={15}
      shadowOpacity={1}
      shadowOffsetX={0}
      shadowOffsetY={0}
      x={108}
      y={0}
      width={825}
      height={664}
    />
  );
};

export default River;
