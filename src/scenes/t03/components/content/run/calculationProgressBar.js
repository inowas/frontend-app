import React from 'react';
import {connect} from 'react-redux';
import {ModflowModel, Calculation} from 'core/model/modflow';
import {updateCalculation} from '../../../actions/actions';
import CalculationStatus, {CALCULATION_STATE_FINISHED, CALCULATION_STATE_STARTED} from './CalculationStatus';
import {fetchUrl} from 'services/api';
import {Message} from 'semantic-ui-react';

class CalculationProgressBar extends React.Component {

    state = {
        fetching: false,
        polling: false,
        visible: false,
        error: null
    };

    componentWillReceiveProps(nextProps) {
        const model = nextProps.model;
        if (!(model instanceof ModflowModel)) {
            return this.setState({visible: false});
        }

        const {calculation} = model;
        if (!(calculation instanceof Calculation)) {
            return this.setState({visible: false});
        }

        const {state} = calculation;
        if (state > CALCULATION_STATE_FINISHED) {
            this.stopPolling();
        }

        if (state < CALCULATION_STATE_STARTED || state > CALCULATION_STATE_FINISHED) {
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

        const {calculation} = model;
        if (!(calculation instanceof Calculation)) {
            return;
        }

        const {state} = calculation;
        if (state < CALCULATION_STATE_STARTED || state >= CALCULATION_STATE_FINISHED) {
            return;
        }

        this.setState({fetching: true});
        fetchUrl(`modflowmodels/${model.id}/calculation`,
            data => {
                this.setState({fetching: false});
                this.props.updateCalculation(Calculation.fromQuery(data));
            },
            error => this.setState(
                {error, fetching: false},
                () => this.handleError(error)
            )
        );
    };

    render() {
        if (this.state.visible) {
            return (
                <Message
                    color='blue'
                    onDismiss={() => this.setState({visible: false})}
                >
                    <Message.Header as={'h4'}>Calculation Progress</Message.Header>
                    <Message.Content>
                        <CalculationStatus calculation={this.props.model.calculation}/>
                    </Message.Content>
                </Message>
            )
        }

        return null;
    }
}

const mapStateToProps = state => ({
    model: state.T03.model && ModflowModel.fromObject(state.T03.model)
});

const mapDispatchToProps = {
    updateCalculation
};

CalculationProgressBar.proptypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(CalculationProgressBar);
