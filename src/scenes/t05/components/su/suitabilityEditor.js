import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {Step} from 'semantic-ui-react';
import SuitabilityWeightAssignment from './suitabilityWA';
import SuitabilityClasses from './suitabilityClasses';
import SuitabilityResults from './suitabilityResults';
import {retrieveRasters} from 'services/api/rasterHelper';

class SuitabilityEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: false,
            mcda: props.mcda.toObject()
        }
    }

    componentWillReceiveProps(nextProps) {
        const prevMcda = this.props.mcda || null;
        const mcda = nextProps.mcda;

        if (mcda) {
            this.suitabilityToState(prevMcda ? prevMcda.toObject() : null, mcda.toObject());
        }
    }

    suitabilityToState = (prevMcda, mcda) => {
        this.setState({
            isFetching: true
        });

        const newMcda = mcda;

        const tasks = [
            {
                raster: mcda.suitability.raster,
                oldUrl: prevMcda ? prevMcda.suitability.raster.url : '',
                onSuccess: raster => newMcda.suitability.raster = raster
            }
        ];

        retrieveRasters(tasks, () => {
            this.setState({
                mcda: newMcda,
                isFetching: false
            });
        });
    };

    handleClickStep = (e, {name}) => this.props.onClickTool(name);

    renderTool() {
        const mcda = MCDA.fromObject(this.state.mcda);

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
                        handleChange={this.props.onChange}
                        readOnly={this.props.readOnly}
                    />
                );
            default:
                return (
                    <SuitabilityWeightAssignment
                        mcda={mcda}
                        handleChange={this.props.onChange}
                        readOnly={this.props.readOnly}
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
                        icon='calculator'
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
    onChange: PropTypes.func.isRequired,
    onClickTool: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    readOnly: PropTypes.bool
};

export default withRouter(SuitabilityEditor);
