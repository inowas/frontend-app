import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {ModflowModel, Calculation} from '../../../../../core/model/modflow';
import {updateCalculation} from '../../../actions/actions';
import {fetchUrl} from '../../../../../services/api';
import {Message} from 'semantic-ui-react';
import {Optimization} from '../../../../../core/model/modflow/optimization';
import {OPTIMIZATION_STATE_FINISHED, OPTIMIZATION_STATE_STARTED} from '../../../defaults/optimization';
import OptimizationStatus from './optimizationStatus';

class OptimizationProgressBar extends React.Component {

    state = {
        fetching: false,
        polling: false,
        visible: false,
        error: null
    };

    componentWillReceiveProps(nextProps) {
        const optimization = nextProps.optimization;
        if (!(optimization instanceof Optimization)) {
            return this.setState({visible: false});
        }

        const {state} = optimization;
        if (state > OPTIMIZATION_STATE_FINISHED) {
            this.stopPolling();
        }

        if (state < OPTIMIZATION_STATE_STARTED || state > OPTIMIZATION_STATE_FINISHED) {
            return this.setState({visible: false});
        }

        if (state < OPTIMIZATION_STATE_FINISHED) {
            this.startPolling();
            return this.setState({visible: true});
        }
    }

    startPolling() {
        if (this.state.polling) {
            return;
        }

        this.timer = setInterval(() => this.fetchOptimization(), 2000);
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

    fetchOptimization() {
        const model = this.props.model;
        if (!(model instanceof ModflowModel)) {
            return;
        }

        const {calculation} = model;
        if (!(calculation instanceof Calculation)) {
            return;
        }

        const {state} = calculation;
        if (state < OPTIMIZATION_STATE_STARTED || state >= OPTIMIZATION_STATE_FINISHED) {
            return;
        }

        this.setState({fetching: true});
        fetchUrl(`modflowmodels/${model.id}/optimization`,
            data => {
                this.setState({
                    isError: false,
                    isLoading: false
                }, this.props.updateOptimization(Optimization.fromQuery(data)));
            },
            error => this.setState(
                {error, isError: true},
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
                        <OptimizationStatus state={this.props.optimization.state}/>
                    </Message.Content>
                </Message>
            )
        }

        return null;
    }
}

const mapStateToProps = state => ({
    model: state.T03.model && ModflowModel.fromObject(state.T03.model),
    optimization: state.T03.optimization ? Optimization.fromObject(state.T03.optimization) : null
});

const mapDispatchToProps = {
    updateCalculation
};

OptimizationProgressBar.propTypes = {
    model: PropTypes.instanceOf(ModflowModel)
};

export default connect(mapStateToProps, mapDispatchToProps)(OptimizationProgressBar);
