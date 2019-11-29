import moment from 'moment';
import React, {ChangeEvent} from 'react';
import {Form, Grid, Message} from 'semantic-ui-react';
import {ModflowModel, Stressperiods} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';
import StressPeriodsDataTable from './stressperiodsDatatable';

interface IState {
    stressperiods: IStressPeriods;
    startDateTime: string;
    endDateTime: string;
}

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    isDirty: boolean;
    isError: boolean;
    onChange: (modflowModel: ModflowModel) => void;
    onSave: (modflowModel: ModflowModel) => void;
}

class StressperiodsEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            stressperiods: props.model.stressperiods.toObject(),
            startDateTime: props.model.stressperiods.startDateTime.format('YYYY-MM-DD'),
            endDateTime: props.model.stressperiods.endDateTime.format('YYYY-MM-DD'),
        };
    }

    public onSave = () => {
        const model = this.props.model.getClone();
        model.stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        return this.props.onSave(model);
    };

    public handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (e.type === 'change') {

            if (name === 'startDateTime') {
                this.setState({[name]: value});
            }

            if (name === 'endDateTime') {
                this.setState({[name]: value});
            }
        }

        const date = moment.utc(value);
        if (!date.isValid()) {
            return;
        }

        if (e.type === 'blur' && this.props.boundaries.length === 0) {
            const stressperiods = Stressperiods.fromObject(this.state.stressperiods);

            if (name === 'startDateTime' || name === 'endDateTime') {
                stressperiods[name] = date;
            }

            this.setState({
                stressperiods: stressperiods.toObject()
            }, () => this.onChange());
        }
    };

    public handleChange = (data: ModflowModel | Stressperiods) => {
        if (data instanceof ModflowModel) {
            return this.setState({
                stressperiods: data.stressperiods.toObject()
            }, () => this.onChange());
        }

        return this.setState({
            stressperiods: data.toObject()
        }, () => this.onChange());
    };

    public render() {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);

        const datesInvalid = moment.utc(this.state.endDateTime)
            .diff(moment.utc(stressperiods.last().startDateTime)) <= 0;

        return (
            <Grid>
                {!this.props.model.readOnly &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ContentToolBar
                            isDirty={this.props.isDirty}
                            isError={this.props.isError}
                            visible={!this.props.model.readOnly}
                            saveButton={!this.props.model.readOnly}
                            onSave={this.onSave}
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
                                value={this.state.startDateTime}
                                onBlur={this.handleDateTimeChange}
                                onChange={this.handleDateTimeChange}
                                readOnly={this.props.model.readOnly || this.props.boundaries.length > 0}
                            />
                            <Form.Input
                                error={datesInvalid}
                                type="date"
                                label="End Date"
                                name={'endDateTime'}
                                value={this.state.endDateTime}
                                onBlur={this.handleDateTimeChange}
                                onChange={this.handleDateTimeChange}
                                readOnly={this.props.model.readOnly || this.props.boundaries.length > 0}
                            />
                            <Form.Select
                                label="Time unit"
                                options={[{key: 4, text: 'days', value: 4}]}
                                value={4}
                                width={16}
                                disabled={this.props.model.readOnly}
                            />
                        </Form>
                        <Message color={'blue'}>
                            <strong>Total time: </strong>{stressperiods.totim} days
                        </Message>
                        {datesInvalid &&
                        <Message color={'red'}>
                            <strong>Error: </strong>Start date of last stress period is greater than end date.
                        </Message>
                        }
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <StressPeriodsDataTable
                            readOnly={this.props.model.readOnly || this.props.boundaries.length > 0}
                            stressperiods={stressperiods}
                            onChange={this.handleChange}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    private onChange = () => {
        const model = this.props.model.getClone();
        model.stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        this.props.onChange(model);
    };
}

export default StressperiodsEditor;
