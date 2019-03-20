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
import {flatten, max, min} from 'lodash';
import {GridSize} from '../../../core/model/modflow';
import {Message} from 'semantic-ui-react';

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

const styles = {
    chartTooltip: {
        opacity: '0.8',
        padding: '6px'
    }
};

const renderTooltip = (e, show) => {
    const data = e.payload && e.payload.length >= 1 ? e.payload[0].payload : {name: '', value: 0};
    let name = 'Column';

    if (show === 'row') {
        name = 'Row';
    }

    return (
        <Message size='tiny' color='black' style={styles.chartTooltip}>
            <p>{name} {data.name}</p>
            <Message.Header>{data.value.toFixed(2)}</Message.Header>
        </Message>
    );
};

const ResultsChart = ({data = null, selectedModels = null, globalMinMax = null, row, col, show}) => {

    if (data) {
        const flattenData = flatten(data);
        const minData = Math.floor(min(flattenData));
        const maxData = Math.ceil(max(flattenData));

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
                    <XAxis
                        dataKey="name"
                        domain={['dataMin', 'dataMax']}
                        label={{value: 'X-Axis Label', position: 'insideBottom', offset: -10, fill: '#4C4C4C', fontSize: '13px'}}
                    />
                    <YAxis
                        domain={[minData, maxData]}
                        label={{value: 'Y-Axis Label', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px'}}
                    />
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip
                        content={e => renderTooltip(e, show)}
                    />
                    <ReferenceLine x={referenceTo} stroke="#000" strokeDasharray="3 3"/>
                    <Area type="linear" dataKey="value" stroke="#3ac6ff" fill="#3ac6ff"/>
                </AreaChart>
            </ResponsiveContainer>
        )
    }

    if (selectedModels) {

        if (!globalMinMax) {
            throw new Error('If more then one model in selectedModels, please provide a globalMinMax-Prop');
        }

        let isValid = true;
        selectedModels.forEach(m => {
            isValid = isValid && m.data;
        });

        if (!isValid) {
            return null;
        }

        const [min, max] = globalMinMax;
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
    col: PropTypes.number,
    data: PropTypes.array,
    globalMinMax: PropTypes.array,
    selectedModels: PropTypes.array,
    row: PropTypes.number,
    show: PropTypes.string
};

export default pure(ResultsChart);
