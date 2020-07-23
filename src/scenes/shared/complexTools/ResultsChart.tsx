import {flatten, max, min} from 'lodash';
import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    LabelProps,
    Line,
    LineChart,
    ReferenceLine, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis
} from 'recharts';
import {Message} from 'semantic-ui-react';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
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

const styles = {
    chartTooltip: {
        opacity: '0.8',
        padding: '6px'
    }
};

interface IProps {
    col?: number;
    data?: Array2D<number>;
    globalMinMax?: [number, number];
    row?: number;
    selectedModels?: Array<{
        id: string, name: string, data: Array2D<number>
    }>;
    show: string;
    yLabel?: string;
}

const renderTooltip = (show: string) => (e: TooltipProps) => {
    const data = e.payload && e.payload.length >= 1 ? e.payload[0].payload : {name: '', value: 0};
    let name = 'Column';

    if (show === 'row') {
        name = 'Row';
    }

    return (
        <Message size="tiny" color="black" style={styles.chartTooltip}>
            <p>{name} {data.name}</p>
            <Message.Header>{data.value.toFixed(2)}</Message.Header>
        </Message>
    );
};

const getXAxisLabel = (show: string): LabelProps => {
    if (show === 'row') {
        return {value: 'Col', position: 'insideBottom', offset: -10, fill: '#4C4C4C', fontSize: '13px'};
    }

    return {value: 'Row', position: 'insideBottom', offset: -10, fill: '#4C4C4C', fontSize: '13px'};
};

const getYAxisLabel = (type: string): LabelProps => {
    if (type === 'head') {
        return {value: 'Head (m asl)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px'};
    }

    if (type === 'drawdown') {
        return {value: 'Drawdown (m)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px'};
    }

    return {};
};

const resultsChart = ({data, selectedModels, globalMinMax, row, col, show, yLabel = ''}: IProps) => {
    if (data) {
        const flattenData = flatten(data);
        const minData = Math.floor(min(flattenData) || 0);
        const maxData = Math.ceil(max(flattenData) || 0);

        let processedData: Array<{ name: number, value: number }> = [];
        let referenceTo;

        if (show === 'row' && row) {
            processedData = data[row].map((v, colIdx) => ({name: colIdx, value: v}));
            referenceTo = col;
        }

        if (show === 'col' && col) {
            processedData = data.map((r, idx) => ({name: idx, value: r[col]})).reverse();
            referenceTo = row;
        }

        return (
            <ResponsiveContainer aspect={1.5}>
                <AreaChart data={processedData}>
                    <XAxis
                        dataKey="name"
                        domain={['dataMin', 'dataMax']}
                        label={getXAxisLabel(show)}
                    />
                    <YAxis
                        domain={[minData, maxData]}
                        label={getYAxisLabel(yLabel)}
                    />
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip
                        content={renderTooltip(show)}
                    />
                    <ReferenceLine x={referenceTo} stroke="#000" strokeDasharray="3 3"/>
                    <Area type="linear" dataKey="value" stroke="#3ac6ff" fill="#3ac6ff"/>
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    if (selectedModels) {
        if (!globalMinMax) {
            throw new Error('If more then one model in selectedModels, please provide a globalMinMax-Prop');
        }

        let isValid = true;
        selectedModels.forEach((m) => {
            isValid = isValid && Array.isArray(m.data);
        });

        if (!isValid) {
            return null;
        }

        const [minV, maxV] = globalMinMax;
        const gridSize = GridSize.fromData(selectedModels[0].data);
        const {nX, nY} = gridSize;

        const processedData = [];
        let referenceTo;

        if (show === 'row' && row) {
            for (let x = 0; x < nX; x++) {
                const dataValue: { [key: string]: number } = {name: x};
                selectedModels.forEach((m) => {
                    dataValue[m.name] = m.data[row][x];
                });
                processedData.push(dataValue);
            }

            referenceTo = col;
        }

        if (show === 'col' && col) {
            for (let y = 0; y < nY; y++) {
                const dataValue: { [key: string]: number } = {name: y};
                selectedModels.forEach((m) => {
                    dataValue[m.name] = m.data[y][col];
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
                    <YAxis domain={[minV, maxV]}/>
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
        );
    }
    return null;
};

export default resultsChart;
