import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area, AreaChart
} from 'recharts';
import {compact, flatten} from 'lodash';

const ResultsChart = ({data, row, col, show}) => {
    const sortedValues = compact(flatten(data)).sort();
    const min = Math.floor(sortedValues[0]);
    const max = Math.ceil(sortedValues[sortedValues.length - 1]);

    let processedData = [];
    let referenceTo;

    if (show === 'row') {
        processedData = data[row].map((v, colIdx) => ({name: colIdx, value: v}));
        referenceTo = col;
    }

    if (show === 'col') {
        processedData = data.map((r, idx) => ({name: idx, value: r[col]})).reverse();
        referenceTo = row;
    }

    console.log(referenceTo, row, col, show);

    return (
        <ResponsiveContainer aspect={1.5}>
            <AreaChart data={processedData}>
                <XAxis dataKey="name" domain={['dataMin', 'dataMax']}/>
                <YAxis domain={[min, max]}/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <ReferenceLine x={referenceTo} stroke="#000" strokeDasharray="3 3"/>
                <Area type="linear" dataKey="value" stroke="#3ac6ff" fill="#3ac6ff" />
            </AreaChart>
        </ResponsiveContainer>
    )
};

ResultsChart.propTypes = {
    data: PropTypes.array,
    row: PropTypes.number,
    col: PropTypes.number,
    show: PropTypes.string
};

export default pure(ResultsChart);
