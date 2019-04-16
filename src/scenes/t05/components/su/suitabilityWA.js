import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from '../../../../core/model/mcda';
import {Button, Dimmer, Header, Message, Progress} from 'semantic-ui-react';
import WeightAssignmentTable from './weightAssignmentTable';
import {WeightAssignmentsCollection} from 'core/model/mcda/criteria';
import {dropData, retrieveDroppedData} from 'services/api';

class SuitabilityWeightAssignment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            calculationState: {
                message: 'Starting Calculation',
                task: 0
            },
            isRunning: false,
            numberOfTasks: 0,
            showInfo: true,
            openRequests: null
        }
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleChangeWA = (parentId = null) => (e, {name}) => {
        const {mcda} = this.props;

        const wac = mcda.weightAssignmentsCollection.toArray().map(wa => {
            if (!mcda.withAhp) {
                wa.isActive = wa.id === name;
                return wa;
            }
            if (wa.id === name || (wa.isActive && parentId && wa.parent !== parentId)) {
                wa.isActive = true;
            }
            if (wa.isActive && parentId && (wa.parent === parentId || (!wa.parent && parentId === 'main')) && wa.id !== name) {
                wa.isActive = false;
            }

            return wa;
        });

        mcda.weightAssignmentsCollection = WeightAssignmentsCollection.fromArray(wac);
        return this.props.handleChange(mcda);
    };

    calculateSuitability(mcda) {
        const criteriaDataIsConsistent = mcda.criteria.filter(criterion => criterion.suitability.url !== '' && criterion.suitability.data.length === 0).length === 0;
        const criteriaConstraintsAreConsistent = mcda.criteria.filter(criterion => criterion.constraintRaster.url !== '' && criterion.constraintRaster.data.length === 0).length === 0;
        const constraintsAreConsistent = !mcda.constraints.raster || (mcda.constraints.raster && mcda.constraints.raster.url !== '' && mcda.constraints.raster.data.length > 0);

        if (criteriaDataIsConsistent && constraintsAreConsistent && criteriaConstraintsAreConsistent) {
            this.setState(prevState => ({
                calculationState: {
                    task: prevState.calculationState.task,
                    message: 'Calculating ...'
                }
            }));
            const updatedMcda = MCDA.fromObject(mcda).calculate();
            dropData(
                updatedMcda.suitability.raster.data,
                response => {
                    updatedMcda.suitability.raster.url = response.filename;
                    this.setState(prevState => ({
                        calculationState: {
                            task: prevState.calculationState.task + 1,
                            message: 'Calculation finished'
                        },
                        isRunning: false
                    }));
                    this.props.handleChange(updatedMcda);
                },
                response => {
                    throw new Error(response)
                }
            );
        }
    }

    getDataAndCalculate(mcda) {
        const criteria1 = mcda.criteria.filter(criterion => criterion.suitability.url !== '' && criterion.suitability.data.length === 0);
        const criteria2 = mcda.criteria.filter(criterion => criterion.constraintRaster.url !== '' && criterion.constraintRaster.data.length === 0);

        if (criteria1.length > 0) {
            const criterion = criteria1[0];

            this.setState(prevState => ({
                calculationState: {
                    task: prevState.calculationState.task + 1,
                    message: `Retrieving reclassified data for criterion ${criterion.name}`
                }
            }));

            retrieveDroppedData(
                criterion.suitability.url,
                response => {
                    criterion.suitability.data = response;
                    mcda.criteria = mcda.criteria.map(c => {
                        if (c.id === criterion.id) {
                            return criterion;
                        }
                        return c;
                    });
                    this.getDataAndCalculate(mcda);
                },
                response => {
                    throw new Error(response);
                }
            );
        }

        if (criteria1.length === 0 && criteria2.length > 0) {
            const criterion = criteria2[0];

            this.setState(prevState => ({
                calculationState: {
                    task: prevState.calculationState.task + 1,
                    message: `Retrieving constraint data for criterion ${criterion.name}`
                }
            }));

            retrieveDroppedData(
                criterion.constraintRaster.url,
                response => {
                    criterion.constraintRaster.data = response;
                    mcda.criteria = mcda.criteria.map(c => {
                        if (c.id === criterion.id) {
                            return criterion;
                        }
                        return c;
                    });
                    this.getDataAndCalculate(mcda);
                },
                response => {
                    throw new Error(response);
                }
            );
        }

        if (criteria1.length === 0 && criteria2.length === 0) {
            if (mcda.constraints.raster && mcda.constraints.raster.url !== '' && mcda.constraints.raster.data.length === 0) {
                this.setState(prevState => ({
                    calculationState: {
                        task: prevState.calculationState.task + 1,
                        message: 'Retrieving global constraint data'
                    }
                }));

                retrieveDroppedData(
                    mcda.constraints.raster.url,
                    response => {
                        mcda.constraints.raster.data = response;
                        this.getDataAndCalculate(mcda);
                    },
                    response => {
                        throw new Error(response);
                    }
                );
            }
        }

        this.calculateSuitability(mcda);
    }

    handleClickCalculation = () => {
        const mcda = this.props.mcda.toObject();
        const criteria1 = mcda.criteria.filter(criterion => criterion.suitability.url !== '' && criterion.suitability.data.length === 0);
        const criteria2 = mcda.criteria.filter(criterion => criterion.constraintRaster.url !== '' && criterion.constraintRaster.data.length === 0);
        const globalCon = mcda.constraints.raster && mcda.constraints.raster.url !== '' && mcda.constraints.raster.data.length === 0 ? 1 : 0;
        const numberOfTasks = criteria1.length + criteria2.length + globalCon + 1;

        this.setState({
            isRunning: true,
            numberOfTasks: numberOfTasks,
            calculationState: {
                message: 'Starting Calculation',
                task: 0
            }
        });

        return this.getDataAndCalculate(mcda);
    };

    render() {
        let mcda = this.props.mcda;
        const {calculationState, numberOfTasks, isRunning, showInfo} = this.state;
        const progress = numberOfTasks === 0 ? 0 : Math.floor(calculationState.task / numberOfTasks * 100);

        if (isRunning) {
            return (
                <Dimmer active page>
                    <Header as='h2' icon inverted>
                        {calculationState.message}
                    </Header>
                    <Progress percent={progress} indicating progress/>
                </Dimmer>
            );
        }

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Suitability</Message.Header>
                    <p>...</p>
                </Message>
                }

                <WeightAssignmentTable
                    handleChange={this.handleChangeWA}
                    mcda={this.props.mcda}
                />
                <Button
                    disabled={mcda.weightAssignmentsCollection.findBy('isActive', true).length < 1}
                    onClick={this.handleClickCalculation}
                    primary
                    fluid
                >
                    Start Calculation
                </Button>

            </div>
        );
    }
}

SuitabilityWeightAssignment.proptypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
};

export default SuitabilityWeightAssignment;