import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/mcda';
import {Criterion} from 'core/mcda/criteria';
import {Message, Step} from 'semantic-ui-react';

import {CriteriaRasterUpload} from './index';

class CriteriaDataEditor extends React.Component {

    constructor() {
        super();

        this.state = {
            activeStep: ''
        }
    }

    handleClickStep = (e, {name}) => this.setState({activeStep: name});

    renderTool() {
        switch (this.state.activeStep) {
            default:
                return (
                    <CriteriaRasterUpload
                        mcda={this.props.mcda}
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
                                active={activeStep === '' || activeStep === 'upload'}
                                name='upload'
                                icon='upload'
                                title='Upload'
                                description='Upload raster file'
                                link
                                onClick={this.handleClickStep}
                            />
                            <Step
                                active={activeStep === 'reclassification'}
                                disabled
                                name='reclassification'
                                icon='chart bar'
                                title='Reclassification'
                                description='Reclassify raster values to standardized suitability values'
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
    mcda: PropTypes.instanceOf(MCDA).isRequired
};

export default withRouter(CriteriaDataEditor);
