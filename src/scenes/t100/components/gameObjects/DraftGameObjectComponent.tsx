import { Image } from 'react-konva';
import { getImage } from '../../assets/images';
import DraftGameObject from '../../../../core/marPro/DraftGameObject';
import useImage from '../../hooks/useImage';

interface IProps {
  gameObject: DraftGameObject;
  onClick: () => any;
}

const DraftGameObjectComponent = (props: IProps) => {
  const [image] = useImage(getImage(props.gameObject.image));

  return (
    <Image
      image={image}
      onClick={props.onClick}
      opacity={0.5}
      x={props.gameObject.location.x}
      y={props.gameObject.location.y}
      width={44}
      height={30}
    />
  );
};

export default DraftGameObjectComponent;