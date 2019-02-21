import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {Criterion} from 'core/model/mcda/criteria';
import {Message, Step} from 'semantic-ui-react';

import {CriteriaReclassification, CriteriaRasterUpload} from './index';
import CriteriaDataResults from './criteriaDataResults';
import CriteriaDataConstraints from './criteriaDataConstraints';

class CriteriaDataEditor extends React.Component {

    handleClickStep = (e, {name}) => this.props.onClickTool(this.props.criterion.id, name);

    renderTool() {
        if (!this.props.criterion) {
            return;
        }

        switch (this.props.activeTool) {
            case 'reclassification':
                return (
                    <CriteriaReclassification
                        criterion={this.props.criterion}
                        onChange={this.props.handleChange}
                    />
                );
            case 'constraints':
                return (
                    <CriteriaDataConstraints
                        criterion={this.props.criterion}
                        onChange={this.props.handleChange}
                    />
                );
            case 'results':
                return (
                    <CriteriaDataResults
                        criterion={this.props.criterion}
                        onChange={this.props.handleChange}
                    />
                );
            default:
                return (
                    <CriteriaRasterUpload
                        criterion={this.props.criterion}
                        gridSize={this.props.mcda.constraints.gridSize}
                        onChange={this.props.handleChange}
                    />
                );
        }
    }

    render() {
        const {activeTool, criterion} = this.props;
        return (
            <div>
                {!criterion &&
                <Message
                    content="Select a criterion from the navigation on the bottom left. Don't forget to set gridSize first."
                    icon='lock'
                    warning
                />
                }
                {!!criterion &&
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
                                disabled={criterion.tilesCollection.length === 0}
                                name='constraints'
                                icon='eraser'
                                title='Constraints'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeTool === 'reclassification'}
                                disabled={criterion.tilesCollection.length === 0}
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
    criterion: PropTypes.instanceOf(Criterion),
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    onClickTool: PropTypes.func.isRequired
};

export default withRouter(CriteriaDataEditor);
