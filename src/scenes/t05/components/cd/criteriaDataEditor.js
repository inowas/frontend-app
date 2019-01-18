import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/mcda';
import {Criterion} from 'core/mcda/criteria';
import {Message, Step} from 'semantic-ui-react';

import {CriteriaDefinition, CriteriaReclassification, CriteriaRasterUpload} from './index';

class CriteriaDataEditor extends React.Component {

    handleClickStep = (e, {name}) => this.props.onClickTool(name);

    handleChange = criterion => {
        if(!(criterion instanceof Criterion)) {
            throw new Error('Criterion expected to be instance of Criterion.');
        }

        console.log('UPDATING', criterion);

        const cc = this.props.mcda.criteriaCollection;
        cc.update(criterion);

        return this.props.handleChange({
            name: 'criteria',
            value: cc
        });
    };

    renderTool() {
        switch (this.props.activeTool) {
            case 'upload':
                return (
                    <CriteriaRasterUpload
                        criterion={this.props.criterion}
                        onChange={this.handleChange}
                    />
                );
            case 'reclassification':
                return (
                    <CriteriaReclassification
                        criterion={this.props.criterion}
                        onChange={this.handleChange}
                    />
                );
            default:
                return (
                    <CriteriaDefinition
                        criterion={this.props.criterion}
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
                                active={activeTool === '' || activeTool === 'definition'}
                                name='definition'
                                icon='info circle'
                                title='Definition'
                                link
                                onClick={this.handleClickStep}
                            />
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
                                disabled={criterion.raster.data.length === 0}
                                name='reclassification'
                                icon='chart bar'
                                title='Reclassification'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeTool === 'results'}
                                disabled
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
