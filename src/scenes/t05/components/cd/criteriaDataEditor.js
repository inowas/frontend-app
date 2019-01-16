import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
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
            default:
                return (
                    <CriteriaRasterUpload
                        criterion={this.props.criterion}
                        onChange={this.onUploadRaster}
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
    handleChange: PropTypes.func.isRequired
};

export default withRouter(CriteriaDataEditor);
