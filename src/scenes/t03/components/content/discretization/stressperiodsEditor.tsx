import moment from 'moment';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Form, Grid, Message} from 'semantic-ui-react';
import {ModflowModel, Stressperiods} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {StressperiodsImport} from './index';
import StressPeriodsDataTable from './stressperiodsDatatable';

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    onChange: (modflowModel: ModflowModel) => void;
    onSave: () => void;
    onUndo: () => void;
}

const stressperiodsEditor = (props: IProps) => {
    const [stressperiods, setStressperiods] = useState<IStressPeriods>(props.model.stressperiods.toObject());
    const [endDateTime, setEndDateTime] = useState<string>(
        props.model.stressperiods.endDateTime.format('YYYY-MM-DD')
    );

    useEffect(() => {
        setStressperiods(props.model.stressperiods.toObject());
    }, [props.model.stressperiods]);

    const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (e.type === 'change') {
            if (name === 'endDateTime') {
                setEndDateTime(value);
            }
        }

        const date = moment.utc(value);
        if (!date.isValid()) {
            return;
        }

        if (e.type === 'blur') {
            const sp = Stressperiods.fromObject(stressperiods);

            if (name === 'startDateTime' || name === 'endDateTime') {
                sp[name] = date;
            }

            setStressperiods(sp.toObject());
            onChange();
        }
    };

    const handleChange = (data: ModflowModel | Stressperiods) => {
        if (data instanceof ModflowModel) {
            setStressperiods(data.stressperiods.toObject());
            return onChange();
        }

        setStressperiods(data.toObject());
        return onChange();
    };

    const handleChangeImport = (sp: Stressperiods) => {
        setEndDateTime(sp.endDateTime.format('YYYY-MM-DD'));
        setStressperiods(sp.toObject());
        return onChange();
    };

    const onChange = () => {
        const model = props.model.getClone();
        model.stressperiods = Stressperiods.fromObject(stressperiods);
        return props.onChange(model);
    };

    const iStressperiods = Stressperiods.fromObject(stressperiods);

    const datesInvalid = moment.utc(endDateTime)
        .diff(moment.utc(iStressperiods.last().startDateTime)) <= 0;

    return (
        <Grid>
            {!props.model.readOnly &&
            <Grid.Row>
                <Grid.Column width={16}>
                    <ContentToolBar
                        buttonSave={!props.model.readOnly}
                        buttonImport={props.model.readOnly ||
                        <StressperiodsImport
                            onChange={handleChangeImport}
                            stressperiods={iStressperiods}
                        />
                        }
                        onSave={props.onSave}
                        onUndo={props.onUndo}
                    />
                </Grid.Column>
            </Grid.Row>
            }
            <Grid.Row>
                <Grid.Column width={5}>
                    <Form color={'grey'}>
                        <Form.Input
                            type="date"
                            label="Start Date"
                            name={'startDateTime'}
                            value={moment.utc(stressperiods.start_date_time).format('YYYY-MM-DD')}
                            readOnly={true}
                        />
                        <Form.Input
                            error={datesInvalid}
                            type="date"
                            label="End Date"
                            name={'endDateTime'}
                            value={endDateTime}
                            onBlur={handleDateTimeChange}
                            onChange={handleDateTimeChange}
                            readOnly={props.model.readOnly}
                        />
                        <Form.Select
                            label="Time unit"
                            options={[{key: 4, text: 'days', value: 4}]}
                            value={4}
                            width={16}
                            disabled={props.model.readOnly}
                        />
                    </Form>
                    <Message color={'blue'}>
                        <strong>Total time: </strong>{iStressperiods.totim} days
                    </Message>
                    {datesInvalid &&
                    <Message color={'red'}>
                        <strong>Error: </strong>Start date of last stress period is greater than end date.
                    </Message>
                    }
                </Grid.Column>
                <Grid.Column width={11}>
                    <StressPeriodsDataTable
                        readOnly={props.model.readOnly}
                        stressperiods={iStressperiods}
                        onChange={handleChange}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default stressperiodsEditor;
