import React from 'react';
import Proptypes from 'prop-types';
import {Stressperiods} from '../../../../../core/model/modflow';
import {Button, Checkbox, Form, Icon, Popup, Table} from 'semantic-ui-react';
import moment from 'moment/moment';

class StressPeriodsDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stressperiods: props.stressperiods.toObject()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            stressperiods: nextProps.stressperiods.toObject()
        });
    }

    header = () => (
        <Table.Row>
            <Table.HeaderCell width={6}>Start Date</Table.HeaderCell>
            <Popup
                trigger={<Table.HeaderCell width={2}>nstp</Table.HeaderCell>}
                content='No. of time steps'
                hideOnScroll
                size='tiny'
            />
            <Popup
                trigger={<Table.HeaderCell width={2}>tsmult</Table.HeaderCell>}
                content='Time step multiplier'
                hideOnScroll
                size='tiny'
            />
            <Popup
                trigger={<Table.HeaderCell width={2}>steady</Table.HeaderCell>}
                content='State of stress period'
                hideOnScroll
                size='tiny'
            />
            <Table.HeaderCell width={2}/>
        </Table.Row>
    );

    handleRemoveStressperiod = (idx) => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);

        if (stressperiods.count > 1) {
            stressperiods.removeStressPeriod(idx);
            this.props.onChange(stressperiods);
        }
    };

    handleStressperiodChange = (e, props) => {
        const {value, name, idx, checked} = props;
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const stressperiod = stressperiods.getStressperiodByIdx(idx);

        if (name === 'startDateTime') {
            stressperiod.startDateTime = moment.utc(value);
        }

        if (name === 'steady') {
            stressperiod[name] = checked;
        }

        stressperiods.updateStressperiodByIdx(idx, stressperiod);
        return this.setState({
            stressperiods: stressperiods.toObject()
        });
    };

    handleChange = (e, props) => {
        const {idx} = props;
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        if (moment(stressperiods.dateTimes[idx]) <= stressperiods.startDateTime) {
            const edited = stressperiods.stressperiods[idx];
            edited.startDateTime = moment.utc(stressperiods.startDateTime).add(1, 'days');
            stressperiods.updateStressperiodByIdx(idx, edited);
        }

        return this.props.onChange(stressperiods);
    };

    addNewStressperiod = numberOfDays => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const newStressperiod = stressperiods.last().clone();
        newStressperiod.startDateTime = moment.utc(stressperiods.last().startDateTime).add(numberOfDays, 'days');
        stressperiods.addStressPeriod(newStressperiod);
        stressperiods.recalculateStressperiods();
        this.props.onChange(stressperiods);
    };

    render() {
        const readOnly = this.props.readOnly || false;
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const rows = stressperiods.stressperiods.map((sp, idx) => (
            <Table.Row key={idx + '-' + sp.totim}>
                <Table.Cell>
                    <Form.Input
                        disabled={readOnly || idx === 0}
                        type='date'
                        name={'startDateTime'}
                        idx={idx}
                        value={moment.utc(sp.startDateTime).format('YYYY-MM-DD')}
                        onBlur={e => this.handleChange(e, {idx})}
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
                    <Button basic
                            floated={'right'}
                            icon={'trash'}
                            onClick={() => this.handleRemoveStressperiod(idx)}
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
                    <Button icon onClick={() => this.addNewStressperiod(1)}>
                        <Icon name='add circle'/> 1 Day</Button>
                    <Button icon onClick={() => this.addNewStressperiod(30)}>
                        <Icon name='add circle'/> 1 Month</Button>
                    <Button icon onClick={() => this.addNewStressperiod(365)}>
                        <Icon name='add circle'/> 1 Year</Button>
                </Button.Group>
                }
            </div>
        )
    }
}

StressPeriodsDataTable.prototypes = {
    readOnly: Proptypes.bool,
    onChange: Proptypes.func.isRequired,
    stressperiods: Proptypes.instanceOf(Stressperiods).isRequired
};

export default StressPeriodsDataTable;
