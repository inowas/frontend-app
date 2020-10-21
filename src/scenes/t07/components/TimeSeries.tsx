import { upperFirst } from 'lodash';
import moment from 'moment';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Dimmer, DropdownProps, Form, Grid, Loader, Segment } from 'semantic-ui-react';
import { Array2D } from '../../../core/model/geometry/Array2D.type';
import { BoundaryCollection, ModflowModel } from '../../../core/model/modflow';
import { IBoundary } from '../../../core/model/modflow/boundaries/Boundary.type';
import { ICalculation } from '../../../core/model/modflow/Calculation.type';
import { IModflowModel } from '../../../core/model/modflow/ModflowModel.type';
import { ISoilmodel } from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import { ScenarioAnalysis } from '../../../core/model/scenarioAnalysis';
import { axios } from '../../../services';
import { MODFLOW_CALCULATION_URL } from '../../../services/api';
import { EResultType } from '../../t03/components/content/results/flowResults';
import { heatMapColors } from '../../t05/defaults/gis';
import { CallbackFunction, ErrorCallbackFunction } from '../../types';
import TimeSeriesMap from './TimeSeriesMap';

interface IProps {
    models: { [id: string]: IModflowModel };
    boundaries: { [id: string]: IBoundary[] };
    calculations: { [id: string]: ICalculation };
    scenarioAnalysis: ScenarioAnalysis;
    selected: string[];
    soilmodels: { [id: string]: ISoilmodel };
}

const TimeSeries = (props: IProps) => {
    // const [data, setData] = useState<{ [id: string]: Array2D<number> }>({});

    const [data, setData] = useState<Array<{ [key: string]: number }>>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCol, setSelectedCol] = useState<number>(0);
    const [selectedLay, setSelectedLay] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);
    const [selectedModels, setSelectedModels] = useState<IModflowModel[]>([]);

    useEffect(() => {
        setSelectedModels(props.selected.map((id) => props.models[id]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selected]);

    useEffect(() => {
        if (!isLoading && selectedModels.length > 0) {
            setIsLoading(true);
            fetchDataRecursive(selectedLay, selectedType, selectedRow, selectedCol);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedModels, selectedCol, selectedLay, selectedRow, selectedType]);

    const fetchTimeseries = (
        calculationId: string,
        type: string,
        layer: number,
        row: number,
        column: number,
        onSuccess: CallbackFunction<Array2D<number>, void>,
        onError: ErrorCallbackFunction
    ) => {
        // tslint:disable-next-line: max-line-length
        const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/timeseries/types/${type}/layers/${layer}/rows/${row}/columns/${column}`;

        return axios.request({
            method: 'GET',
            url,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            data: {}
        }).then((response) => response.data).then(onSuccess).catch(onError);
    };

    const fetchDataRecursive = (
        layer = selectedLay,
        type = selectedType,
        row = selectedRow,
        column = selectedCol,
        results: Array<{ [key: string]: number }> = []
    ) => {
        const modelToFetch = selectedModels.filter((m) => results.filter((r) => r.hasOwnProperty(m.id)).length === 0);
        if (modelToFetch.length === 0) {
            setIsLoading(false);
            return setData(results);
        }

        let cData = results;
        fetchTimeseries(
            modelToFetch[0].calculation_id,
            type,
            layer,
            row,
            column,
            (d) => {
                if (!Array.isArray(d)) {
                    throw new Error('Data must be typeof Array!');
                }
                d.forEach((dr) => {
                    let xExists = false;
                    cData = cData.map((r) => {
                        if (r.x === dr[0]) {
                            r[modelToFetch[0].id] = dr[1];
                            xExists = true;
                        }
                        return r;
                    });
                    if (!xExists) {
                        cData.push({
                            x: dr[0],
                            [modelToFetch[0].id]: dr[1]
                        });
                    }
                });
                return fetchDataRecursive(layer, type, row, column, cData);
            }, () => {
                setIsLoading(false);
            });
    };

    const handleChangeLayer = (e: SyntheticEvent, { value }: DropdownProps) => {
        if (typeof value === 'number') {
            return setSelectedLay(value);
        }
        if (typeof value === 'string') {
            return setSelectedLay(parseInt(value, 10));
        }
    };

    const handleChangeType = (e: SyntheticEvent, { value }: DropdownProps) => {
        if (typeof value === 'string') {
            return setSelectedType(value as EResultType);
        }
    };

    const renderMap = () => {
        const basemodel = props.models[props.selected[0]];

        if (!props.boundaries[basemodel.id]) {
            return null;
        }

        return (
            <Segment color="grey">
                <TimeSeriesMap
                    activeCell={[selectedCol || 0, selectedRow || 0]}
                    boundaries={BoundaryCollection.fromObject(props.boundaries[basemodel.id])}
                    model={ModflowModel.fromObject(basemodel)}
                    onClick={(colRow) => {
                        setSelectedCol(colRow[0]);
                        setSelectedRow(colRow[1]);
                    }}
                />
            </Segment>
        );
    };

    const renderResults = () => {
        if (Object.keys(data).length === 0) {
            return null;
        }

        const basemodel = ModflowModel.fromObject(props.models[props.selected[0]]);

        return (
            <Segment color="grey">
                <ResponsiveContainer aspect={1.5}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="x"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(ts) =>
                                moment.utc(basemodel.stressperiods.startDateTime).add(ts, 'days').format('YYYY-MM-DD')}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip
                            label="Time"
                        />
                        {selectedModels.map((m, idx) => (
                            <Line
                                key={m.id}
                                name={m.name}
                                type="linear"
                                dataKey={m.id}
                                dot={false}
                                stroke={heatMapColors.discrete[idx + idx * 4]}
                            />
                        )).reverse()}

                    </LineChart>
                </ResponsiveContainer>
            </Segment>
        );
    };

    const renderSelector = () => {
        const basemodel = props.models[props.selected[0]];
        const soilmodel = props.soilmodels[basemodel.id];

        const typeOptions = [
            { key: EResultType.HEAD, value: EResultType.HEAD, text: upperFirst(EResultType.HEAD) },
            { key: EResultType.DRAWDOWN, value: EResultType.DRAWDOWN, text: upperFirst(EResultType.DRAWDOWN) }
        ];

        const layerOptions = soilmodel.layers.map((l, idx) => {
            return { key: l.id, value: idx, text: l.name };
        });

        return (
            <Segment color={'grey'}>
                <Form>
                    <Form.Group inline={true}>
                        <label>Select type</label>
                        <Form.Dropdown
                            selection={true}
                            style={{ zIndex: 1002, minWidth: '8em' }}
                            options={typeOptions}
                            value={selectedType}
                            onChange={handleChangeType}
                        />
                    </Form.Group>
                    <Form.Select
                        loading={!soilmodel}
                        style={{ zIndex: 1001 }}
                        fluid={true}
                        options={layerOptions}
                        value={selectedLay}
                        name={'affectedLayers'}
                        onChange={handleChangeLayer}
                        placeholde="Select Layer"
                    />
                </Form>
            </Segment>
        );
    };

    if (props.selected.length === 0) {
        return (
            <Segment color={'red'}>
                Selected at least one model!
            </Segment>
        );
    }

    return (
        <div>
            <Segment color={'grey'}>
                <Grid columns={2}>
                    <Grid.Row stretched={true}>
                        <Grid.Column width={6}>
                            {renderSelector()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            {renderMap()}
            {renderResults()}
            <Dimmer active={isLoading} inverted={true}>
                <Loader>Loading</Loader>
            </Dimmer>
        </div>
    );
};

export default TimeSeries;
