import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Form, Grid, Message} from 'semantic-ui-react';

import {ModflowModel, Stressperiods} from '../../../../../core/model/modflow';
import {updateStressperiods} from '../../../actions/actions';

import {sendCommand} from '../../../../../services/api';
import StressPeriodsDataTable from './stressperiodsDatatable';
import moment from 'moment';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import StressperiodsImport from './stressperiodsImport';

class StressperiodsEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stressperiods: props.stressperiods.toObject(),
            startDateTime: props.stressperiods.startDateTime.format('YYYY-MM-DD'),
            endDateTime: props.stressperiods.endDateTime.format('YYYY-MM-DD'),
            isDirty: false,
            isError: false
        }
    }

    onSave = () => {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        const command = ModflowModelCommand.updateStressperiods({
            id: this.props.id,
            stressperiods: stressperiods.toObject()
        });

        return sendCommand(command,
            () => {
                this.setState({isDirty: false});
                this.props.onChange(stressperiods);
            },
            () => this.setState({error: true})
        )
    };

    handleDateTimeChange = (e) => {
        const  {name, value} = e.target;
        if (e.type === 'change') {
            this.setState({[name]: value})
        }

        const date = moment.utc(value);
        if (!date.isValid()) {
            return;
        }

        if (e.type === 'blur') {
            const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
            stressperiods[name] = date;
            stressperiods.recalculateStressperiods();
            this.setState({
                stressperiods: stressperiods.toObject(),
                isDirty: true
            })
        }
    };

    handleChange = stressperiods => {
        this.setState({
            stressperiods: stressperiods.toObject(),
            isDirty: true
        });
    };

    render() {
        const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
        stressperiods.orderStressperiods();
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
                                name={'startDateTime'}
                                value={this.state.startDateTime}
                                onBlur={this.handleDateTimeChange}
                                onChange={this.handleDateTimeChange}
                            />
                            <Form.Input
                                type='date'
                                label='End Date'
                                name={'endDateTime'}
                                value={this.state.endDateTime}
                                onBlur={this.handleDateTimeChange}
                                onChange={this.handleDateTimeChange}
                            />
                            <Form.Select
                                label='Time unit'
                                options={[{key: 4, text: 'days', value: 4}]}
                                value={4}
                                width={16}
                            />
                        </Form>
                        <Message color={'blue'}>
                            <strong>Total time: </strong>{stressperiods.totim} days
                        </Message>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <StressPeriodsDataTable stressperiods={stressperiods} onChange={this.handleChange}/>
                        <StressperiodsImport
                            onChange={this.handleChange}
                            timeunit={this.props.timeunit}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: ModflowModel.fromObject(state.T03.model).id,
        stressperiods: ModflowModel.fromObject(state.T03.model).stressperiods,
        timeunit: ModflowModel.fromObject(state.T03.model).timeUnit
    };
};

const mapDispatchToProps = {
    onChange: updateStressperiods
};

StressperiodsEditor.propTypes = {
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired,
    timeunit: PropTypes.number,
    onChange: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(StressperiodsEditor);
