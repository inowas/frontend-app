import { DragEventHandler, useEffect, useRef, useState } from 'react';

const Dialog = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  const handleMouseMove: DragEventHandler<HTMLDivElement> = (e) => {
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
      style={{
        backgroundColor: '#fff',
        border: '1px solid black',
        height: '300px',
        left: '0px',
        position: 'absolute',
        top: '25px',
        width: '200px',
        zIndex: isDragging ? 1001 : 1000,
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseDown={toggleIsDragging}
        onMouseUp={toggleIsDragging}
        style={{
          backgroundColor: '#0088aa',
          color: '#fff',
          cursor: isDragging ? 'grabbing' : 'grab',
          height: '30px',
        }}
      >
        Dialog
      </div>
      <p>{isDragging ? 'Dragging...' : 'Press to drag'}</p>
    </div>
  );
};

export default Dialog;
