import {cloneDeep} from 'lodash';
import moment from 'moment/moment';
import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {Button, Divider, DropdownProps, Form, Icon, InputOnChangeData, Modal} from 'semantic-ui-react';
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

    const handleBlurAmount = () => {
        if (typeof inputAmount === 'string') {
            let n = parseFloat(inputAmount);
            if (n < 0) {
                n = 0;
            }
            return setInputAmount(n);
        }
    };

    const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => setInputAmount(value);

    const handleChangeDate = (date: string) => () => {
        return setInputStartDate(moment(date).format('YYYY-MM-DD'));
    };

    const handleChangeUnit = (e: SyntheticEvent, {value}: DropdownProps) => {
        setInputUnit(value as EUnit);
    };

    const handleClickAdd = () => {
        const periods = cloneDeep(addedStressPeriods);
        for (let p = 0; p < inputAmount; p++) {
            periods.push({
                start_date_time: moment(inputStartDate)
                    .add(p + 1, inputUnit).format('YYYY-MM-DD'),
                id: Uuid.v4(),
                isNew: true,
                nstp: 1,
                tsmult: 1,
                steady: true
            });
        }
        return setAddedStressPeriods(periods);
    };

    const handleClickRemove = (id: string | undefined) => () => {
        if (!id) {
            return;
        }
        return setAddedStressPeriods(addedStressPeriods.filter((p) => p.id !== id));
    };

    const handleClickReset = () => {
        return setInputStartDate(props.stressPeriods.first.startDateTime.format('YYYY-MM-DD'));
    };

    const handleClickSubmit = () => {
        const stressPeriods = props.stressPeriods.toObject();
        addedStressPeriods.map((sp) => {
            return {
                start_date_time: moment.utc(sp.start_date_time).format(),
                nstp: 1,
                tsmult: 1,
                steady: true
            };
        }).forEach((sp) => {
            stressPeriods.stressperiods.push(sp);
        });

        props.onSubmit(Stressperiods.fromObject(stressPeriods));
        return props.onCancel();
    };

    const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
        setInputStartDate(value);
    };

    const renderPreview = () => {
        const startDate = moment(inputStartDate);
        const periods: IGeneratedPeriod[] = props.stressPeriods.toObject().stressperiods.filter((sp) =>
            moment(sp.start_date_time).isSameOrAfter(startDate)
        ).map((sp) => {
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
            <React.Fragment>
                {periods.map((p, key) => (
                    <Form.Group key={key}>
                        {p.isNew &&
                        <Form.Field width={4}/>
                        }
                        <Form.Input
                            icon={
                                <Icon
                                    name="eye dropper"
                                    onClick={handleChangeDate(p.start_date_time)}
                                    inverted={true}
                                    circular={true}
                                    link={true}
                                />
                            }
                            value={moment(p.start_date_time).format('YYYY-MM-DD')}
                            width={4}
                        />
                        {p.isNew &&
                        <Form.Field>
                            <Button
                                className="red"
                                icon={true}
                                labelPosition="left"
                                onClick={handleClickRemove(p.id)}
                            >
                                <Icon name="trash"/>
                                Remove
                            </Button>
                        </Form.Field>
                        }
                    </Form.Group>
                ))}
            </React.Fragment>
        );
    };

    return (
        <Modal
            open={true}
            onClose={props.onCancel}
            dimmer={'blurring'}
        >
            <Modal.Header>Generate stressperiods</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Group>
                        <Form.Input
                            icon={
                                <Icon
                                    name="history"
                                    onClick={handleClickReset}
                                    inverted={true}
                                    circular={true}
                                    link={true}
                                />
                            }
                            type="date"
                            label="Start Date"
                            name={'startDateTime'}
                            value={inputStartDate}
                            width={4}
                            onChange={handleDateTimeChange}
                        />
                        <Form.Input
                            label="Amount"
                            onBlur={handleBlurAmount}
                            onChange={handleChangeAmount}
                            placeholder="Amount"
                            type="number"
                            value={inputAmount}
                            width={4}
                        />
                        <Form.Select
                            label="Unit"
                            onChange={handleChangeUnit}
                            options={[
                                {key: 0, text: 'Days', value: EUnit.DAYS},
                                {key: 1, text: 'Weeks', value: EUnit.WEEKS},
                                {key: 2, text: 'Months', value: EUnit.MONTHS},
                                {key: 3, text: 'Quarters', value: EUnit.QUARTERS},
                                {key: 4, text: 'Years', value: EUnit.YEARS}
                            ]}
                            value={inputUnit}
                            width={4}
                        />
                        <Form.Field width={4}>
                            <label>&nbsp;</label>
                            <Button
                                className="blue"
                                fluid={true}
                                icon={true}
                                labelPosition="left"
                                onClick={handleClickAdd}
                            >
                                <Icon name="plus"/>
                                Add
                            </Button>
                        </Form.Field>
                    </Form.Group>
                    <Divider/>
                    {renderPreview()}
                </Form>
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
