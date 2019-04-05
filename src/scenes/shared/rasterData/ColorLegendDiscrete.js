import PropTypes from 'prop-types';
import React from 'react';

const styles = {
    horizontal: {
        height: '12px'
    },
    legend: {
        margin: '5px',
        padding: 0,
        listStyle: 'none'
    },
    legendLi: {
        float: 'left',
        marginRight: '10px'
    },
    legendSpan: {
        float: 'left',
        width: '20px',
        height: '12px',
        margin: '4px',
        border: '1px solid grey'
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
        const {horizontal, legend, unit} = this.props;

        if (horizontal) {
            return (
                <div>
                    <div style={styles.horizontal}>
                        <ul style={styles.legend}>
                            {legend.map((item, index) => <li key={index} style={styles.legendLi}>
                            <span style={{
                                ...styles.legendSpan,
                                backgroundColor: item.color
                            }}/> {item.label} {unit}
                            </li>)}
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div style={styles.vertical}>
                    <ul style={styles.legend}>
                        {legend.map((item, index) =>
                            <li key={index}>
                            <span style={{
                                ...styles.legendSpan,
                                backgroundColor: item.color
                            }}/> {item.label} {unit}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

ColorLegend.propTypes = {
    horizontal: PropTypes.bool,
    legend: PropTypes.array.isRequired,
    unit: PropTypes.string
};

export default ColorLegend;
