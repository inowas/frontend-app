import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Button, Grid, Header, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {FlopyModflowMfbas} from '../../../../../core/model/flopy/packages/mf';
import {Array2D} from '../../../../../core/model/geometry/Array2D.type';
import {Calculation, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IRootReducer} from '../../../../../reducers';
import {fetchCalculationResultsFlow, sendCommand} from '../../../../../services/api';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsSelectorFlow from '../../../../shared/complexTools/ResultsSelectorFlow';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import ResultsMap from '../../maps/resultsMap';

export enum EResultType {
    DRAWDOWN = 'drawdown',
    HEAD = 'head'
}

const flowResults = () => {
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedLay, setSelectedLay] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [selectedCol, setSelectedCol] = useState<number>(0);
    const [selectedTotim, setSelectedTotim] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);
    const [layerValues, setLayerValues] = useState<string[][] | null>(null);
    const [totalTimes, setTotalTimes] = useState<number[] | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [data, setData] = useState<Array2D<number> | null>(null);
    const [ibound, setIbound] = useState<Array2D<number>>();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const calculation = T03.calculation ? Calculation.fromObject(T03.calculation) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const packages = T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    const history = useHistory();

    if (!boundaries || !calculation || !model || !packages || !soilmodel) {
        return (
            <Segment color={'grey'} loading={isLoading}>
                <Header as={'h2'}>
                    No result data found. <br/>
                    Have you started the calculation?
                </Header>
            </Segment>
        );
    }

    useEffect(() => {
        setSelectedCol(Math.floor(model.gridSize.nX / 2));
        setSelectedRow(Math.floor(model.gridSize.nY / 2));
        if (calculation && calculation.times) {
            fetchData({
                layer: selectedLay,
                totim: calculation.times.total_times[0],
                type: selectedType
            });
        }
    }, []);

    useEffect(() => {
        const mfPackage = packages.mf.getPackage('bas');
        if (mfPackage instanceof FlopyModflowMfbas) {
            const cIbound = mfPackage.ibound;
            if (Array.isArray(cIbound) && Array.isArray(cIbound[0]) && cIbound.length > selectedLay) {
                const sIbound = cIbound as Array<Array2D<number>>;
                return setIbound(sIbound[selectedLay]);
            }
        }
        return setIbound(undefined);
    }, [selectedLay]);

    useEffect(() => {
        if (calculation && calculation.times) {
            const cTotalTimes = calculation.times.total_times;
            setLayerValues(calculation.layer_values);
            setSelectedTotim(cTotalTimes.slice(-1)[0]);
            setTotalTimes(cTotalTimes);
        }
    }, [calculation]);

    const fetchData = ({layer, totim, type}: { layer: number, totim: number, type: EResultType }) => {
        if (!calculation) {
            return null;
        }
        const calculationId = calculation.id;
        setIsLoading(true);

        fetchCalculationResultsFlow({calculationId, layer, totim, type}, (cData: Array2D<number>) => {
                setSelectedLay(layer);
                setSelectedType(type);
                setSelectedTotim(totim);
                setData(cData);
                setIsLoading(false);
            },
            () => setIsError(true)
        );
    };

    const handleCreateScenarioAnalysisClick = () => {
        const scenarioAnalysisId = Uuid.v4();
        sendCommand(ScenarioAnalysisCommand.createScenarioAnalysis(
            scenarioAnalysisId,
            model.id,
            'New scenario analysis ' + model.name,
            '',
            model.isPublic
            ),
            () => history.push('/tools/T07/' + scenarioAnalysisId),
            () => setIsError(true)
        );
    };

    const handleChangeSelector = ({type, layer, totim}: { type: EResultType, layer: number, totim: number }) => {
        setSelectedType(type);
        setSelectedLay(layer);
        setSelectedTotim(totim);
        fetchData({layer, totim, type});
    };

    const handleClickOnCell = (colRow: number[]) => {
        setSelectedRow(colRow[1]);
        setSelectedCol(colRow[0]);
    };

    return (
        <Segment color={'grey'} loading={isLoading}>
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column>
                        {totalTimes && layerValues &&
                        <ResultsSelectorFlow
                            data={{
                                type: selectedType,
                                layer: selectedLay,
                                totim: selectedTotim,
                            }}
                            onChange={handleChangeSelector}
                            layerValues={layerValues}
                            soilmodel={soilmodel}
                            stressperiods={model.stressperiods}
                            totalTimes={totalTimes}
                        />
                        }
                        <Segment color={'grey'} loading={isLoading}>
                            {data &&
                            <ResultsMap
                                activeCell={[selectedCol, selectedRow]}
                                boundaries={boundaries}
                                data={data}
                                ibound={ibound}
                                mode="contour"
                                model={model}
                                onClick={handleClickOnCell}
                            />
                            }
                        </Segment>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Segment loading={isLoading} color={'blue'}>
                                        <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                        {data &&
                                        <ResultsChart
                                            data={data}
                                            col={selectedCol}
                                            row={selectedRow}
                                            show={'row'}
                                            yLabel={selectedType}
                                        />
                                        }
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment loading={isLoading} color={'blue'}>
                                        <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                        {data &&
                                        <ResultsChart
                                            data={data}
                                            col={selectedCol}
                                            row={selectedRow}
                                            show={'col'}
                                            yLabel={selectedType}
                                        />
                                        }
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        {!model.readOnly &&
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <Button
                                        onClick={handleCreateScenarioAnalysisClick}
                                    >
                                        Create Scenario Analysis
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default flowResults;
