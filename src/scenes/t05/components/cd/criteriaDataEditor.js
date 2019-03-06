import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {Criterion} from 'core/model/mcda/criteria';
import {Dimmer, Loader, Message, Step} from 'semantic-ui-react';

import {CriteriaReclassification, CriteriaRasterUpload} from './index';
import CriteriaDataResults from './criteriaDataResults';
import CriteriaDataConstraints from './criteriaDataConstraints';
import {retrieveRasters} from 'services/api/rasterHelper';

class CriteriaDataEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criterion: null,
            isFetching: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const prevCriterion = this.props.criterion || null;
        const criterion = nextProps.criterion;

        if (criterion) {
            this.criterionToState(prevCriterion ? prevCriterion.toObject() : null, criterion.toObject());
        }
    }

    criterionToState = (prevCriterion, criterion) => {
        this.setState({
            isFetching: true
        });

        const newCriterion = criterion;

        const tasks = [
            {
                raster: criterion.raster,
                oldUrl: prevCriterion ? prevCriterion.raster.url : '',
                onSuccess: raster => newCriterion.raster = raster
            },
            {
                raster: criterion.constraintRaster,
                oldUrl: prevCriterion ? prevCriterion.constraintRaster.url : '',
                onSuccess: raster => newCriterion.constraintRaster = raster
            },
            {
                raster: criterion.suitability,
                oldUrl: prevCriterion ? prevCriterion.suitability.url : '',
                onSuccess: raster => newCriterion.suitability = raster
            },
        ];

        retrieveRasters(tasks, () => {
            this.setState({
                criterion: newCriterion,
                isFetching: false
            });
        });
    };

    handleChange = criterion => {
        const mcda = this.props.mcda;
        mcda.criteriaCollection.update(criterion);
        return this.props.onChange(mcda);
    };

    handleClickStep = (e, {name}) => this.props.onClickTool(this.props.criterion.id, name);

    renderTool() {
        const criterion = Criterion.fromObject(this.state.criterion);

        switch (this.props.activeTool) {
            case 'reclassification':
                return (
                    <CriteriaReclassification
                        criterion={criterion}
                        onChange={this.handleChange}
                    />
                );
            case 'constraints':
                return (
                    <CriteriaDataConstraints
                        criterion={criterion}
                        onChange={this.handleChange}
                    />
                );
            case 'results':
                return (
                    <CriteriaDataResults
                        criterion={criterion}
                        onChange={this.handleChange}
                    />
                );
            default:
                return (
                    <CriteriaRasterUpload
                        criterion={criterion}
                        gridSize={this.props.mcda.constraints.gridSize}
                        onChange={this.handleChange}
                    />
                );
        }
    }

    render() {
        const {activeTool} = this.props;
        const {criterion, isFetching} = this.state;

        return (
            <div>
                {isFetching &&
                <Dimmer active inverted>
                    <Loader indeterminate>Preparing Files</Loader>
                </Dimmer>
                }
                {!criterion ?
                    <Message
                        content="Select a criterion from the navigation on the bottom left. Don't forget to set gridSize first."
                        icon='lock'
                        warning
                    />
                    :
                    <div>
                        <Step.Group fluid>
                            <Step
                                active={activeTool === 'upload'}
                                name='upload'
                                icon='upload'
                                title='Upload'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeTool === 'constraints'}
                                disabled={criterion.raster.data.length === 0}
                                name='constraints'
                                icon='eraser'
                                title='Constraints'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeTool === 'reclassification'}
                                disabled={criterion.raster.data.length === 0}
                                name='reclassification'
                                icon='chart bar'
                                title='Reclassification'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeTool === 'results'}
                                disabled={!criterion.suitability || (criterion.suitability && criterion.suitability.data.length === 0)}
                                name='results'
                                icon='map'
                                title='Results'
                                link
                                onClick={this.handleClickStep}
                            />
                        </Step.Group>
                        {
                            this.renderTool()
                        }
                    </div>
                }
            </div>
        )
    }
}

CriteriaDataEditor.proptypes = {
    activeTool: PropTypes.string,
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    onClickTool: PropTypes.func.isRequired
};

export default withRouter(CriteriaDataEditor);
