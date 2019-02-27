import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {Step} from 'semantic-ui-react';
import SuitabilityWeightAssignment from './suitabilityWA';
import SuitabilityClasses from './suitabilityClasses';
import SuitabilityResults from './suitabilityResults';
import {retrieveDroppedData} from 'services/api';

class SuitabilityEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: false,
            mcda: props.mcda.toObject()
        }
    }

    componentWillReceiveProps(nextProps) {
        const mcda = nextProps.mcda.toObject();

        if (mcda.suitability.raster.url !== '' && mcda.suitability.raster) {
            this.setState({
                isFetching: true
            });
            retrieveDroppedData(
                mcda.suitability.raster.url,
                response => {
                    mcda.suitability.raster.data = response;
                    this.setState({
                        isFetching: false,
                        mcda: mcda
                    });
                },
                response => {
                    throw new Error(response);
                }
            );
        }
    }

    handleClickStep = (e, {name}) => this.props.onClickTool(name);

    renderTool() {
        const mcda = MCDA.fromObject(this.state.mcda);

        console.log(mcda);

        switch (this.props.activeTool) {
            case 'results':
                return (
                    <SuitabilityResults
                        mcda={mcda}
                    />
                );
            case 'classes':
                return (
                    <SuitabilityClasses
                        mcda={mcda}
                        handleChange={this.props.handleChange}
                    />
                );
            default:
                return (
                    <SuitabilityWeightAssignment
                        mcda={mcda}
                        handleChange={this.props.handleChange}
                    />
                );
        }
    }

    render() {
        const {activeTool} = this.props;

        return (
            <div>
                <Step.Group fluid widths={3}>
                    <Step
                        active={activeTool === 'weightAssignment' || !activeTool}
                        name='weightAssignment'
                        icon='list ol'
                        title='Calculation'
                        link
                        onClick={this.handleClickStep}
                    />
                    <Step
                        active={activeTool === 'classes'}
                        name='classes'
                        icon='chart bar'
                        title='Classes'
                        link
                        onClick={this.handleClickStep}
                    />
                    <Step
                        active={activeTool === 'results'}
                        name='results'
                        icon='map'
                        title='Results'
                        link
                        onClick={this.handleClickStep}
                    />
                </Step.Group>
                {this.renderTool()}
            </div>
        )
    }
}

SuitabilityEditor.proptypes = {
    activeTool: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    onClickTool: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired
};

export default withRouter(SuitabilityEditor);
