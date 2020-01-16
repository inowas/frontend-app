import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid, Header, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand, sendModflowCalculationRequest} from '../../../../../services/api';
import Terminal from '../../../../shared/complexTools/Terminal';
import {updateCalculation} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import RunModelOverviewMap from '../../maps/runModelOverviewMap';
import CalculationStatus, {CALCULATION_STATE_NEW} from './CalculationStatus';
import {CalculationButton} from './index';

const calculate = () => {

        const [canBeCalculated, setCanBeCalculated] = useState<boolean>(true);
        const [isCalculating, setIsCalculating] = useState<boolean>(true);
        const [sending, setSending] = useState<boolean>(false);
        const [showProgress, setShowProgress] = useState<boolean>(false);

        const dispatch = useDispatch();

        const model = useSelector(
            (state: IRootReducer) => state.T03.model ? ModflowModel.fromObject(state.T03.model) : null
        );
        const packages = useSelector(
            (state: IRootReducer) => state.T03.packages.data ? FlopyPackages.fromObject(state.T03.packages.data) : null
        );
        const calculation = useSelector(
            (state: IRootReducer) => state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null
        );

        if (!(model instanceof ModflowModel)) {
            return null;
        }

        const {calculationId} = model;

        if (!(packages instanceof FlopyPackages)) {
            return null;
        }

        if (calculation instanceof Calculation) {
            if (calculation.state > 0 && calculation.state < 100 && canBeCalculated) {
                setCanBeCalculated(false);
            }

            if (calculation.state >= 0 && calculation.state < 100 && !isCalculating) {
                setIsCalculating(true);
            }
        }

        if (calculationId === packages.calculation_id && canBeCalculated) {
            setCanBeCalculated(false);
        }

        const onStartCalculationClick = async () => {
            setSending(true);
            const packagesValidation = await packages.validate(true);
            if (packagesValidation[0] === false) {
                return;
            }

            const response = await sendModflowCalculationRequest(packages);
            if (response.status !== 200) {
                return;
            }

            sendCommand(
                ModflowModelCommand.updateModflowModelCalculationId(model.id, calculationId),
                () => dispatch(
                    updateCalculation(Calculation.fromCalculationIdAndState(calculationId, CALCULATION_STATE_NEW))
                ),
                () => {
                }
            );
        };

        const renderCalculationProgress = () => {
            if (calculation instanceof Calculation) {
                if (calculation.state > 0 && calculation.state < 100 && !showProgress) {
                    setShowProgress(true);
                }
            }

            if (calculationId === packages.calculation_id && !showProgress) {
                setShowProgress(true);
            }

            if (showProgress) {
                return (
                    <div style={{marginTop: 20}}>
                        <Header as={'h3'}>Progress</Header>
                        <Segment>
                            {calculation && <CalculationStatus calculation={calculation}/>}
                        </Segment>
                    </div>
                );
            }

            return null;
        };

        const renderMapOrLog = () => {
            if (calculationId === packages.calculation_id && calculation && calculation.state >= 200) {
                return (
                    <div>
                        <Header as={'h3'}>Log</Header>
                        <Segment color={'black'}>
                            <Terminal content={calculation.message} styles={{fontSize: 8}}/>
                        </Segment>
                    </div>
                );
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
                        <CalculationButton/>
                        {!model.readOnly && renderCalculationProgress()}

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
    }
;

export default calculate;
