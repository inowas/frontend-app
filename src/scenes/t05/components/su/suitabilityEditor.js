import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {Step} from 'semantic-ui-react';
import SuitabilityWeightAssignment from './suitabilityWA';
import SuitabilityClasses from './suitabilityClasses';
import SuitabilityResults from './suitabilityResults';

class SuitabilityEditor extends React.Component {
    handleClickStep = (e, {name}) => this.props.onClickTool(name);

    renderTool() {
        switch (this.props.activeTool) {
            case 'results':
                return (
                    <SuitabilityResults
                        mcda={this.props.mcda}
                    />
                );
            case 'classes':
                return (
                    <SuitabilityClasses
                        mcda={this.props.mcda}
                        handleChange={this.props.handleChange}
                    />
                );
            default:
                return (
                    <SuitabilityWeightAssignment
                        mcda={this.props.mcda}
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
                        title='Weight Assignment'
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
