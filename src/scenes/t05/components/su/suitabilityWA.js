import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from '../../../../core/model/mcda';
import {Button, Dimmer, Loader, Message} from 'semantic-ui-react';
import WeightAssignmentTable from './weightAssignmentTable';
import {WeightAssignmentsCollection} from 'core/model/mcda/criteria';
import {dropData, retrieveDroppedData} from "../../../../services/api";

class SuitabilityWeightAssignment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: {},
            showInfo: true
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

        return this.props.handleChange({
            name: 'weights',
            value: WeightAssignmentsCollection.fromArray(wac)
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

    handleClickCalculation = () => {
        const mcda = this.props.mcda;

        mcda.criteriaCollection.items = mcda.criteriaCollection.all.map(c => {
            this.getRasterData(c.suitability, response => {
                c.suitability = response;
            });
            this.getRasterData(c.constraintRaster, response => {
                c.constraintRaster = response;
            });
            return c;
        });


        this.getRasterData(mcda.constraints.raster, response => {
            mcda.constraints.raster = response;
        });

        console.log('MCDA', mcda);

        if (Object.keys(this.state.isFetching).some(k => !this.state.isFetching[k])) {
            mcda.calculate();

            dropData(
                JSON.stringify(mcda.suitability.raster.data),
                response => {
                    mcda.suitability.raster.url = response.filename;
                    this.props.handleChange({
                        name: 'mcda',
                        value: mcda
                    });
                },
                response => {
                    throw new Error(response)
                }
            );
        }
    };

    render() {
        const {mcda} = this.props;
        const {isFetching, showInfo} = this.state;

        return (
            <div>
                {Object.keys(isFetching).some(k => isFetching[k]) &&
                <Dimmer active inverted>
                    <Loader indeterminate>Preparing Files</Loader>
                </Dimmer>
                }
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