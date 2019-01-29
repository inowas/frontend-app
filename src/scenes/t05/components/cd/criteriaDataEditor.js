import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {Criterion} from 'core/model/mcda/criteria';
import {Message, Step} from 'semantic-ui-react';

import {CriteriaReclassification, CriteriaRasterUpload} from './index';
import CriteriaDataResults from './criteriaDataResults';

class CriteriaDataEditor extends React.Component {

    handleClickStep = (e, {name}) => this.props.onClickTool(name);

    handleChange = criterion => {
        if(!(criterion instanceof Criterion)) {
            throw new Error('Criterion expected to be instance of Criterion.');
        }

        const cc = this.props.mcda.criteriaCollection;
        cc.update(criterion);

        return this.props.handleChange({
            name: 'criteria',
            value: cc
        });
    };

    renderTool() {
        if (!this.props.criterion) {
            return;
        }

        switch (this.props.activeTool) {
            case 'reclassification':
                return (
                    <CriteriaReclassification
                        criterion={this.props.criterion}
                        onChange={this.handleChange}
                    />
                );
            case 'results':
                return (
                    <CriteriaDataResults
                        criterion={this.props.criterion}
                        onChange={this.handleChange}
                    />
                );
            default:
                return (
                    <CriteriaRasterUpload
                        criterion={this.props.criterion}
                        gridSize={this.props.mcda.constraints.gridSize}
                        onChange={this.handleChange}
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
                    content='Select a criterion from the navigation on the bottom left.'
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
