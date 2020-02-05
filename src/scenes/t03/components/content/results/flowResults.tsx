import React, {MouseEvent, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Accordion, AccordionProps, Button, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Array2D} from '../../../../../core/model/geometry/Array2D.type';
import {Calculation, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {fetchCalculationResultsFlow, sendCommand} from '../../../../../services/api';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsSelectorFlow from '../../../../shared/complexTools/ResultsSelectorFlow';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import ResultsMap from '../../maps/resultsMap';

interface IStateProps {
    boundaries: BoundaryCollection;
    calculation: Calculation | null;
    model: ModflowModel;
    soilmodel: Soilmodel;
}

type IProps = IStateProps & RouteComponentProps<{
    id: string;
    property?: string;
    type?: string;
}>;

enum EResultType {
    DRAWDOWN = 'drawdown',
    HEAD = 'head'
}

const flowResults = (props: IProps) => {
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedLay, setSelectedLay] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<number>(Math.floor(props.model.gridSize.nY / 2));
    const [selectedCol, setSelectedCol] = useState<number>(Math.floor(props.model.gridSize.nX / 2));
    const [selectedTotim, setSelectedTotim] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);
    const [layerValues, setLayerValues] = useState<string[][] | null>(null);
    const [totalTimes, setTotalTimes] = useState<number[] | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [data, setData] = useState<Array2D<number> | null>(null);

    useEffect(() => {
        if (props.calculation && props.calculation.times) {
            fetchData({
                layer: selectedLay,
                totim: props.calculation.times.total_times[0],
                type: selectedType
            });
        }
    }, []);

    useEffect(() => {
        if (props.calculation && props.calculation.times) {
            const cTotalTimes = props.calculation.times.total_times;
            setLayerValues(props.calculation.layer_values);
            setSelectedTotim(cTotalTimes.slice(-1)[0]);
            setTotalTimes(cTotalTimes);
        }
    }, [props.calculation]);

    const fetchData = ({layer, totim, type}: { layer: number, totim: number, type: EResultType }) => {
        if (!props.calculation) {
            return null;
        }
        const calculationId = props.calculation.id;
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

    const handleClickAccordion = (e: MouseEvent, titleProps: AccordionProps) => {
        const {index} = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        return setActiveIndex(newIndex);
    };

    const handleCreateScenarioAnalysisClick = () => {
        const scenarioAnalysisId = Uuid.v4();
        sendCommand(ScenarioAnalysisCommand.createScenarioAnalysis(
            scenarioAnalysisId,
            props.model.id,
            'New scenario analysis ' + props.model.name,
            '',
            props.model.isPublic
            ),
            () => props.history.push('/tools/T07/' + scenarioAnalysisId),
            () => setIsError(true)
        );
    };

    const handleChangeSelector = ({type, layer, totim}: { type: EResultType, layer: number, totim: number }) => {
        setSelectedType(type);
        setSelectedLay(layer);
        setSelectedTotim(totim);
        fetchData({layer, totim, type});
    };

    const {model, boundaries, soilmodel, calculation} = props;

    if (!(calculation instanceof Calculation)) {
        return (
            <Segment color={'grey'} loading={isLoading}>
                <Header as={'h2'}>
                    No result data found. <br/>
                    Have you started the calculation?
                </Header>
            </Segment>
        );
    }

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
                            <Accordion>
                                <Accordion.Title
                                    active={activeIndex === 0}
                                    index={0}
                                    onClick={handleClickAccordion}
                                >
                                    <Icon name="dropdown"/>
                                    Results Map
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 0}>
                                    {data &&
                                    <ResultsMap
                                        activeCell={[selectedCol, selectedRow]}
                                        boundaries={boundaries}
                                        data={data}
                                        model={model}
                                        onClick={(colRow) => {
                                            setSelectedRow(colRow[1]);
                                            setSelectedCol(colRow[0]);
                                        }}
                                    />
                                    }
                                </Accordion.Content>
                            </Accordion>
                        </Segment>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Segment loading={isLoading} color={'blue'}>
                                        <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                        {data &&
                                        <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'row'}/>
                                        }
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment loading={isLoading} color={'blue'}>
                                        <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                        {data &&
                                        <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'col'}/>
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

const mapStateToProps = (state: any) => ({
    boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
    model: ModflowModel.fromObject(state.T03.model),
    soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
});

export default withRouter(connect<IStateProps>(mapStateToProps)(flowResults));
