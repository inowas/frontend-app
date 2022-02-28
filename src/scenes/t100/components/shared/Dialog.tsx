import { DragEventHandler, ReactNode, useEffect, useRef, useState } from 'react';
import { Icon, Image } from 'semantic-ui-react';
import { getImage } from '../../assets/images';

interface IProps {
  header: string;
  image?: string;
  content: ReactNode;
  onClose?: () => void;
}

const Dialog = (props: IProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  const handleMouseMove: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (isDragging) {
      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY,
      });
    }
  };

  const toggleIsDragging = () => setIsDragging(!isDragging);

  return (
    <div
      ref={divRef}
      className="ui modal mini active obj-modal-container"
      style={{
        zIndex: isDragging ? 1001 : 1000,
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseDown={toggleIsDragging}
        onMouseUp={toggleIsDragging}
        className="ui header obj-modal-header tiny"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {!!props.image && <Image floated="left" src={getImage(props.image)} size="mini" />}
        {props.header}
        {!!props.onClose && <Icon style={{ float: 'right' }} link name="close" onClick={props.onClose} />}
      </div>
      <div
        className="content obj-modal-body"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {props.content}
      </div>
    </div>
  );
};

export default Dialog;
