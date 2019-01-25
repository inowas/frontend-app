import React from 'react';
import Proptypes from 'prop-types';
import {Stressperiods} from 'core/model/modflow';
import {Button, Checkbox, Form, Icon, Popup, Table} from 'semantic-ui-react';
import moment from 'moment/moment';

class StressPeriodsDataTable extends React.Component {
    header = () => (
        <Table.Row>
            <Table.HeaderCell width={6}>Start Date</Table.HeaderCell>
            <Popup
                trigger={<Table.HeaderCell width={1}>tt</Table.HeaderCell>}
                content='Total time'
                hideOnScroll
                size='tiny'
            />
            <Popup
                trigger={<Table.HeaderCell width={1}>pl</Table.HeaderCell>}
                content='Period length'
                hideOnScroll
                size='tiny'
            />
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
        const stressperiods = this.props.stressperiods;
        stressperiods.removeStressPeriod(idx);
        this.props.onChange(stressperiods);
    };

    handleStressperiodChange = (e, props) => {
        const {value, name, idx, checked} = props;
        const stressperiods = this.props.stressperiods;
        const stressperiod = stressperiods.getStressperiodByIdx(idx);

        if (name === 'startDateTime') {
            const date = moment.utc(value);
            stressperiod.totimStart = stressperiods.totimFromDate(date);
        }

        if (name === 'steady') {
            stressperiod[name] = checked;
        }

        stressperiods.updateStressperiodByIdx(idx, stressperiod);
        this.setState({stressperiods: stressperiods.toObject()});
        this.props.onChange(stressperiods);
    };

    addNewStressperiod = (numberOfDays) => {
        const stressperiods = this.props.stressperiods;
        const newStressperiod = stressperiods.last().clone();
        newStressperiod.totimStart = newStressperiod.totimStart + numberOfDays;
        stressperiods.addStressPeriod(newStressperiod);
        stressperiods.recalculateStressperiods();
        this.props.onChange(stressperiods);
    };

    render() {
        const {readOnly} = this.props.readOnly || false;
        const stressperiods = this.props.stressperiods;
        const startDateTime = stressperiods.startDateTime;
        const rows = stressperiods.stressperiods.map((sp, idx) => (
            <Table.Row key={idx + '-' + sp.totim}>
                <Table.Cell>
                    <Form.Input
                        disabled={readOnly || idx === 0}
                        type='date'
                        name={'startDateTime'}
                        idx={idx}
                        value={new moment.utc(startDateTime).add(sp.totimStart, 'days').format('YYYY-MM-DD')}
                        onChange={this.handleStressperiodChange}
                    />
                </Table.Cell>
                <Table.Cell>{sp.totimStart}</Table.Cell>
                <Table.Cell>{sp.perlen}</Table.Cell>
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
                    {!readOnly && <Button basic
                        floated={'right'}
                        icon={'trash'}
                        onClick={() => this.handleRemoveStressperiod(idx)}
                    />}
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
                <Button.Group size={'small'}>
                    <Button icon onClick={() => this.addNewStressperiod(1)}>
                        <Icon name='add circle' /> 1 Day</Button>
                    <Button icon onClick={() => this.addNewStressperiod(30)}>
                        <Icon name='add circle' /> 1 Month</Button>
                    <Button icon onClick={() => this.addNewStressperiod(365)}>
                        <Icon name='add circle' /> 1 Year</Button>
                </Button.Group>
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
