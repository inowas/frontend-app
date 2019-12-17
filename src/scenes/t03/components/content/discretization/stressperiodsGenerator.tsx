import {cloneDeep} from 'lodash';
import moment from 'moment/moment';
import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {Button, Checkbox, Divider, DropdownProps, Form, Input, InputOnChangeData, Modal} from 'semantic-ui-react';
import Uuid from 'uuid';
import {IStressPeriod} from '../../../../../core/model/modflow/Stressperiod.type';
import Stressperiods from '../../../../../core/model/modflow/Stressperiods';

interface IGeneratedPeriod extends IStressPeriod {
    id?: string;
    isNew: boolean;
}

interface IProps {
    onCancel: () => any;
    onSubmit: (stressPeriods: Stressperiods) => any;
    stressPeriods: Stressperiods;
}

enum EUnit {
    DAYS = 'days',
    WEEKS = 'weeks',
    MONTHS = 'months',
    QUARTERS = 'quarters',
    YEARS = 'years'
}

const stressperiodsGenerator = (props: IProps) => {
    const [addedStressPeriods, setAddedStressPeriods] = useState<IGeneratedPeriod[]>([]);
    const [inputAmount, setInputAmount] = useState<string | number>(1);
    const [inputStartDate, setInputStartDate] = useState<string>(
        props.stressPeriods.startDateTime.format('YYYY-MM-DD')
    );
    const [inputUnit, setInputUnit] = useState<EUnit>(EUnit.DAYS);
    const [intervalAmount, setIntervalAmount] = useState<string | number>(1);
    const [intervalUnit, setIntervalUnit] = useState<EUnit>(EUnit.DAYS);
    const [intervalTimes, setIntervalTimes] = useState<string | number>(1);
    const [useInterval, setUseInterval] = useState<boolean>(false);

    const handleBlurAmount = (getter: string | number, setter: (v: string | number) => any) => () => {
        if (typeof getter === 'string') {
            let n = parseFloat(getter);
            if (n < 0) {
                n = 0;
            }
            return setter(n);
        }
    };

    const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (name === 'inputAmount') {
            return setInputAmount(value || 0);
        }
        if (name === 'intervalAmount') {
            return setIntervalAmount(value || 0);
        }
        if (name === 'intervalTimes') {
            return setIntervalTimes(value || 0);
        }
    };

    const handleChangeDate = (date: string) => () => {
        return setInputStartDate(moment(date).format('YYYY-MM-DD'));
    };

    const handleChangeUnit = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        if (name === 'inputUnit') {
            return setInputUnit(value as EUnit);
        }
        if (name === 'intervalUnit') {
            return setIntervalUnit(value as EUnit);
        }
    };

    const handleClickAdd = () => {
        const periods = cloneDeep(addedStressPeriods);

        for (let t = 1; t <= (useInterval ? intervalTimes : 1); t++) {
            for (let p = 0; p < inputAmount; p++) {
                const date = moment(inputStartDate)
                    .add(useInterval ? ((intervalAmount as number) * t) : 0, intervalUnit)
                    .add(useInterval ? p : p + 1, inputUnit).format('YYYY-MM-DD');
                if (
                    props.stressPeriods.stressperiods.filter(
                        (sp) => sp.startDateTime.format('YYYY-MM-DD') === date
                    ).length === 0
                ) {
                    periods.push({
                        start_date_time: date,
                        id: Uuid.v4(),
                        isNew: true,
                        nstp: 1,
                        tsmult: 1,
                        steady: false
                    });
                }
            }
        }
        return setAddedStressPeriods(periods);
    };

    const handleClickIntervalOption = () => setUseInterval(!useInterval);

    const handleClickRemove = (id: string | undefined) => () => {
        if (!id) {
            return;
        }
        return setAddedStressPeriods(addedStressPeriods.filter((p) => p.id !== id));
    };

    const handleClickSubmit = () => {
        const stressPeriods = props.stressPeriods.toObject();
        addedStressPeriods.map((sp) => {
            return {
                start_date_time: moment.utc(sp.start_date_time).format(),
                nstp: 1,
                tsmult: 1,
                steady: false
            };
        }).forEach((sp) => {
            stressPeriods.stressperiods.push(sp);
        });

        props.onSubmit(Stressperiods.fromObject(stressPeriods));
        return props.onCancel();
    };

    const renderPreview = () => {
        const periods: IGeneratedPeriod[] = props.stressPeriods.toObject().stressperiods.map((sp) => {
            const cSp: IGeneratedPeriod = {
                ...sp,
                isNew: false
            };
            return cSp;
        });

        addedStressPeriods.forEach((sp) => {
            if (periods.filter((p) => p.start_date_time === sp.start_date_time).length === 0) {
                periods.push(sp);
            }
        });

        periods.sort((a, b) => {
            const dA = moment(a.start_date_time);
            const dB = moment(b.start_date_time);
            return dA.isBefore(dB) ? -1 : dA.isAfter(dB) ? 1 : 0;
        });

        return (
            <Form>
                {periods.map((p, key) => (
                    <Form.Group key={key}>
                        <Form.Input
                            value={moment(p.start_date_time).format('YYYY-MM-DD')}
                            width={3}
                        >
                            <input/>
                            <Button.Group>
                                {p.isNew &&
                                <Button
                                    icon="trash"
                                    onClick={handleClickRemove(p.id)}
                                    negative={true}
                                />
                                }
                                <Button
                                    icon="calendar plus"
                                    onClick={handleChangeDate(p.start_date_time)}
                                    primary={true}
                                />
                            </Button.Group>
                        </Form.Input>
                        {moment(p.start_date_time).format('YYYY-MM-DD') === inputStartDate &&
                        <React.Fragment>
                            <Form.Field width={2}>
                                <Input
                                    onBlur={handleBlurAmount(inputAmount, setInputAmount)}
                                    onChange={handleChangeAmount}
                                    label="Add"
                                    placeholder="Amount"
                                    name="inputAmount"
                                    type="number"
                                    value={inputAmount}
                                />
                            </Form.Field>
                            <Form.Select
                                onChange={handleChangeUnit}
                                options={[
                                    {key: 0, text: inputAmount === 1 ? 'Day' : 'Days', value: EUnit.DAYS},
                                    {key: 1, text: inputAmount === 1 ? 'Week' : 'Weeks', value: EUnit.WEEKS},
                                    {key: 2, text: inputAmount === 1 ? 'Month' : 'Months', value: EUnit.MONTHS},
                                    {key: 3, text: inputAmount === 1 ? 'Quarter' : 'Quarters', value: EUnit.QUARTERS},
                                    {key: 4, text: inputAmount === 1 ? 'Year' : 'Years', value: EUnit.YEARS}
                                ]}
                                name="inputUnit"
                                style={{width: '100px'}}
                                value={inputUnit}
                            />
                            {useInterval &&
                            <React.Fragment>
                                <Form.Field width={2}>
                                    <Input
                                        onBlur={handleBlurAmount(intervalAmount, setIntervalAmount)}
                                        onChange={handleChangeAmount}
                                        placeholder="Amount"
                                        type="number"
                                        label="every"
                                        name="intervalAmount"
                                        value={intervalAmount}
                                    />
                                </Form.Field>
                                <Form.Select
                                    onChange={handleChangeUnit}
                                    options={[
                                        {key: 0, text: intervalAmount === 1 ? 'Day' : 'Days', value: EUnit.DAYS},
                                        {key: 1, text: intervalAmount === 1 ? 'Week' : 'Weeks', value: EUnit.WEEKS},
                                        {key: 2, text: intervalAmount === 1 ? 'Month' : 'Months', value: EUnit.MONTHS},
                                        {
                                            key: 3,
                                            text: intervalAmount === 1 ? 'Quarter' : 'Quarters',
                                            value: EUnit.QUARTERS
                                        },
                                        {key: 4, text: intervalAmount === 1 ? 'Year' : 'Years', value: EUnit.YEARS}
                                    ]}
                                    name="intervalUnit"
                                    value={intervalUnit}
                                    style={{width: '100px'}}
                                />
                                <Form.Field width={2}>
                                    <Input
                                        onBlur={handleBlurAmount(intervalTimes, setIntervalTimes)}
                                        onChange={handleChangeAmount}
                                        placeholder="Amount"
                                        type="number"
                                        label={intervalTimes === 1 ? 'time' : 'times'}
                                        labelPosition="right"
                                        name="intervalTimes"
                                        value={intervalTimes}
                                    />
                                </Form.Field>
                            </React.Fragment>
                            }
                            <Button
                                icon="plus"
                                onClick={handleClickAdd}
                                primary={true}
                            />
                        </React.Fragment>
                        }
                    </Form.Group>
                ))}
            </Form>
        );
    };

    return (
        <Modal
            open={true}
            onClose={props.onCancel}
            dimmer={'blurring'}
            size="large"
        >
            <Modal.Header>Generate stressperiods</Modal.Header>
            <Modal.Content>
                <Checkbox
                    checked={useInterval}
                    label={{children: 'Interval Option'}}
                    onChange={handleClickIntervalOption}
                />
                <Divider/>
                {renderPreview()}
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button
                    onClick={handleClickSubmit}
                    primary={true}
                >
                    Submit
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default stressperiodsGenerator;
