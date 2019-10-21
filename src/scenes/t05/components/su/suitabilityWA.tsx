import React, {useState} from 'react';
import {Button, Dimmer, Header, Progress} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import {WeightAssignmentsCollection} from '../../../../core/model/mcda/criteria';
import {IMCDA} from '../../../../core/model/mcda/MCDA.type';
import {dropData, retrieveDroppedData} from '../../../../services/api';
import WeightAssignmentTable from './weightAssignmentTable';

interface IProps {
    handleChange: (mcda: MCDA) => any;
    mcda: MCDA;
    readOnly: boolean;
}

const suitabilityWeightAssignment = (props: IProps) => {
    const [calculationState, setCalculationState] = useState<{
        message: string;
        task: number;
    }>({
        message: 'Starting Calculation',
        task: 0
    });
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [numberOfTasks, setNumberOfTasks] = useState<number>(0);
    const {mcda} = props;

    const handleChangeWA = (parent: string | null = null, id: string) => {
        if (props.readOnly) {
            return;
        }

        const wac = mcda.weightAssignmentsCollection.all.map((wa) => {
            if (!mcda.withAhp) {
                wa.isActive = wa.id === id;
                return wa;
            }
            if (wa.id === id || (wa.isActive && parent && wa.parent !== parent)) {
                wa.isActive = true;
            }
            if (wa.isActive && parent && (wa.parent === parent || (!wa.parent && parent === 'main')) &&
                wa.id !== id) {
                wa.isActive = false;
            }

            return wa;
        });

        mcda.weightAssignmentsCollection = WeightAssignmentsCollection.fromObject(wac);
        return props.handleChange(mcda);
    };

    const calculateSuitability = (cMcda: IMCDA) => {
        if (props.readOnly) {
            return;
        }

        const criteriaDataIsConsistent = cMcda.criteria.filter(
            (criterion) => criterion.suitability.url !== '' && criterion.suitability.data.length === 0
        ).length === 0;

        const criteriaConstraintsAreConsistent = cMcda.criteria.filter(
            (criterion) => criterion.constraintRaster.url !== '' && criterion.constraintRaster.data.length === 0
        ).length === 0;

        const constraintsAreConsistent = true; /*cMcda.constraints && (
            !cMcda.constraints.rasterLayer || (
                cMcda.constraints.rasterLayer &&
                cMcda.constraints.rasterLayer.url !== '' &&
                cMcda.constraints.rasterLayer.data.length > 0
            )
        );*/

        if (criteriaDataIsConsistent && constraintsAreConsistent && criteriaConstraintsAreConsistent) {
            setCalculationState({
                task: calculationState.task,
                message: 'Calculating ...'
            });
            const updatedMcda = MCDA.fromObject(cMcda).calculate();
            dropData(
                updatedMcda.suitability.raster.data,
                (response) => {
                    updatedMcda.suitability.raster.url = response.filename;
                    setCalculationState({
                        task: calculationState.task + 1,
                        message: 'Calculation finished'
                    });
                    setIsRunning(false);
                    props.handleChange(updatedMcda);
                },
                (response: string) => {
                    throw new Error(response);
                }
            );
        }
    };

    const getDataAndCalculate = (cMcda: IMCDA) => {
        if (props.readOnly) {
            return;
        }
        const criteria1 = cMcda.criteria.filter(
            (criterion) => criterion.suitability.url !== '' && criterion.suitability.data.length === 0
        );
        const criteria2 = cMcda.criteria.filter(
            (criterion) => criterion.constraintRaster.url !== '' && criterion.constraintRaster.data.length === 0
        );

        if (criteria1.length > 0) {
            const criterion = criteria1[0];
            setCalculationState({
                task: calculationState.task + 1,
                message: `Retrieving reclassified data for criterion ${criterion.name}`
            });

            retrieveDroppedData(
                criterion.suitability.url,
                (response) => {
                    criterion.suitability.data = response[0];
                    cMcda.criteria = cMcda.criteria.map((c) => {
                        if (c.id === criterion.id) {
                            return criterion;
                        }
                        return c;
                    });
                    getDataAndCalculate(cMcda);
                },
                (response: string) => {
                    throw new Error(response);
                }
            );
        }

        if (criteria1.length === 0 && criteria2.length > 0) {
            const criterion = criteria2[0];

            setCalculationState({
                task: calculationState.task + 1,
                message: `Retrieving constraint data for criterion ${criterion.name}`
            });

            retrieveDroppedData(
                criterion.constraintRaster.url,
                (response) => {
                    criterion.constraintRaster.data = response[0];
                    cMcda.criteria = cMcda.criteria.map((c) => {
                        if (c.id === criterion.id) {
                            return criterion;
                        }
                        return c;
                    });
                    getDataAndCalculate(cMcda);
                },
                (response) => {
                    throw new Error(response);
                }
            );
        }

        if (criteria1.length === 0 && criteria2.length === 0) {
            if (cMcda.constraints && cMcda.constraints.rasterLayer && cMcda.constraints.rasterLayer.url !== '' &&
                cMcda.constraints.rasterLayer.data.length === 0) {
                setCalculationState({
                    task: calculationState.task + 1,
                    message: 'Retrieving global constraint data'
                });

                retrieveDroppedData(
                    cMcda.constraints.rasterLayer.url,
                    (response) => {
                        if (cMcda.constraints) {
                            cMcda.constraints.rasterLayer.data = response[0];
                        }
                        getDataAndCalculate(cMcda);
                    },
                    (response) => {
                        throw new Error(response);
                    }
                );
            }
        }

        calculateSuitability(cMcda);
    };

    const handleClickCalculation = () => {
        if (props.readOnly) {
            return;
        }

        const cMcda = props.mcda.toObject();
        const criteria1 = cMcda.criteria.filter(
            (criterion) => criterion.suitability.url !== '' && criterion.suitability.data.length === 0
        );
        const criteria2 = cMcda.criteria.filter(
            (criterion) => criterion.constraintRaster.url !== '' && criterion.constraintRaster.data.length === 0
        );
        /*const globalCon = cMcda.constraints && cMcda.constraints.rasterLayer && cMcda.constraints.rasterLayer.url !== ''
        && cMcda.constraints.rasterLayer.data.length === 0 ? 1 : 0;*/
        const iNumberOfTasks = criteria1.length + criteria2.length + 1; // + globalCon

        setIsRunning(true);
        setNumberOfTasks(iNumberOfTasks);
        setCalculationState({
            message: 'Starting Calculation',
            task: 0
        });

        return getDataAndCalculate(cMcda);
    };

    const progress = numberOfTasks === 0 ? 0 : Math.floor(calculationState.task / numberOfTasks * 100);

    if (isRunning) {
        return (
            <Dimmer active={true} page={true}>
                <Header as="h2" icon={true} inverted={true}>
                    {calculationState.message}
                </Header>
                <Progress percent={progress} indicating={true} progress={true}/>
            </Dimmer>
        );
    }

    return (
        <div>
            <WeightAssignmentTable
                onChange={handleChangeWA}
                mcda={props.mcda}
                readOnly={props.readOnly}
            />
            <Button
                disabled={
                    props.readOnly || !mcda.checkWeightAssignments()
                }
                onClick={handleClickCalculation}
                primary={true}
                fluid={true}
            >
                Start Calculation
            </Button>
        </div>
    );
};

export default suitabilityWeightAssignment;
