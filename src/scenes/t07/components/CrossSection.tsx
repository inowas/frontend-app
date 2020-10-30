import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {Calculation, ModflowModel, Soilmodel} from '../../../core/model/modflow';
import {EResultType} from '../../t03/components/content/results/flowResults';
import {Grid, Header, Segment} from 'semantic-ui-react';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import {Viewport} from 'react-leaflet';
import {chunk, compact, flatten} from 'lodash';
import {fetchCalculationResultsFlow} from '../../../services/api';
import React, {useEffect, useState} from 'react';
import ResultsChart from '../../shared/complexTools/ResultsChart';
import ResultsMap from '../../shared/complexTools/ResultsMap';
import ResultsSelectorFlow from '../../shared/complexTools/ResultsSelectorFlow';

interface IProps {
    basemodel: ModflowModel;
    basemodelCalculation: Calculation;
    basemodelSoilmodel: Soilmodel;
    models: { [id: string]: IModflowModel };
    boundaries: { [id: string]: IBoundary[] };
    calculations: { [id: string]: ICalculation };
    scenarioAnalysis: ScenarioAnalysis;
    selected: string[];
}

const QUANTILE = 1;

const CrossSection = (props: IProps) => {
    const [selectedModels, setSelectedModels] = useState<IModflowModel[]>([]);
    const [data, setData] = useState<{ [id: string]: Array2D<number> }>({});
    const [layerValues, setLayerValues] = useState<string[][] | null>(null);
    const [totalTimes, setTotalTimes] = useState<number[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCol, setSelectedCol] = useState<number>();
    const [selectedLay, setSelectedLay] = useState<number | null>(0);
    const [selectedRow, setSelectedRow] = useState<number>();
    const [selectedTotim, setSelectedTotim] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);
    const [commonViewPort, setCommonViewPort] = useState<Viewport | undefined>(undefined);

    useEffect(() => {
        const {basemodel, basemodelCalculation} = props;
        const cSelectedModels = props.selected.map((id) => {
            if (props.models.id) {
                return ModflowModel.fromObject(props.models[id]).toObject();
            }
            return null;
        }).filter((e) => e !== null);
        setSelectedLay(0);
        setSelectedCol(Math.floor(basemodel.gridSize.nX / 2));
        setSelectedRow(Math.floor(basemodel.gridSize.nY / 2));
        setSelectedModels(cSelectedModels as IModflowModel[]);
        if (basemodelCalculation.times) {
            setSelectedTotim(basemodelCalculation.times.total_times[0]);
            setTotalTimes(basemodelCalculation.times.total_times);
        }
        setLayerValues(basemodelCalculation.layer_values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedModels.length > 0 && selectedLay !== null && selectedTotim !== null && selectedType !== null) {
            fetchData(selectedLay, selectedTotim, selectedType);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedModels, selectedLay, selectedTotim, selectedType]);

    useEffect(() => {
        if (props.selected.length !== selectedModels.length) {
            const unsortedSelectedModels = Object.values(props.models)
                .filter((m) => props.selected.indexOf(m.id) > -1)
                .map((m) => ModflowModel.fromObject(m));

            const cSelectedModels: IModflowModel[] = [];
            const modelIds = props.scenarioAnalysis.modelIds;
            modelIds.forEach((id) => {
                const filtered = unsortedSelectedModels.filter((m) => m.id === id);
                if (filtered.length === 1) {
                    cSelectedModels.push(filtered[0].toObject());
                }
            });
            setSelectedModels(cSelectedModels);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.models, props.selected]);

    const fetchData = (layer = selectedLay, totim = selectedTotim, type = selectedType) => {
        if (type === null || layer === null || totim === null) {
            return null;
        }

        setIsLoading(true);
        selectedModels.forEach((m) => {
            if (props.selected.indexOf(m.id) >= 0) {
                fetchCalculationResultsFlow({
                    calculationId: m.calculation_id,
                    type,
                    totim,
                    layer
                }, (d) => {
                    setIsLoading(false);
                    if (Array.isArray(d)) {
                        setData({...data, [m.id]: d});
                    }
                }, () => {
                    setIsLoading(false);
                });
            }
        });
    };

    const handleChangeTypeLayerOrTotim = (
        {type, layer, totim}: { type: EResultType, layer: number, totim: number }
    ) => {
        if (type === selectedType && layer === selectedLay && totim === selectedTotim) {
            return;
        }

        setSelectedType(type);
        setSelectedLay(layer);
        setSelectedTotim(totim);
        fetchData(layer, totim, type);
    };

    const renderMap = (id: string, minMax: [number, number]) => {
        const model = ModflowModel.fromObject(props.models[id]);
        const fData = data[id];

        if (!model || !fData) {
            return <Segment loading={true}/>;
        }
        return (
            <Segment>
                <Header as={'h4'}>{model.name}</Header>
                <ResultsMap
                    key={selectedModels.length}
                    activeCell={[selectedCol || 0, selectedRow || 0]}
                    boundaries={BoundaryCollection.fromObject(props.boundaries[id])}
                    data={fData}
                    globalMinMax={minMax}
                    model={model}
                    onClick={(colRow) => {
                        setSelectedCol(colRow[0]);
                        setSelectedRow(colRow[1]);
                    }}
                    viewport={commonViewPort}
                    onViewPortChange={(viewPort) => setCommonViewPort(viewPort)}
                />
            </Segment>
        );
    };

    const renderMaps = (minMax: [number, number]) => {
        let numberOfCols: 1 | 2 = 2;
        if (selectedModels.length === 1) {
            numberOfCols = 1;
        }

        const modelChunks = chunk(selectedModels, numberOfCols);

        return (
            <Grid>
                {modelChunks.map((c, cIdx) => (
                    <Grid.Row key={cIdx} columns={numberOfCols}>
                        {c.map((m) => (
                            <Grid.Column key={m.id}>
                                {renderMap(m.id, minMax)}
                            </Grid.Column>
                        ))}
                    </Grid.Row>
                ))}
            </Grid>
        );
    };

    const calculateGlobalMinMax = (): [number, number] => {
        const sortedValues = compact(flatten(flatten(Object.values(data)))).sort();
        const q = Math.floor(QUANTILE / 100 * sortedValues.length);

        const min = Math.floor(sortedValues[q]);
        const max = Math.ceil(sortedValues[sortedValues.length - q]);
        return [min, max];
    };

    if (selectedLay === null || selectedTotim === null) {
        return null;
    }

    if (selectedModels.length === 0) {
        return null;
    }

    const globalMinMax = calculateGlobalMinMax();

    const mappedModelsForResultChart = selectedModels.map((model) => {
        return {
            id: model.id,
            name: model.name,
            data: data[model.id]
        };
    });

    return (
        <div>
            <Segment color={'grey'} loading={isLoading}>
                {layerValues && totalTimes &&
                <ResultsSelectorFlow
                    data={{
                        type: selectedType,
                        layer: selectedLay,
                        totim: selectedTotim,
                    }}
                    onChange={handleChangeTypeLayerOrTotim}
                    layerValues={layerValues}
                    soilmodel={props.basemodelSoilmodel}
                    stressperiods={props.basemodel.stressperiods}
                    totalTimes={totalTimes}
                />
                }
            </Segment>

            <Segment color={'grey'} loading={isLoading}>
                {renderMaps(globalMinMax)}
            </Segment>

            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment>
                                <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                <ResultsChart
                                    selectedModels={mappedModelsForResultChart}
                                    col={selectedCol}
                                    row={selectedRow}
                                    show={'row'}
                                    globalMinMax={globalMinMax}
                                />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                <ResultsChart
                                    selectedModels={mappedModelsForResultChart}
                                    col={selectedCol}
                                    row={selectedRow}
                                    show={'col'}
                                    globalMinMax={globalMinMax}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

export default CrossSection;
