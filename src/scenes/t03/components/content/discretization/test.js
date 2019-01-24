import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Form, Grid, Message} from 'semantic-ui-react';

import {ModflowModel, Stressperiods} from 'core/model/modflow';
import {updateStressperiods} from '../../../actions/actions';

import {sendCommand} from 'services/api';
import StressPeriodsDataTable from './stressperiodsDatatable';
import moment from 'moment';
import ContentToolBar from 'scenes/shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

class StressperiodsEditor extends React.Component {
    constructor(props) {
        super(props);

        const stressPeriods = props.stressperiods.toObject();

        this.state = {
            stressperiods: stressPeriods,
            stressperiodsLocal: {
                start_date_time: stressPeriods.start_date_time,
                end_date_time: stressPeriods.end_date_time
            },
            isDirty: false,
            isError: false
        }
    }

    onSave = () => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        console.log('SENDING', stressperiods);
        const command = ModflowModelCommand.updateStressperiods({
            id: this.props.id,
            stress_periods: stressperiods.toObject()
        });

        return sendCommand(command,
            () => {
                this.setState({isDirty: false});
                this.props.onChange(stressperiods);
            },
            () => this.setState({error: true})
        )
    };

    handleLocalDateTimeChange = (e, {name, value}) => this.setState(prevState => ({
        stressperiodsLocal: {
            ...prevState.stressperiodsLocal,
            [name]: value
        }
    }));

    handleDateTimeChange = () => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        stressperiods.startDateTime = moment(this.state.stressperiodsLocal.start_date_time);
        stressperiods.endDateTime = moment(this.state.stressperiodsLocal.end_date_time);
        console.log(stressperiods);
        stressperiods.recalculateStressperiods();
        return this.setState({
            stressperiods: stressperiods.toObject(),
            isDirty: true
        });
    };

    handleChange = stressperiods => {
        this.setState({
            stressperiods: stressperiods.toObject(),
            isDirty: true
        });
    };

    render() {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ContentToolBar
                            isDirty={this.state.isDirty}
                            isError={this.state.isError}
                            saveButton
                            onSave={this.onSave}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Form color={'grey'}>
                            <Form.Input
                                type='date'
                                label='Start Date'
                                name={'start_date_time'}
                                value={this.state.stressperiodsLocal.start_date_time}
                                onBlur={this.handleDateTimeChange}
                                onChange={this.handleLocalDateTimeChange}
                            />
                            <Form.Input
                                type='date'
                                label='End Date'
                                name={'end_date_time'}
                                value={this.state.stressperiodsLocal.end_date_time}
                                onBlur={this.handleDateTimeChange}
                                onChange={this.handleLocalDateTimeChange}
                            />
                            <Form.Select
                                label='Time unit'
                                options={[{key: 4, text: 'days', value: 4}]}
                                value={4}
                                width={16}
                            />
                        </Form>
                        <Message color={'blue'}>
                            <strong>Total time: </strong>{Stressperiods.fromObject(this.state.stressperiods).totim} days
                        </Message>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <StressPeriodsDataTable stressperiods={stressperiods} onChange={this.handleChange}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: ModflowModel.fromObject(state.T03.model).id,
        stressperiods: ModflowModel.fromObject(state.T03.model).stressperiods
    };
};

const mapDispatchToProps = {
    onChange: updateStressperiods
};

StressperiodsEditor.proptypes = {
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired,
    onChange: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(StressperiodsEditor);
