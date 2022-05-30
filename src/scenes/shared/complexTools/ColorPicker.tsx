import { CSSProperties, useState } from 'react';
import { ColorChangeHandler, SketchPicker } from 'react-color';
import { Form } from 'semantic-ui-react';

interface IProps {
  color?: string;
  onChange: (color: string) => any;
}

const styles = {
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
};

const ColorPicker = (props: IProps) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleChangeColor: ColorChangeHandler = (e) => {
    props.onChange(e.hex);
  };

  const triggerShowPicker = () => setShowPicker(!showPicker);

  return (
    <>
      <Form.Button
        onClick={triggerShowPicker}
        fluid={true}
        style={{ color: props.color }}
        icon="circle"
        label="Color"
        name="name"
        width={3}
      />
      {showPicker && (
        <div style={styles.popover as CSSProperties}>
          <div style={styles.cover as CSSProperties} onClick={triggerShowPicker} />
          <SketchPicker disableAlpha={true} color={props.color} onChange={handleChangeColor} />
        </div>
      )}
    </>
  );
};

export default ColorPicker;
