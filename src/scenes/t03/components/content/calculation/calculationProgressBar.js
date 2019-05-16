import React from 'react';
import {connect} from 'react-redux';
import {ModflowModel, Calculation} from '../../../../../core/model/modflow';
import {updateCalculation} from '../../../actions/actions';
import CalculationStatus, {CALCULATION_STATE_NEW, CALCULATION_STATE_FINISHED} from './CalculationStatus';
import {Message} from 'semantic-ui-react';
import {fetchCalculationDetails} from '../../../../../services/api';

class CalculationProgressBar extends React.Component {

    state = {
        fetching: false,
        polling: false,
        visible: false,
        error: null
    };

    componentWillReceiveProps(nextProps) {
        const {model} = nextProps;
        if (!(model instanceof ModflowModel)) {
            return this.setState({visible: false});
        }

        const {calculation} = nextProps;
        if (!(calculation instanceof Calculation)) {
            return this.setState({visible: false});
        }

        const {state} = calculation;
        if (state >= CALCULATION_STATE_FINISHED) {
            this.stopPolling();
        }

        if (state < CALCULATION_STATE_NEW || state > CALCULATION_STATE_FINISHED) {
            return this.setState({visible: false});
        }

        if (state < CALCULATION_STATE_FINISHED) {
            this.startPolling();
            return this.setState({visible: true});
        }
    }

    startPolling() {
        if (this.state.polling) {
            return;
        }

        this.timer = setInterval(() => this.fetchCalculation(), 2000);
        this.setState({polling: true});
    }

    stopPolling() {
        clearInterval(this.timer);
        this.timer = null;
        this.setState({polling: false});
    }

    handleError(e) {
        this.setState({error: e})
    }

    fetchCalculation() {
        const model = this.props.model;
        if (!(model instanceof ModflowModel)) {
            return;
        }

        const {calculation} = this.props;
        if (!(calculation instanceof Calculation)) {
            return;
        }

        const {state} = calculation;
        if (state < CALCULATION_STATE_NEW || state >= CALCULATION_STATE_FINISHED) {
            return;
        }

        this.setState({fetching: true},
            () => fetchCalculationDetails(calculation.id,
                data => {
                    const calculation = Calculation.fromQuery(data);
                    if (calculation.isValid()) {
                        this.setState({fetching: false});
                        this.props.updateCalculation(calculation);
                    }
                },
                error => this.setState(
                    {error, fetching: false},
                    () => this.handleError(error)
                )
            )
        );
    }

    render() {
        if (this.state.visible) {
            return (
                <Message
                    color='blue'
                    onDismiss={() => {
                        this.stopPolling();
                        this.setState({visible: false});
                    }}
                >
                    <Message.Header as={'h4'}>Calculation Progress</Message.Header>
                    <Message.Content>
                        <CalculationStatus calculation={this.props.calculation}/>
                    </Message.Content>
                </Message>
            )
        }

        return null;
    }
}

const mapStateToProps = state => ({
    calculation: state.T03.calculation && Calculation.fromObject(state.T03.calculation),
    model: state.T03.model && ModflowModel.fromObject(state.T03.model)
});

const mapDispatchToProps = {
    updateCalculation
};

CalculationProgressBar.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(CalculationProgressBar);
