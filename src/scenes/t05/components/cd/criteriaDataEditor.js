import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Criterion} from 'core/mcda/criteria';
import {Message, Step} from 'semantic-ui-react';

import {CriteriaDefinition, CriteriaRasterUpload} from './index';

class CriteriaDataEditor extends React.Component {

    constructor() {
        super();

        this.state = {
            activeStep: ''
        }
    }

    handleClickStep = (e, {name}) => this.setState({activeStep: name});

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

    onUploadRaster = data => {
        const cc = this.props.mcda.criteriaCollection;
        const criterion = this.props.criterion;
        criterion.data = data;
        cc.update(criterion);
        return this.props.handleChange({
            name: 'criteria',
            value: cc
        });
    };

    renderTool() {
        switch (this.state.activeStep) {
            case 'upload':
                return (
                    <CriteriaRasterUpload
                        criterion={this.props.criterion}
                        onChange={this.onUploadRaster}
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
        const {activeStep} = this.state;
        const {criterion} = this.props;

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
                                active={activeStep === '' || activeStep === 'definition'}
                                name='definition'
                                icon='info circle'
                                title='Definition'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeStep === 'upload'}
                                name='upload'
                                icon='upload'
                                title='Upload'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeStep === 'reclassification'}
                                disabled
                                name='reclassification'
                                icon='chart bar'
                                title='Reclassification'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeStep === 'results'}
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
    criterion: PropTypes.instanceOf(Criterion),
    handleChange: PropTypes.func.isRequired
};

export default withRouter(CriteriaDataEditor);
