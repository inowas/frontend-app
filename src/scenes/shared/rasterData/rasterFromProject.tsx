import Moment from 'moment';
import React, {FormEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Dimmer, DropdownItemProps, DropdownProps, Form, Grid, Loader, Segment} from 'semantic-ui-react';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {Calculation, ModflowModel, Soilmodel} from '../../../core/model/modflow';
import {IPropertyValueObject} from '../../../core/model/types';
import {IRootReducer} from '../../../reducers';
import {fetchCalculationResultsFlow} from '../../../services/api';
import SliderWithTooltip from '../complexTools/SliderWithTooltip';
import {RasterDataMap} from './index';

interface IProps {
    onChange: (data: Array2D<number>) => void;
}

const styles = {
    dot: {
        border: '1px solid #e9e9e9',
        borderRadius: 0,
        marginLeft: 0,
        width: '1px'
    },
    track: {
        backgroundColor: '#e9e9e9'
    }
};

const rasterFromProject = (props: IProps) => {
    const [data, setData] = useState<Array2D<number> | number>();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('results');
    const [parameterOptions, setParameterOptions] = useState<DropdownItemProps[]>([]);
    const [selectedLay, setSelectedLay] = useState<number>(0);
    const [selectedTotim, setSelectedTotim] = useState<number>(0);
    const [selectedParam, setSelectedParam] = useState<string>();
    const [totalTimes, setTotalTimes] = useState<number[] | null>(null);

    const [activeTotim, setActiveTotim] = useState<number>();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const calculation = T03.calculation ? Calculation.fromObject(T03.calculation) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    useEffect(() => {
        setData(undefined);
        if (mode === 'results') {
            return setParameterOptions([
                {key: 0, text: 'head', value: 'head'},
                {key: 1, text: 'drawdown', value: 'drawdown'}
            ]);
        }
        if (mode === 'soilmodel' && soilmodel) {
            const layer = soilmodel.layersCollection.all[selectedLay];
            return setParameterOptions(layer.parameters.map((p) => {
                return {key: p.id, value: p.id, text: p.id};
            }));
        }
        setParameterOptions([]);
    }, [mode, selectedLay]);

    useEffect(() => {
        if (selectedParam && soilmodel && mode === 'soilmodel') {
            const layer = soilmodel.layersCollection.all[selectedLay];
            const param = layer.parameters.filter((p) => p.id === selectedParam);
            setData((param[0].value === null || param[0].value === undefined) &&
            param[0].data.file ? param[0].data.data : param[0].value);
        }
        if (selectedParam && calculation && calculation.times && mode === 'results') {
            if (!totalTimes) {
                setTotalTimes(calculation.times.total_times);
            }
            if (totalTimes) {
                fetchResults(totalTimes[0], selectedParam);
            }
        }
    }, [selectedParam]);

    useEffect(() => {
        if (selectedParam && totalTimes) {
            fetchResults(totalTimes[0], selectedParam);
        }
    }, [totalTimes]);

    useEffect(() => {
        if (selectedParam && selectedTotim) {
            fetchResults(selectedTotim, selectedParam);
        }
    }, [selectedTotim]);

    useEffect(() => {
        if (Array.isArray(data)) {
            props.onChange(data);
        }
        if (model && typeof data === 'number') {
            props.onChange(
                new Array(model.gridSize.nY).fill(data).map(
                    () => new Array(model.gridSize.nX).fill(data)
                ) as Array2D<number>
            );
        }
    }, [data]);

    const fetchResults = (totim: number, type: string) => {
        if (calculation && selectedParam && totalTimes) {
            setIsFetching(true);
            fetchCalculationResultsFlow(
                {calculationId: calculation.id, layer: selectedLay, totim, type},
                (cData: Array2D<number>) => {
                    setData(cData);
                    setIsFetching(false);
                },
                (e: any) => console.log(e)
            );
        }
    };

    if (!soilmodel || !calculation || !model) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const handleChangeLayer = (e: FormEvent<HTMLElement>, {value}: DropdownProps) => {
        if (typeof value === 'number') {
            return setSelectedLay(value);
        }
    };

    const handleChangeMode = (e: FormEvent<HTMLElement>, {value}: DropdownProps) => {
        if (typeof value === 'string') {
            return setMode(value);
        }
    };

    const handleChangeParameter = (e: FormEvent<HTMLElement>, {value}: DropdownProps) => {
        if (typeof value === 'string') {
            return setSelectedParam(value);
        }
    };

    const handleAfterChangeSlider = () => {
        if (activeTotim) {
            setSelectedTotim(activeTotim);
        }
        setActiveTotim(undefined);
    };

    const handleChangeSlider = (value: number) => {
        if (!totalTimes) {
            return null;
        }

        const closest = totalTimes.reduce((prev, curr) => {
            return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
        });

        return setActiveTotim(closest);
    };

    const formatTimestamp = (key: number) => () => {
        if (!totalTimes) {
            return [];
        }
        return Moment.utc(
            model.stressperiods.dateTimes[0]
        ).add(totalTimes[key], 'days').format('L');
    };

    const sliderMarks = () => {
        const maxNumberOfMarks = 10;
        if (!totalTimes) {
            return [];
        }
        let cTotalTimes = totalTimes;

        if (cTotalTimes.length > maxNumberOfMarks) {
            const minTotim = Math.floor(cTotalTimes[0]);
            const maxTotim = Math.ceil(cTotalTimes[cTotalTimes.length - 1]);
            const dTotim = Math.round((maxTotim - minTotim) / maxNumberOfMarks);

            cTotalTimes = new Array(maxNumberOfMarks).fill(0).map((value, key) => (minTotim + key * dTotim));
            cTotalTimes.push(maxTotim);
        }

        const cMarks: IPropertyValueObject = {};
        cTotalTimes.forEach((value) => {
            cMarks[value] = value;
        });
        return cMarks;
    };

    return (
        <Form>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Form.Select
                            fluid={true}
                            label="Import from"
                            options={[
                                {key: 'results', text: 'Results', value: 'results'},
                                {key: 'soilmodel', text: 'Soilmodel', value: 'soilmodel'}
                            ]}
                            onChange={handleChangeMode}
                            value={mode}
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Form.Select
                            fluid={true}
                            label="Layer"
                            options={soilmodel.layersCollection.all.map((l, key) => {
                                return {
                                    key: l.id, text: l.name, value: key
                                };
                            })}
                            onChange={handleChangeLayer}
                            value={selectedLay}
                            styles={{zIndex: 9999}}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Form.Select
                            fluid={true}
                            label="Parameter"
                            options={parameterOptions}
                            onChange={handleChangeParameter}
                            value={selectedParam}
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {mode === 'results' && totalTimes &&
                        <Form.Field>
                            <label>Stressperiod</label>
                            <SliderWithTooltip
                                dots={totalTimes.length < 20}
                                dotStyle={styles.dot}
                                trackStyle={styles.track}
                                defaultValue={selectedTotim}
                                min={Math.floor(totalTimes[0])}
                                max={Math.ceil(totalTimes[totalTimes.length - 1])}
                                marks={sliderMarks()}
                                value={activeTotim ? activeTotim : selectedTotim}
                                onAfterChange={handleAfterChangeSlider}
                                onChange={handleChangeSlider}
                                tipFormatter={formatTimestamp(totalTimes.indexOf(selectedTotim))}
                                style={{marginTop: '5px'}}
                            />
                        </Form.Field>
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {isFetching &&
                        <Dimmer active={true} inverted={true}>
                            <Loader inverted={true}>Loading</Loader>
                        </Dimmer>
                        }
                        {data !== undefined &&
                        <RasterDataMap
                            model={model}
                            data={data}
                            unit={''}
                        />
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    );
};

export default rasterFromProject;
