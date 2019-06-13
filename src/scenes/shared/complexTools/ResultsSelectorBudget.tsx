import Moment from 'moment';
import React from 'react';
import {DropdownProps, Form, Grid, Header, Segment} from 'semantic-ui-react';
import {Soilmodel, Stressperiods} from '../../../core/model/modflow';
import SliderWithTooltip from './SliderWithTooltip';

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

interface IResultsSelectorBudgetProps {
    data: any;
    onChange: (response: any) => any;
    stressperiods: Stressperiods;
    totalTimes: number[] | null;
}

interface IResultsSelectorBudgetState {
    temporaryTotim: number | null;
}

class ResultsSelectorBudget extends React.Component<IResultsSelectorBudgetProps, IResultsSelectorBudgetState> {
    public state = {
        temporaryTotim: null
    };

    public componentDidMount() {
        this.setState({temporaryTotim: this.props.data.totim});
    }

    public componentWillReceiveProps(nextProps: IResultsSelectorBudgetProps) {
        this.setState({temporaryTotim: nextProps.data.totim});
    }

    public typeOptions = () => {
        return [
            {key: 0, value: 'cumulative', text: 'Cumulative Volumes'},
            {key: 1, value: 'incremental', text: 'Rates'}
        ];
    };

    public handleChangeType = (e: React.SyntheticEvent<HTMLElement, Event>, props: DropdownProps) => {
        return this.props.onChange({
            totim: this.state.temporaryTotim,
            type: props.value
        });
    };

    public handleChangeSlider = (value: number) => {
        const {totalTimes} = this.props;

        if (!totalTimes) {
            return;
        }

        const differences = totalTimes.map((tt, idx) => ({id: idx, value: Math.abs(tt - value)}));
        differences.sort((a, b) => a.value - b.value);
        return this.setState({
            temporaryTotim: totalTimes[differences[0].id]
        });
    };

    public handleAfterChangeSlider = () => {
        const {type} = this.props.data;
        const totim = this.state.temporaryTotim;
        return this.props.onChange({totim, type});
    };

    public render() {
        const {temporaryTotim} = this.state;
        const {data, totalTimes} = this.props;
        const {type} = data;

        return (
            <Grid columns={2}>
                <Grid.Row stretched={true}>
                    <Grid.Column width={6}>
                        <Segment color={'grey'}>
                            <Form>
                                <Form.Group inline={true}>
                                    <label>Select type</label>
                                    <Form.Dropdown
                                        selection={true}
                                        style={{zIndex: 1002, minWidth: '8em'}}
                                        options={this.typeOptions()}
                                        value={type}
                                        onChange={this.handleChangeType}
                                    />
                                </Form.Group>
                            </Form>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Segment color={'grey'}>
                            <Header textAlign={'center'} as={'h4'}>Select total time [days]</Header>
                            {totalTimes && temporaryTotim &&
                            <SliderWithTooltip
                                dots={totalTimes.length < 20}
                                dotStyle={styles.dot}
                                trackStyle={styles.track}
                                defaultValue={temporaryTotim}
                                min={totalTimes[0]}
                                max={totalTimes[totalTimes.length - 1]}
                                marks={this.sliderMarks()}
                                value={temporaryTotim}
                                onAfterChange={this.handleAfterChangeSlider}
                                onChange={this.handleChangeSlider}
                                tipFormatter={this.formatTimestamp}
                            />
                            }
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    private sliderMarks = () => {
        const maxNumberOfMarks = 10;
        let {totalTimes} = this.props;

        if (!totalTimes) {
            return;
        }

        if (totalTimes.length > maxNumberOfMarks) {
            const minTotim = totalTimes[0];
            const maxTotim = totalTimes[totalTimes.length - 1];
            const dTotim = Math.round((maxTotim - minTotim) / maxNumberOfMarks);

            totalTimes = new Array(maxNumberOfMarks).fill(0).map((value, key) => (minTotim + key * dTotim));
            totalTimes.push(maxTotim);
        }

        const marks: any = {};
        totalTimes.forEach((value) => {
            marks[value] = value;
        });
        return marks;
    };

    private formatTimestamp = (value: number) => {
        const {totalTimes} = this.props;

        if (!totalTimes) {
            return;
        }

        return Moment.utc(this.props.stressperiods.dateTimes[totalTimes.indexOf(value)]).format('L');
    };
}

export default ResultsSelectorBudget;
