import PropTypes from 'prop-types';
import React from 'react';

const styles = {
    legend: {
        margin: '5px',
        padding: 0,
        listStyle: 'none'
    },
    legendSpan: {
        float: 'left',
        width: '20px',
        height: '12px',
        margin: '2px'
    },
    vertical: {
        position: 'absolute',
        display: 'flex',
        zIndex: 1000,
        bottom: 0,
        left: 0,
        marginLeft: '0.5em'
    }
};

class ColorLegend extends React.Component {
    render() {
        const {legend} = this.props;

        return (
            <div>
                <div style={styles.vertical}>
                    <ul style={styles.legend}>
                        {Object.keys(legend).map((key, index) =>
                            <li key={index}>
                            <span style={{
                                ...styles.legendSpan,
                                backgroundColor: legend[key]
                            }}/> {key}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

ColorLegend.propTypes = {
    legend: PropTypes.object
};

export default ColorLegend;
