import {ILegendItemDiscrete} from '../../../services/rainbowvis/types';
import React from 'react';

const styles: { [name: string]: React.CSSProperties } = {
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
        lineHeight: '20px',
        marginLeft: '0.5em'
    }
};

interface IProps {
    horizontal?: boolean;
    legend: ILegendItemDiscrete[];
    unit?: string;
}

const ColorLegend = (props: IProps) => {
    const {horizontal, legend, unit} = props;

    if (horizontal) {
        return (
            <div>
                <div style={styles.horizontal}>
                    <ul style={styles.legend}>
                        {legend.map((item, index) => <li key={index} style={styles.legendLi}>
                            <span
                                style={{
                                    ...styles.legendSpan,
                                    backgroundColor: item.color
                                }}
                            /> {item.label} {unit}
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
                            <span
                                style={{
                                    ...styles.legendSpan,
                                    backgroundColor: item.color
                                }}
                            /> {item.label} {unit}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ColorLegend;
