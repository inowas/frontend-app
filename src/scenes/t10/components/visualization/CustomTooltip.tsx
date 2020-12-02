import {ILegendRowProps} from './types';
import {TooltipProps} from 'recharts';
import React from 'react';
import moment from 'moment';

const styles = {
    customTooltip: {
        margin: 0,
        lineHeight: '24px',
        border: '1px solid #f5f5f5',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px'
    },

    item: {
        borderTop: '1px solid #f5f5f5',
        margin: 0,
        textAlign: 'right' as CanvasTextAlign
    },

    label: {
        margin: 0,
        textAlign: 'center' as CanvasTextAlign
    }
};

type IProps = TooltipProps & {
    legend: {
        [key: string]: ILegendRowProps;
    }
    dateTimeFormat: string;
};

const CustomTooltip = (props: IProps) => {
    if (!props.payload || props.payload.length < 1) {
        return null;
    }

    const renderDate = () => {
        if (!props.label) {
            return null;
        }
        if (typeof props.label === 'number') {
            return moment.unix(props.label).format(props.dateTimeFormat);
        }
        return props.label;
    };

    const renderRow = (row: any, key: number) => {
        return (
            <p key={key} style={{
                ...styles.item,
                color: row.dataKey && row.dataKey in props.legend ? props.legend[row.dataKey].color: '#000000'
            }}>{props.legend[row.dataKey].label}: {typeof row.value === 'number' ? row.value.toFixed(2) : row.value}{props.legend[row.dataKey].unit}</p>
        );
    };

    return (
        <div style={styles.customTooltip}>
            <p style={styles.label}>{renderDate()}</p>
            {props.payload.map((row, key) => renderRow(row, key))}
        </div>
    );
};

export default CustomTooltip;
