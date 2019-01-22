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
    Area, AreaChart, Line, LineChart
} from 'recharts';
import {compact, flatten} from 'lodash';
import {GridSize} from '../../../core/model/modflow';

const cbPalette = [
    '#0A75A0' /* navy */,
    '#ED8D05' /* orange */,
    '#009E73' /* green */,
    '#F0E442' /* yellow */,
    '#CC6C00' /* brown */,
    '#1EB1ED' /* blue */,
    '#FF5B4D' /* red */,
    '#999999' /* grey */
];

const ResultsChart = ({data = null, selectedModels = null, row, col, show}) => {

    if (data) {
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

        return (
            <ResponsiveContainer aspect={1.5}>
                <AreaChart data={processedData}>
                    <XAxis dataKey="name" domain={['dataMin', 'dataMax']}/>
                    <YAxis domain={[min, max]}/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <ReferenceLine x={referenceTo} stroke="#000" strokeDasharray="3 3"/>
                    <Area type="linear" dataKey="value" stroke="#3ac6ff" fill="#3ac6ff"/>
                </AreaChart>
            </ResponsiveContainer>
        )
    }

    if (selectedModels) {

        let isValid = true;
        selectedModels.forEach(m => {
            isValid = isValid && m.data;
        });

        if (!isValid) {
            return null;
        }

        const sortedValues = compact(flatten(flatten(selectedModels.map(m => m.data)))).sort();
        const min = Math.floor(sortedValues[0]);
        const max = Math.ceil(sortedValues[sortedValues.length - 1]);
        const gridSize = GridSize.fromData(selectedModels[0].data);
        const {nX, nY} = gridSize;

        let processedData = [];
        let referenceTo;

        if (show === 'row') {
            for (let x = 0; x < nX; x++) {
                const dataValue = {name: x};
                selectedModels.forEach(m => {
                    dataValue[m.name] = m.data[row][x]
                });
                processedData.push(dataValue);
            }

            referenceTo = col;
        }

        if (show === 'col') {
            for (let y = 0; y < nY; y++) {
                const dataValue = {name: y};
                selectedModels.forEach(m => {
                    dataValue[m.name] = m.data[y][col]
                });
                processedData.push(dataValue);
            }

            processedData.reverse();
            referenceTo = row;
        }

        return (
            <ResponsiveContainer aspect={1.5}>
                <LineChart data={processedData}>
                    <XAxis dataKey="name" domain={['dataMin', 'dataMax']}/>
                    <YAxis domain={[min, max]}/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <ReferenceLine x={referenceTo} stroke="#000" strokeDasharray="3 3"/>
                    {selectedModels.map((m, idx) => (
                        <Line
                            key={m.id}
                            type="linear"
                            dataKey={m.name}
                            dot={false}
                            stroke={cbPalette[idx % cbPalette.length]}
                        />
                    )).reverse()}

                </LineChart>
            </ResponsiveContainer>
        )

    }
};

ResultsChart.propTypes = {
    data: PropTypes.array,
    row: PropTypes.number,
    col: PropTypes.number,
    show: PropTypes.string
};

export default pure(ResultsChart);
