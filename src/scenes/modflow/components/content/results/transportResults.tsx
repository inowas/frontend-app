import {Accordion, AccordionTitleProps, Button, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import {Array2D} from '../../../../../core/model/geometry/Array2D.type';
import {BoundaryCollection, Calculation, ModflowModel, Soilmodel, Transport} from '../../../../../core/model/modflow';
import {GridSize} from '../../../../../core/model/geometry';
import {fetchCalculationResultsTransport, sendCommand} from '../../../../../services/api';
import {useHistory} from 'react-router-dom';
import React, {MouseEvent, useEffect, useState} from 'react';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsMap from '../../maps/resultsMap';
import ResultsSelectorTransport from '../../../../shared/complexTools/ResultsSelectorTransport';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import Uuid from 'uuid';

interface IProps {
    boundaries: BoundaryCollection;
    calculation: Calculation;
    gridSize: GridSize;
    model: ModflowModel;
    soilmodel: Soilmodel;
    transport: Transport;
}

const TransportResults = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [data, setData] = useState<Array2D<number> | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [layerValues, setLayerValues] = useState<string[][] | null>(null);
    const [selectedLay, setSelectedLay] = useState<string>();
    const [selectedRow, setSelectedRow] = useState<number>(Math.floor(props.gridSize.nY / 2));
    const [selectedCol, setSelectedCol] = useState<number>(Math.floor(props.gridSize.nX / 2));
    const [selectedTotim, setSelectedTotim] = useState<number>(0);
    const [selectedSubstance, setSelectedSubstance] = useState<string>();
    const [totalTimes, setTotalTimes] = useState<number[] | null>(null);

    const history = useHistory();

    useEffect(() => {
        const firstSubstance = props.transport.substances.first;
        const firstLayer = props.soilmodel.layersCollection.first;

        fetchData({
            substance: firstSubstance.id,
            layer: firstLayer.id,
            totim: selectedTotim,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.calculation && props.calculation.times) {
            const tt = props.calculation.times.total_times;
            setLayerValues(props.calculation.layer_values);
            setSelectedTotim(tt.slice(-1)[0]);
            setTotalTimes(tt);
        }
    }, [props.calculation]);

    const fetchData = ({substance, layer, totim}: { substance: string, layer: string, totim: number }) => {
        const calculationId = props.calculation.id;
        setIsFetching(true);

        fetchCalculationResultsTransport(
            {calculationId, substance, layer, totim},
            (d) => {
                setSelectedLay(layer);
                setSelectedTotim(totim);
                setSelectedSubstance(substance);
                setIsFetching(false);
                setData(d);
            }, () => null
        );
    }

    const handleClickAccordion = (e: MouseEvent<HTMLDivElement>, titleProps: AccordionTitleProps) => {
        const {index} = titleProps;
        if (typeof index === 'number') {
            const newIndex = activeIndex === index ? -1 : index;
            setActiveIndex(newIndex);
        }
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
            () => history.push('/tools/T07/' + scenarioAnalysisId),
            () => null
        )
    };

    if (!props.calculation) {
        return (
            <Segment color={'grey'}>
                <Header as={'h2'}>
                    No result data found. <br/>
                    Have you started the calculation?
                </Header>
            </Segment>
        );
    }

    return (
        <Segment color={'grey'}>
            <Grid padded>
                <Grid.Row>
                    <Grid.Column>
                        <ResultsSelectorTransport
                            data={{
                                substance: selectedSubstance,
                                layer: selectedLay,
                                totim: selectedTotim,
                            }}
                            onChange={({substance, layer, totim}: {substance: string, layer: string, totim: number}) => {
                                setSelectedSubstance(substance);
                                setSelectedLay(layer);
                                setSelectedTotim(totim);
                                fetchData({substance, layer, totim});
                            }}
                            layerValues={layerValues}
                            soilmodel={props.soilmodel}
                            stressperiods={props.model.stressperiods}
                            totalTimes={totalTimes}
                            transport={props.transport}
                        />

                        <Segment color={'grey'} loading={isFetching}>
                            <Accordion>
                                <Accordion.Title
                                    active={activeIndex === 0}
                                    index={0}
                                                 onClick={handleClickAccordion}
                                >
                                    <Icon name='dropdown'/>
                                    Results Map
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 0}>
                                    {data &&
                                    <ResultsMap
                                        activeCell={[selectedCol, selectedRow]}
                                        boundaries={props.boundaries}
                                        data={data}
                                        model={props.model}
                                        onClick={colRow => {
                                            setSelectedCol(colRow[0]);
                                            setSelectedRow(colRow[1]);
                                        }}
                                        colors={['#0000F0', '#016CFD', '#5FFF97', '#FDCC01', '#E20000']}
                                        opacity={0.75}
                                    />
                                    }
                                </Accordion.Content>
                            </Accordion>
                        </Segment>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Segment loading={isFetching} color={'blue'}>
                                        <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                        {data &&
                                        <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'row'}/>
                                        }
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment loading={isFetching} color={'blue'}>
                                        <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                        {data &&
                                        <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'col'}/>
                                        }
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        {!props.model.readOnly &&
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
}

export default TransportResults;
