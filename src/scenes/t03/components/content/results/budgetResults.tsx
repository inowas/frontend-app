import React from 'react';
import {connect} from 'react-redux';
import {Grid, Header, Segment} from 'semantic-ui-react';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import ResultsSelectorBudget from '../../../../shared/complexTools/ResultsSelectorBudget';

type budgetType = 'volume' | 'rates';

interface IBudgetResultsProps {
    calculation: Calculation | null;
    model: ModflowModel;
}

interface IBudgetResultsState {
    fetching: boolean;
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
            fetching: false,
            isLoading: false,
            selectedTotim,
            selectedType: 'volume',
            totalTimes
        };
    }

    public fetchData = ({type, totim}: any) => {
        console.log({type, totim});
    };

    public handleChangeSelector = ({type, totim}: any) => this.setState({
        selectedType: type,
        selectedTotim: totim
    }, () => this.fetchData({totim, type}));

    public render() {
        const {model} = this.props;
        const {selectedTotim, selectedType, totalTimes} = this.state;

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
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
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
