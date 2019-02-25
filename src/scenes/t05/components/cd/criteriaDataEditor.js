import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {Criterion} from 'core/model/mcda/criteria';
import {Dimmer, Loader, Message, Step} from 'semantic-ui-react';

import {CriteriaReclassification, CriteriaRasterUpload} from './index';
import CriteriaDataResults from './criteriaDataResults';
import CriteriaDataConstraints from './criteriaDataConstraints';
import {retrieveDroppedData} from 'services/api';

class CriteriaDataEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criterion: null,
            isFetching: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.criterionToState(nextProps);
    }

    criterionToState = props => {
        if (!props.criterion) {
            return;
        }

        const criterion = props.criterion.toObject();

        this.getRasterData(criterion.raster, response => {
            criterion.raster = response;
        });

        this.getRasterData(criterion.constraintRaster, response => {
            criterion.constraintRaster = response;
        });

        this.getRasterData(criterion.suitability, response => {
            criterion.suitability = response;
        });

        this.setState({
            criterion
        });
    };

    getRasterData = (raster, onSuccess) => {
        if (raster.data && raster.data.length === 0 && raster.url) {
            this.setState(prevState => ({
                isFetching: {
                    ...prevState.isFetching,
                    [raster.id]: true
                }
            }), () => {
                retrieveDroppedData(
                    raster.url,
                    response => {
                        raster.data = response;
                        this.setState(prevState => ({
                            isFetching: {
                                ...prevState.isFetching,
                                [raster.id]: false
                            }
                        }), () => onSuccess(raster));
                    },
                    response => {
                        throw new Error(response);
                    }
                )
            })
        }
    };

    handleClickStep = (e, {name}) => this.props.onClickTool(this.props.criterion.id, name);

    renderTool() {
        const criterion = Criterion.fromObject(this.state.criterion);

        switch (this.props.activeTool) {
            case 'reclassification':
                return (
                    <CriteriaReclassification
                        criterion={criterion}
                        onChange={this.props.handleChange}
                    />
                );
            case 'constraints':
                return (
                    <CriteriaDataConstraints
                        criterion={criterion}
                        onChange={this.props.handleChange}
                    />
                );
            case 'results':
                return (
                    <CriteriaDataResults
                        criterion={criterion}
                        onChange={this.props.handleChange}
                    />
                );
            default:
                return (
                    <CriteriaRasterUpload
                        criterion={criterion}
                        gridSize={this.props.mcda.constraints.gridSize}
                        onChange={this.props.handleChange}
                    />
                );
        }
    }

    render() {
        const {activeTool} = this.props;
        const {criterion, isFetching} = this.state;

        return (
            <div>
                {Object.keys(isFetching).some(k => isFetching[k]) &&
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
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    onClickTool: PropTypes.func.isRequired
};

export default withRouter(CriteriaDataEditor);
