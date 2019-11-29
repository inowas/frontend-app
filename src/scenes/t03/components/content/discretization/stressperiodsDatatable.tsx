import {DurationInputArg1, DurationInputArg2} from 'moment';
import moment from 'moment/moment';
import React, {ChangeEvent, MouseEvent, useState} from 'react';
import {Button, Checkbox, CheckboxProps, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import {Stressperiods} from '../../../../../core/model/modflow';

interface IProps {
    stressperiods: Stressperiods;
    readOnly: boolean;
    onChange?: (stressperiods: Stressperiods) => void;
}

const stressPeriodsDataTable = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<number | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');

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
        e: ChangeEvent<HTMLInputElement>, {value, idx}: InputOnChangeData
    ) => {
        setActiveInput(idx);
        setActiveValue(value);
    };

    const handleChange = () => {
        const stressperiods = props.stressperiods;
        if (activeInput && activeValue) {
            const edited = stressperiods.stressperiods[activeInput];
            edited.startDateTime = moment.utc(activeValue);

            if (edited.startDateTime.isBefore(stressperiods.startDateTime)) {
                edited.startDateTime = moment.utc(stressperiods.startDateTime).add(1, 'days');
            }

            stressperiods.updateStressperiodByIdx(activeInput, edited);

            setActiveValue('');
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
        stressperiods.addStressPeriod(newStressperiod);
        if (props.onChange) {
            props.onChange(stressperiods);
        }
    };

    const readOnly = props.readOnly || false;
    const rows = props.stressperiods.stressperiods.map((sp, idx) => (
        <Table.Row key={idx + '-' + sp.startDateTime.unix()}>
            <Table.Cell>
                <Form.Input
                    disabled={readOnly || idx === 0}
                    type="date"
                    name={'startDateTime'}
                    idx={idx}
                    value={
                        activeInput === idx ? activeValue : moment.utc(sp.startDateTime).format('YYYY-MM-DD')
                    }
                    onBlur={handleChange}
                    onChange={handleStressperiodChange}
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
                <Button icon={true} onClick={() => null}>
                    <Icon name="add circle"/> Custom</Button>
            </Button.Group>
            }
        </div>
    );
};

export default stressPeriodsDataTable;
