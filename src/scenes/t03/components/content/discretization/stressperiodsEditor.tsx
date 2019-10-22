import React, {ChangeEvent} from 'react';
import {connect} from 'react-redux';

import {Form, Grid, Message} from 'semantic-ui-react';

import {ModflowModel, Stressperiods} from '../../../../../core/model/modflow';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';
import {updateStressperiods} from '../../../actions/actions';

import moment from 'moment';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';
import {sendCommand} from '../../../../../services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import DiscretizationImport from './discretizationImport';
import StressPeriodsDataTable from './stressperiodsDatatable';

interface IState {
    stressperiods: IStressPeriods;
    startDateTime: string;
    endDateTime: string;
    isDirty: boolean;
    isError: boolean;
}

interface IStateProps {
    model: ModflowModel;
}

interface IDispatchProps {
    onChange: (stressperiods: Stressperiods) => void;
}

type IProps = IStateProps & IDispatchProps;

class StressperiodsEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            stressperiods: props.model.stressperiods.toObject(),
            startDateTime: props.model.stressperiods.startDateTime.format('YYYY-MM-DD'),
            endDateTime: props.model.stressperiods.endDateTime.format('YYYY-MM-DD'),
            isDirty: false,
            isError: false
        };
    }

    public onSave = () => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const command = ModflowModelCommand.updateStressperiods({
            id: this.props.model.id,
            stressperiods: stressperiods.toObject()
        });

        return sendCommand(command,
            () => {
                this.setState({isDirty: false});
                this.props.onChange(stressperiods);
            },
            () => this.setState({isError: true})
        );
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

        if (e.type === 'blur') {
            const stressperiods = Stressperiods.fromObject(this.state.stressperiods);

            if (name === 'startDateTime' || name === 'endDateTime') {
                stressperiods[name] = date;
            }

            this.setState({
                stressperiods: stressperiods.toObject(),
                isDirty: true
            });
        }
    };

    public handleChange = (data: ModflowModel | Stressperiods) => {
        if (data instanceof ModflowModel) {
            return this.setState({
                stressperiods: data.stressperiods.toObject(),
                isDirty: true
            });
        }

        return this.setState({
            stressperiods: data.toObject(),
            isDirty: true
        });
    };

    public render() {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);

        const datesInvalid = moment.utc(this.state.endDateTime)
            .diff(moment.utc(stressperiods.last().startDateTime)) <= 0;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ContentToolBar
                            isDirty={this.state.isDirty}
                            isError={this.state.isError}
                            visible={!this.props.model.readOnly}
                            saveButton={true}
                            onSave={this.onSave}
                            importButton={
                                <DiscretizationImport
                                    onChange={this.handleChange}
                                    model={this.props.model}
                                />
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
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
                                readOnly={this.props.model.readOnly}
                            />
                            <Form.Input
                                error={datesInvalid}
                                type="date"
                                label="End Date"
                                name={'endDateTime'}
                                value={this.state.endDateTime}
                                onBlur={this.handleDateTimeChange}
                                onChange={this.handleDateTimeChange}
                                readOnly={this.props.model.readOnly}
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
                            readOnly={this.props.model.readOnly}
                            stressperiods={stressperiods}
                            onChange={this.handleChange}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state: any) => ({
    model: ModflowModel.fromObject(state.T03.model)
});

const mapDispatchToProps = (dispatch: any) => ({
    onChange: (stressperiods: Stressperiods) => dispatch(updateStressperiods(stressperiods))
});

export default connect(mapStateToProps, mapDispatchToProps)(StressperiodsEditor);
