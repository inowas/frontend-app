import {DurationInputArg1, DurationInputArg2} from 'moment';
import moment from 'moment/moment';
import React, {ChangeEvent, MouseEvent} from 'react';
import {Button, Checkbox, CheckboxProps, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import {Stressperiods} from '../../../../../core/model/modflow';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';

interface IProps {
    stressperiods: Stressperiods;
    readOnly: boolean;
    onChange?: (stressperiods: Stressperiods) => void;
}

interface IState {
    stressperiods: IStressPeriods;
}

class StressPeriodsDataTable extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            stressperiods: props.stressperiods.toObject()
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            stressperiods: nextProps.stressperiods.toObject()
        });
    }

    public header = () => (
        <Table.Row>
            <Table.HeaderCell width={6}>Start Date</Table.HeaderCell>
            <Popup
                trigger={<Table.HeaderCell width={2}>nstp</Table.HeaderCell>}
                content="No. of time steps"
                hideOnScroll={true}
                size="tiny"
            />
            <Popup
                trigger={<Table.HeaderCell width={2}>tsmult</Table.HeaderCell>}
                content="Time step multiplier"
                hideOnScroll={true}
                size="tiny"
            />
            <Popup
                trigger={<Table.HeaderCell width={2}>steady</Table.HeaderCell>}
                content="State of stress period"
                hideOnScroll={true}
                size="tiny"
            />
            <Table.HeaderCell width={2}/>
        </Table.Row>
    );

    public handleRemoveStressperiod = (idx: number) => () => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        if (stressperiods.count > 1) {
            stressperiods.removeStressPeriod(idx);
            if (this.props.onChange) {
                this.props.onChange(stressperiods);
            }
        }
    };

    public handleStressperiodChange = (
        e: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLInputElement>,
        {value, name, idx, checked}: InputOnChangeData | CheckboxProps
    ) => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const stressperiod = stressperiods.getStressperiodByIdx(idx);

        if (name === 'startDateTime') {
            stressperiod.startDateTime = moment.utc(value);
        }

        if (name === 'steady') {
            stressperiod.steady = checked;
        }

        stressperiods.updateStressperiodByIdx(idx, stressperiod);
        if (this.props.onChange) {
            return this.props.onChange(stressperiods);
        }
    };

    public handleChange = (idx: number) => () => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        if (moment(stressperiods.dateTimes[idx]) <= stressperiods.startDateTime) {
            const edited = stressperiods.stressperiods[idx];
            edited.startDateTime = moment.utc(stressperiods.startDateTime).add(1, 'days');
            stressperiods.updateStressperiodByIdx(idx, edited);
        }

        if (this.props.onChange) {
            return this.props.onChange(stressperiods);
        }
    };

    public addNewStressperiod = (value: DurationInputArg1, unit: DurationInputArg2) => () => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const newStressperiod = stressperiods.last().clone();
        newStressperiod.startDateTime = moment.utc(stressperiods.last().startDateTime).add(value, unit);
        stressperiods.addStressPeriod(newStressperiod);
        if (this.props.onChange) {
            this.props.onChange(stressperiods);
        }
    };

    public render() {
        const readOnly = this.props.readOnly || false;
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const rows = stressperiods.stressperiods.map((sp, idx) => (
            <Table.Row key={idx + '-' + sp.startDateTime.unix()}>
                <Table.Cell>
                    <Form.Input
                        disabled={readOnly || idx === 0}
                        type="date"
                        name={'startDateTime'}
                        idx={idx}
                        value={moment.utc(sp.startDateTime).format('YYYY-MM-DD')}
                        onBlur={this.handleChange(idx)}
                        onChange={this.handleStressperiodChange}
                    />
                </Table.Cell>
                <Table.Cell>{sp.nstp}</Table.Cell>
                <Table.Cell>{sp.tsmult}</Table.Cell>
                <Table.Cell>
                    <Checkbox
                        name={'steady'}
                        checked={sp.steady}
                        disabled={readOnly}
                        idx={idx}
                        onClick={this.handleStressperiodChange}
                    />
                </Table.Cell>
                <Table.Cell>
                    {!readOnly && idx !== 0 &&
                    <Button
                        basic={true}
                        floated={'right'}
                        icon={'trash'}
                        onClick={this.handleRemoveStressperiod(idx)}
                    />
                    }
                </Table.Cell>
            </Table.Row>
        ));

        return (
            <div>
                <Table size={'small'}>
                    <Table.Header>{this.header()}</Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
                {!readOnly &&
                <Button.Group size={'small'}>
                    <Button icon={true} onClick={this.addNewStressperiod(1, 'days')}>
                        <Icon name="add circle"/> 1 Day</Button>
                    <Button icon={true} onClick={this.addNewStressperiod(1, 'months')}>
                        <Icon name="add circle"/> 1 Month</Button>
                    <Button icon={true} onClick={this.addNewStressperiod(1, 'years')}>
                        <Icon name="add circle"/> 1 Year</Button>
                </Button.Group>
                }
            </div>
        );
    }
}

export default StressPeriodsDataTable;
