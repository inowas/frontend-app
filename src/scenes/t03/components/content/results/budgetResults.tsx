import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis} from 'recharts';
import {Button, Checkbox, CheckboxProps, Grid, Header, Icon, List, Segment} from 'semantic-ui-react';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {fetchCalculationResultsBudget} from '../../../../../services/api';
import {IBudgetData, IBudgetType} from '../../../../../services/api/types';
import ResultsSelectorBudget from '../../../../shared/complexTools/ResultsSelectorBudget';
import {exportChartData, exportChartImage} from '../../../../shared/simpleTools/helpers';
import * as colors from '../../../defaults/colorScales';

type budgetData = Array<{ name: string, value: number, active: boolean, position: number }> | null;

interface IProps {
    calculation: Calculation | null;
    model: ModflowModel;
}

const budgetResults = (props: IProps) => {
    const [data, setData] = useState<budgetData>(null);
    const [fetching, setFetching] = useState<boolean>(true);
    const [isError, setIsError] = useState<string | null>(null);
    const [selectedTotim, setSelectedTotim] = useState<number>(
        props.calculation && props.calculation.times ? props.calculation.times.total_times.slice(-1)[0] : 0
    );
    const [selectedType, setSelectedType] = useState<IBudgetType>('cumulative');
    const [totalTimes] = useState<number[] | null>(
        props.calculation && props.calculation.times ? props.calculation.times.total_times : []
    );
    const chartRef = useRef<BarChart>(null);
    const {model} = props;

    useEffect(() => {
        if (props.calculation) {
            fetchData({
                totim: selectedTotim,
                type: selectedType,
            });
        }
    }, []);

    const fetchData = ({type, totim}: { type: IBudgetType, totim: number }) => {
        if (!props.calculation) {
            return;
        }

        const calculationId = props.calculation.id;
        if (calculationId) {
            fetchCalculationResultsBudget({calculationId, totim},
                (sData: IBudgetData) => {
                    setSelectedTotim(totim);
                    setSelectedType(type);
                    setData(
                        Object.entries(sData[type]).map((arr, key) => {
                            let wasActive = true;
                            if (data) {
                                wasActive = data.filter((c) => c.name === arr[0]).length === 1 &&
                                    data.filter((c) => c.name === arr[0])[0].active;
                            }
                            return {
                                name: arr[0],
                                value: typeof arr[1] === 'string' ? parseFloat(arr[1]) : arr[1],
                                active: wasActive,
                                position: key
                            };
                        })
                    );
                    setFetching(false);
                },
                (e: string) => setIsError(e)
            );
        }
    };

    const handleChangeSelector = ({type, totim}: { type: IBudgetType, totim: number }) => {
        setSelectedType(type);
        setSelectedTotim(totim);
        return fetchData({totim, type});
    };

    const handleChangeCheckbox = (e: React.FormEvent<HTMLInputElement>, cData: CheckboxProps) => {
        if (!data) {
            return null;
        }

        if (cData.name === '_all') {
            const setToTrue = data.filter((c) => !c.active).length > 0;
            return setData(data.map((c) => {
                c.active = setToTrue;
                return c;
            }));
        }

        return setData(data.map((c) => {
            if (c.name === cData.value) {
                c.active = !c.active;
            }
            return c;
        }));
    };

    const exportData = () => {
        return chartRef.current ? exportChartData(chartRef.current) : null;
    };

    const exportImage = () => {
        return chartRef.current ? exportChartImage(chartRef.current) : null;
    };

    const yTickFormatter = (value: number) => {
        return value.toExponential(2);
    };

    let dataFiltered: budgetData = [];
    let percentDiscrepancy: budgetData = [];

    if (data) {
        dataFiltered = data.filter((c) => c.active && c.name !== 'PERCENT_DISCREPANCY');
        percentDiscrepancy = data.filter((c) => c.name === 'PERCENT_DISCREPANCY');
    }

    return (
        <Segment color={'grey'}>
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column>
                        {totalTimes &&
                        <ResultsSelectorBudget
                            data={{
                                type: selectedType,
                                totim: selectedTotim
                            }}
                            onChange={handleChangeSelector}
                            stressperiods={model.stressperiods}
                            totalTimes={totalTimes}
                        />
                        }
                        <Grid>
                            <Grid.Row>
                                <Grid.Column
                                    width={10}
                                >
                                    <Segment loading={fetching} color={'blue'}>
                                        <Header textAlign={'center'} as={'h4'}>Budget overview</Header>
                                        {data && dataFiltered &&
                                        <BarChart
                                            width={500}
                                            height={250}
                                            data={dataFiltered}
                                            ref={chartRef}
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis
                                                dataKey="name"
                                                hide={true}
                                                interval={0}
                                            />
                                            <YAxis
                                                tickFormatter={yTickFormatter}
                                            />
                                            <Tooltip/>
                                            <Bar dataKey="value" fill="#8884d8">
                                                {dataFiltered.map((c, index) => {
                                                    const color = c.position < colors.misc.length
                                                        ? colors.misc[c.position] : '#000000';
                                                    return <Cell key={index} fill={color}/>;
                                                })}
                                            </Bar>
                                        </BarChart>
                                        }
                                    </Segment>
                                    {chartRef &&
                                    <div className="downloadButtons">
                                        <Button
                                            compact={true}
                                            basic={true}
                                            icon={true}
                                            size={'small'}
                                            onClick={exportImage}
                                        >
                                            <Icon name="download"/> JPG
                                        </Button>
                                        <Button
                                            compact={true}
                                            basic={true}
                                            icon={true}
                                            size={'small'}
                                            onClick={exportData}
                                        >
                                            <Icon name="download"/> CSV
                                        </Button>
                                    </div>
                                    }
                                </Grid.Column>
                                <Grid.Column
                                    width={6}
                                >
                                    <Segment loading={fetching} color={'blue'}>
                                        {data &&
                                        <List>
                                            {data.filter((c) => c.name !== 'PERCENT_DISCREPANCY').map((c, key) =>
                                                <List.Item
                                                    key={key}
                                                >
                                                    <Checkbox
                                                        checked={c.active}
                                                        label={{
                                                            children:
                                                                <div>
                                                                    <Icon
                                                                        style={{
                                                                            color: c.position < colors.misc.length
                                                                                ? colors.misc[c.position]
                                                                                : '#000000'
                                                                        }}
                                                                        name="circle"
                                                                    />
                                                                    {c.name}
                                                                </div>
                                                        }}
                                                        onChange={handleChangeCheckbox}
                                                        value={c.name}
                                                    />
                                                </List.Item>
                                            )}
                                            <List.Item className="ui divider"/>
                                            <List.Item>
                                                <Checkbox
                                                    checked={data.filter((c) => !c.active).length === 0}
                                                    label="Toggle all"
                                                    onChange={handleChangeCheckbox}
                                                    name="_all"
                                                />
                                            </List.Item>
                                            <List.Item className="ui divider"/>
                                            <List.Item>
                                                <List.Content floated="right">
                                                    {percentDiscrepancy.length > 0 ?
                                                        percentDiscrepancy[0].value.toFixed(4) + ' %' :
                                                        'NO VALUE'}
                                                </List.Content>
                                                <List.Content>Discrepancy:</List.Content>
                                            </List.Item>
                                        </List>
                                        }
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

const mapStateToProps = (state: any) => {
    return {
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
        model: ModflowModel.fromObject(state.T03.model)
    };
};

export default connect(mapStateToProps)(budgetResults);
