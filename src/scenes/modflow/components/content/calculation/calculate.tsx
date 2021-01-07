import {
    CALCULATION_STARTED,
    CALCULATION_STATE_CALCULATING,
    CALCULATION_STATE_CALCULATION_FINISHED
} from './CalculationProgress';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {CalculationButton, CalculationProgress} from './index';
import {Grid, Header, Segment} from 'semantic-ui-react';
import {useDispatch} from 'react-redux';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import React, {useEffect, useState} from 'react';
import RunModelOverviewMap from '../../maps/runModelOverviewMap';
import Terminal from '../../../../shared/complexTools/Terminal';

interface IProps {
    model: ModflowModel;
    packages: FlopyPackages | null;
    calculation: Calculation | null;
    startCalculation: () => {type: string};
}

const Calculate = (props: IProps) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [canBeCalculated, setCanBeCalculated] = useState<boolean>(true);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [showProgress, setShowProgress] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {

        const {calculation, model, packages} = props;

        /*if (model.readOnly) {
            setCanBeCalculated(false);
            setShowProgress(false);
            return;
        }*/

        if (!calculation || !packages) {
            setCanBeCalculated(true);
            setShowProgress(false);
            return;
        }

        if (calculation.state >= CALCULATION_STARTED && calculation.state < CALCULATION_STATE_CALCULATING) {
            setCanBeCalculated(false);
            setShowProgress(true);
        }

        if (calculation.state >= CALCULATION_STARTED && calculation.state < CALCULATION_STATE_CALCULATION_FINISHED) {
            setIsCalculating(true);
        }

        if (calculation.state < CALCULATION_STARTED || calculation.state >= CALCULATION_STATE_CALCULATION_FINISHED) {
            setIsCalculating(false);
        }

        if (model.calculationId === packages.calculation_id) {
            setCanBeCalculated(false);
            setShowProgress(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.calculation, props.model, props.packages]);

    const renderMapOrLog = () => {

        const {calculation, model, packages} = props;

        if (packages && calculation) {
            if (calculation.id === packages.calculation_id
                && calculation.state >= CALCULATION_STATE_CALCULATION_FINISHED) {
                return (
                    <div>
                        <Header as={'h3'}>Log</Header>
                        <Segment color={'black'}>
                            <Terminal content={calculation.message} styles={{fontSize: 8}}/>
                        </Segment>
                    </div>
                );
            }
        }

        return (
            <div>
                <Header as={'h3'}>Map</Header>
                <Segment color={'red'}>
                    <RunModelOverviewMap model={model}/>
                </Segment>
            </div>
        );
    };

    return (
        <Grid padded={true}>
            <Grid.Row>
                <Grid.Column width={6}>
                    <Header as={'h3'}>Calculation</Header>
                    <CalculationButton
                        disabled={false}
                        loading={isCalculating}
                        onClick={() => dispatch(props.startCalculation())}
                        visible={true}
                    />

                    {showProgress &&
                    <div style={{marginTop: 20}}>
                        <Header as={'h3'}>Progress</Header>
                        <Segment>
                            {props.calculation && <CalculationProgress calculation={props.calculation}/>}
                        </Segment>
                    </div>
                    }
                </Grid.Column>
                <Grid.Column width={10}>
                    {renderMapOrLog()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}/>
            </Grid.Row>
        </Grid>
    );
};

export default Calculate;
