import { DragEvent } from 'react';
import { Image } from 'semantic-ui-react';
import Dialog from './shared/Dialog';
import cropCitrus from '../../assets/crop-citrus.png';
import infiltrationPond from '../../assets/infiltration-pond.png';
import well from '../../assets/well.png';

interface IProps {
  onDrag: (e: DragEvent<HTMLDivElement>) => void;
}

const GameObjectsDialog = (props: IProps) => {
  const renderContent = () => {
    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
      props.onDrag(e);
    };

    return (
      <div>
        <div draggable onDragStart={handleDragStart}>
          <Image src={well} />
        </div>
        <div draggable onDragStart={handleDragStart}>
          <Image src={infiltrationPond} />
        </div>
        <div draggable onDragStart={handleDragStart}>
          <Image src={cropCitrus} />
        </div>
      </div>
    );
  };

  return <Dialog header="Toolbox" content={renderContent()} />;
};

export default GameObjectsDialog;
