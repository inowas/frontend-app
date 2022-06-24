import { Image } from 'react-konva';
import useImage from '../hooks/useImage';

interface IProps {
  img: string;
}

const Background = (props: IProps) => {
  const [backgroundImage] = useImage(props.img);
  return <Image image={backgroundImage} />;
};

export default Background;
