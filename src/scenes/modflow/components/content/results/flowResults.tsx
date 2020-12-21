import {Array2D} from '../../../../../core/model/geometry/Array2D.type';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Button, Grid, Header, Segment} from 'semantic-ui-react';
import {Calculation, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {FlopyModflowMfbas} from '../../../../../core/model/flopy/packages/mf';
import {IT03Reducer} from '../../../../t03/reducers';
import {IT20Reducer} from '../../../../t20/reducers';
import {fetchCalculationResultsFlow, sendCommand} from '../../../../../services/api';
import {useHistory} from 'react-router-dom';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import React, {useEffect, useState} from 'react';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsMap from '../../maps/resultsMap';
import ResultsSelectorFlow from '../../../../shared/complexTools/ResultsSelectorFlow';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import Uuid from 'uuid';

export enum EResultType {
    DRAWDOWN = 'drawdown',
    HEAD = 'head'
}

interface IProps {
    reducer: IT03Reducer | IT20Reducer;
}

const FlowResults = (props: IProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedLay, setSelectedLay] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [selectedCol, setSelectedCol] = useState<number>(0);
    const [selectedTotim, setSelectedTotim] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);
    const [layerValues, setLayerValues] = useState<string[][] | null>(null);
    const [totalTimes, setTotalTimes] = useState<number[] | null>(null);
    const [data, setData] = useState<Array2D<number> | null>(null);
    const [ibound, setIbound] = useState<Array2D<number>>();

    const boundaries = props.reducer.boundaries ? BoundaryCollection.fromObject(props.reducer.boundaries) : null;
    const calculation = props.reducer.calculation ? Calculation.fromObject(props.reducer.calculation) : null;
    const model = props.reducer.model ? ModflowModel.fromObject(props.reducer.model) : null;
    const packages = props.reducer.packages.data ? FlopyPackages.fromObject(props.reducer.packages.data) : null;
    const soilmodel = props.reducer.soilmodel ? Soilmodel.fromObject(props.reducer.soilmodel) : null;

    const history = useHistory();

    useEffect(() => {
        if (model === null || calculation === null) {
            return;
        }

        setSelectedCol(Math.floor(model.gridSize.nX / 2));
        setSelectedRow(Math.floor(model.gridSize.nY / 2));
        if (calculation && calculation.times) {
            fetchData({
                layer: selectedLay,
                totim: calculation.times.head.idx[calculation.times.head.idx.length - 1],
                type: selectedType
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (packages === null) {
            return;
        }
        const mfPackage = packages.mf.getPackage('bas');
        if (mfPackage instanceof FlopyModflowMfbas) {
            const cIbound = mfPackage.ibound;
            if (Array.isArray(cIbound) && Array.isArray(cIbound[0]) && cIbound.length > selectedLay) {
                const sIbound = cIbound as Array<Array2D<number>>;
                return setIbound(sIbound[selectedLay]);
            }
        }
        return setIbound(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLay]);

    useEffect(() => {
        if (calculation && calculation.times) {
            const times = selectedType === EResultType.HEAD ? calculation.times.head : calculation.times.drawdown;
            setLayerValues(calculation.layer_values);
            setSelectedTotim(times.idx.slice(-1)[0]);
            setTotalTimes(times.total_times);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calculation]);

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
            () => null
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
            () => null
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

export default FlowResults;
