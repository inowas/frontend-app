import React from 'react';
import {connect} from 'react-redux';
import {Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis} from 'recharts';
import {Checkbox, CheckboxProps, Grid, Header, Icon, List, Segment} from 'semantic-ui-react';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {fetchCalculationResultsBudget} from '../../../../../services/api';
import ResultsSelectorBudget from '../../../../shared/complexTools/ResultsSelectorBudget';
import * as colors from '../../../defaults/colorScales';

type budgetType = 'cumulative' | 'incremental';

type IBudgetData = {[key in budgetType]: { [key: string]: number }};

interface IBudgetResultsProps {
    calculation: Calculation | null;
    model: ModflowModel;
}

interface IBudgetResultsState {
    data: Array<{ name: string, value: number, active: boolean, position: number }> | null;
    fetching: boolean;
    isError: string | null;
    isLoading: boolean;
    selectedTotim: number;
    selectedType: budgetType;
    totalTimes: number[] | null;
}

class BudgetResults extends React.Component<IBudgetResultsProps, IBudgetResultsState> {
    constructor(props: IBudgetResultsProps) {
        super(props);
        let selectedTotim = 0;
        let totalTimes = null;

        if (props.calculation instanceof Calculation) {
            totalTimes = props.calculation.times.total_times;
            selectedTotim = totalTimes.slice(-1)[0];
        }

        this.state = {
            data: null,
            fetching: true,
            isError: null,
            isLoading: false,
            selectedTotim,
            selectedType: 'cumulative',
            totalTimes
        };
    }

    public componentDidMount() {
        if (!(this.props.calculation instanceof Calculation)) {
            return null;
        }

        this.fetchData({
            totim: this.state.selectedTotim,
            type: this.state.selectedType,
        });
    }

    public fetchData = ({type, totim}: { type: budgetType, totim: number }) => {
        if (!this.props.calculation) {
            return;
        }

        const calculationId = this.props.calculation.id;
        fetchCalculationResultsBudget({calculationId, totim},
            (data: IBudgetData) => this.setState((prevState: IBudgetResultsState) => {
                return {
                    selectedTotim: totim,
                    selectedType: type,
                    data: Object.entries(data[type]).map((arr, key) => {
                        let wasActive = true;
                        if (prevState.data) {
                            wasActive = prevState.data.filter((c) => c.name === arr[0]).length === 1 &&
                                prevState.data.filter((c) => c.name === arr[0])[0].active;
                        }
                        return {
                            name: arr[0],
                            value: arr[1],
                            active: wasActive,
                            position: key
                        };
                    }),
                    fetching: false
                };
            }),
            (e: string) => this.setState({isError: e})
        );
    };

    public handleChangeSelector = ({type, totim}: { type: budgetType, totim: number }) => this.setState({
        selectedType: type,
        selectedTotim: totim
    }, () => this.fetchData({totim, type}));

    public handleChangeCheckbox = (e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        return this.setState((prevState: IBudgetResultsState) => {

            if (!prevState.data) {
                return ({data: null});
            }

            return ({
                data: prevState.data.map((c) => {
                    if (c.name === data.value) {
                        c.active = !c.active;
                    }

                    return c;
                })
            });
        });
    };

    public render() {
        const {model} = this.props;
        const {data, selectedTotim, selectedType, totalTimes} = this.state;

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded={true}>
                    <Grid.Row>
                        <Grid.Column>
                            {totalTimes &&
                            <ResultsSelectorBudget
                                data={{
                                    type: selectedType,
                                    totim: selectedTotim
                                }}
                                onChange={this.handleChangeSelector}
                                stressperiods={model.stressperiods}
                                totalTimes={totalTimes}
                            />
                            }
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column
                                        width={10}
                                    >
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Budget overview</Header>
                                            {data &&
                                            <BarChart
                                                width={500}
                                                height={250}
                                                data={data.filter((c) => c.active)}
                                            >
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis
                                                    dataKey="name"
                                                    hide={true}
                                                    interval={0}
                                                />
                                                <YAxis/>
                                                <Tooltip/>
                                                <Bar dataKey="value" fill="#8884d8">
                                                    {data.filter((c) => c.active).map((c, index) => {
                                                        const color = c.position < colors.misc.length
                                                            ? colors.misc[c.position] : '#000000';
                                                        return <Cell key={index} fill={color}/>;
                                                    })}
                                                </Bar>
                                            </BarChart>
                                            }
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column
                                        width={6}
                                    >
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            {data &&
                                            <List>
                                                {data.map((c, key) =>
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
                                                            onChange={this.handleChangeCheckbox}
                                                            value={c.name}
                                                        />
                                                    </List.Item>
                                                )}
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
    }
}

const mapStateToProps = (state: any) => {
    return {
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
        model: ModflowModel.fromObject(state.T03.model)
    };
};

export default connect(mapStateToProps)(BudgetResults);
