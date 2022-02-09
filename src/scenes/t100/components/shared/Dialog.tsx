import { DragEventHandler, ReactNode, useEffect, useRef, useState } from 'react';
import { Icon, Image } from 'semantic-ui-react';
import well from '../../assets/infiltration-pond.png';

interface IProps {
  header: string;
  content: ReactNode;
  onClose: () => void;
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
      className="obj-modal-container"
      style={{
        zIndex: isDragging ? 1001 : 1000,
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseDown={toggleIsDragging}
        onMouseUp={toggleIsDragging}
        className="obj-modal-header"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <Image floated="left" src={well} size="mini" />
        {props.header}
        <Icon style={{ float: 'right' }} link name="close" onClick={props.onClose} />
      </div>
      <div
        className="obj-modal-body"
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
