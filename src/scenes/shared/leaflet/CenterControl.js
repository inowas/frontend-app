import React from 'react';
import Control from 'react-leaflet-control';
import PropTypes from 'prop-types';
import {Icon} from 'semantic-ui-react';

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

class CenterControl extends React.Component {
    render() {
        const {bounds, map} = this.props;

        if (!map) {
            return;
        }

        return (
            <Control position="topleft">
                <button
                    onClick={() => map.flyToBounds(bounds)}
                    style={styles.button}
                >
                    <Icon name='crosshairs'/>
                </button>
            </Control>
        );
    }
}

CenterControl.propTypes = {
    bounds: PropTypes.array.isRequired,
    map: PropTypes.object
};

export default CenterControl;
