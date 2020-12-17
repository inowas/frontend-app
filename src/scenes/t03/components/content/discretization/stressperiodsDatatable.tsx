import {Button, Checkbox, CheckboxProps, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import {DurationInputArg1, DurationInputArg2} from 'moment';
import {Stressperiods} from '../../../../../core/model/modflow';
import React, {ChangeEvent, MouseEvent, useState} from 'react';
import moment from 'moment/moment';

interface IProps {
    stressperiods: Stressperiods;
    readOnly: boolean;
    onChange?: (stressperiods: Stressperiods) => void;
}

// tslint:disable-next-line:variable-name
const StressPeriodsDataTable = (props: IProps) => {
    const [activeSp, setActiveSp] = useState<number | null>(null);
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');
    const [startDateError, setStartDateError] = useState<boolean>(false);

    const renderHeader = () => (
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

    const handleRemoveStressperiod = (idx: number) => () => {
        const stressperiods = props.stressperiods;
        if (stressperiods.count > 1) {
            stressperiods.removeStressPeriod(idx);
            if (props.onChange) {
                props.onChange(stressperiods);
            }
        }
    };

    const handleChangeCheckbox = (e: MouseEvent<HTMLInputElement>, {idx, checked}: CheckboxProps) => {
        const stressperiods = props.stressperiods;
        const edited = stressperiods.stressperiods[idx];
        edited.steady = !!checked;
        stressperiods.updateStressperiodByIdx(idx, edited);
        if (props.onChange) {
            return props.onChange(stressperiods);
        }
    };

    const handleStressperiodChange = (
        e: ChangeEvent<HTMLInputElement>, {value, name, idx}: InputOnChangeData
    ) => {
        setActiveSp(idx);
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleChange = () => {
        setStartDateError(false);
        const stressperiods = props.stressperiods;
        if (activeSp !== null && activeValue) {
            const edited = stressperiods.stressperiods[activeSp];

            if (activeInput === 'startDateTime') {
                edited.startDateTime = moment.utc(activeValue);

                if (activeSp === 0) {
                    stressperiods.startDateTime = moment.utc(activeValue);
                }

                if (activeSp !== 0 && edited.startDateTime.isSameOrBefore(stressperiods.startDateTime)) {
                    setActiveSp(null);
                    setActiveValue('');
                    setActiveInput(null);
                    setStartDateError(true);
                    return;
                }
            }
            if (activeInput === 'nstp') {
                edited.nstp = parseFloat(activeValue);
            }
            if (activeInput === 'tsmult') {
                edited.tsmult = parseFloat(activeValue);
            }

            stressperiods.updateStressperiodByIdx(activeSp, edited);

            setActiveValue('');
            setActiveSp(null);
            setActiveInput(null);

            if (props.onChange) {
                return props.onChange(stressperiods);
            }
        }
    };

    const addNewStressperiod = (value: DurationInputArg1, unit: DurationInputArg2) => () => {
        const stressperiods = props.stressperiods;
        const newStressperiod = stressperiods.last().clone();
        newStressperiod.startDateTime = moment.utc(stressperiods.last().startDateTime).add(value, unit);
        newStressperiod.steady = false;
        stressperiods.addStressPeriod(newStressperiod);
        if (props.onChange) {
            props.onChange(stressperiods);
        }
    };

    const readOnly = props.readOnly || false;
    const rows = props.stressperiods.stressperiods.map((sp, idx) => (
        <Table.Row key={idx + '-' + sp.startDateTime.unix()}>
            <Table.Cell>
                <Popup
                    content="Start date of first stressperiod must be before all other stressperiods"
                    open={idx === 0 && startDateError}
                    position="top center"
                    trigger={
                        <Form.Input
                            disabled={readOnly}
                            type="date"
                            name={'startDateTime'}
                            idx={idx}
                            value={activeInput === 'startDateTime' && activeSp === idx ?
                                activeValue : sp.startDateTime.format('YYYY-MM-DD')}
                            onBlur={handleChange}
                            onChange={handleStressperiodChange}
                        />
                    }
                />
            </Table.Cell>
            <Table.Cell>
                <Form.Input
                    disabled={readOnly}
                    type="number"
                    name="nstp"
                    idx={idx}
                    value={
                        activeInput === 'nstp' && activeSp === idx ? activeValue : sp.nstp
                    }
                    onBlur={handleChange}
                    onChange={handleStressperiodChange}
                />
            </Table.Cell>
            <Table.Cell>
                <Form.Input
                    disabled={readOnly}
                    type="number"
                    name="tsmult"
                    idx={idx}
                    value={
                        activeInput === 'tsmult' && activeSp === idx ? activeValue : sp.tsmult.toFixed(3)
                    }
                    onBlur={handleChange}
                    onChange={handleStressperiodChange}
                />
            </Table.Cell>
            <Table.Cell>
                <Checkbox
                    name={'steady'}
                    checked={sp.steady}
                    disabled={readOnly}
                    idx={idx}
                    onClick={handleChangeCheckbox}
                />
            </Table.Cell>
            <Table.Cell>
                {!readOnly && idx !== 0 &&
                <Button
                    basic={true}
                    floated={'right'}
                    icon={'trash'}
                    onClick={handleRemoveStressperiod(idx)}
                />
                }
            </Table.Cell>
        </Table.Row>
    ));

    return (
        <div>
            <Table size={'small'}>
                <Table.Header>{renderHeader()}</Table.Header>
                <Table.Body>
                    {rows}
                </Table.Body>
            </Table>
            {!readOnly &&
            <Button.Group size={'small'}>
                <Button icon={true} onClick={addNewStressperiod(1, 'days')}>
                    <Icon name="add circle"/> 1 Day</Button>
                <Button icon={true} onClick={addNewStressperiod(1, 'months')}>
                    <Icon name="add circle"/> 1 Month</Button>
                <Button icon={true} onClick={addNewStressperiod(1, 'years')}>
                    <Icon name="add circle"/> 1 Year</Button>
            </Button.Group>
            }
        </div>
    );
};

export default StressPeriodsDataTable;
