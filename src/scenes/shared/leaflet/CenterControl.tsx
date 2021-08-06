import {Icon} from 'semantic-ui-react';
import React from 'react';

const styles = {
  button: {
    backgroundColor: '#fff',
    border: '2px solid rgba(0,0,0,0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '2px 0px 0px 4px',
    height: '36px',
    width: '34px'
  }
};

interface IProps {
  bounds: Array<[number, number]>;
  map: any;
}

const centerControl = (props: IProps) => {
  const {bounds, map} = props;

  const handleClick = () => {
    return map.leafletElement.flyToBounds(bounds);
  };

  return (
    <button
      onClick={handleClick}
      style={styles.button}
    >
      <Icon name="crosshairs"/>
    </button>
  );
};

export default centerControl;
