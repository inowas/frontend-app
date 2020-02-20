import {cloneDeep} from 'lodash';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Viewport} from 'react-leaflet';
import {useSelector} from 'react-redux';
import {DropdownProps, Form, Grid, Header, Segment} from 'semantic-ui-react';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ModflowModel} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import {IRootReducer} from '../../../reducers';
import {fetchUrl} from '../../../services/api';
import ResultsChart from '../../shared/complexTools/ResultsChart';
import ResultsMap from '../../shared/complexTools/ResultsMap';
import ResultsSelectorFlow from '../../shared/complexTools/ResultsSelectorFlow';
import {EResultType} from '../../t03/components/content/results/flowResults';
import {IModelsReducer} from '../reducers/models';

const difference = () => {
    const [results, setResults] = useState<null>(null);
    const [soilmodel, setSoilmodel] = useState<null>(null);
    const [stressperiods, setStressperiods] = useState<null>(null);
    const [models, setModels] = useState<IModelsReducer>({});
    const [selected, setSelected] = useState<[string, string]>(['', '']);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCol, setSelectedCol] = useState<number | null>(null);
    const [selectedLay, setSelectedLay] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [selectedTotim, setSelectedTotim] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);
    const [commonViewPort, setCommonViewPort] = useState<Viewport | null>(null);

    const T07 = useSelector((state: IRootReducer) => state.T07);
    const iBoundaries = T07.boundaries;
    const iModels = T07.models;
    const iScenarioAnalysis = T07.scenarioAnalysis ? ScenarioAnalysis.fromObject(T07.scenarioAnalysis) : null;

    return (
        <div>WIP</div>
    );

    /*useEffect(() => {
        if (iScenarioAnalysis) {
            setModels(iScenarioAnalysis.models);
            setResults(iScenarioAnalysis.results);
            setSelected([models[0].id, models[1].id]);
            setSelectedLay(0);
            setSelectedCol(Math.floor(iScenarioAnalysis.gridSize.nX / 2));
            setSelectedRow(Math.floor(iScenarioAnalysis.gridSize.nY / 2));
            setSelectedTotim(iScenarioAnalysis.results.totalTimes[0]);
            setSoilmodel(iScenarioAnalysis.soilmodel);
            setStressperiods(iScenarioAnalysis.stressperiods);
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (iModels.length !== models.length) {
            fetchData();
        }
    }, [iModels]);

    const fetchData = (layer = selectedLay, totim = selectedTotim, type = selectedType) => {
        if (type === null || layer === null || totim === null) {
            return null;
        }

        const cModels = models.map((m) => {
            m.loading = true;
            return m;
        });

        setModels(cModels);
        setIsLoading(true);

        models.forEach((m) => {
            fetchUrl(
                `calculations/${m.calculation_id}/results/types/${type}/layers/${layer}/totims/${totim}`,
                (data) => {
                    const uModels = cloneDeep(models).map((sm) => {
                        if (m.id === sm.id) {
                            sm.data = data;
                            sm.loading = false;
                            return sm;
                        }
                        return sm;
                    });
                    setModels(uModels);
                },
                (e) => setError(e)
            );
        });
    };

    const handleChangeTypeLayerOrTotim = ({type, layer, totim}: { type: string, layer: number, totim: number }) => {
        if (type === selectedType && layer === selectedLay && totim === selectedTotim) {
            return;
        }

        setSelectedType(type);
        setSelectedLay(layer);
        setSelectedTotim(totim);
        return fetchData(layer, totim, type);
    };

    const diff2DArrays = (a1: Array2D<number>, a2: Array2D<number>) => {
        const res = cloneDeep(a2);
        a1.map(((r, rId) => r.map((v, cId) => res[rId][cId] = a1[rId][cId] - a2[rId][cId])));
        return res;
    };

    const handleSelect = (e: SyntheticEvent, {id, value}: DropdownProps) => {
        if (typeof value === 'string') {
            const cSelected = cloneDeep(selected);
            cSelected[id] = value;
            return setSelected(cSelected);
        }
    };

    const modelOptions = () => {
        if (!models) {
            return [];
        }

        return models.map((m) => (
            {key: m.id, value: m.id, text: m.name}
        ));
    };

    if (results === null || soilmodel === null ||
        stressperiods === null || selectedLay === null || selectedTotim === null) {
        return null;
    }

    const {layerValues, totalTimes} = results;

    if (selected.length !== 2) {
        return;
    }

    const [mId1, mId2] = selected;
    if (!iModels[mId1]) {
        return null;
    }

    const m1 = ModflowModel.fromObject(iModels[mId1]);
    const d1 = iModels.filter((m) => m.id === mId1)[0].data;
    const d2 = iModels.filter((m) => m.id === mId2)[0].data;

    if (!d1 || !d2) {
        return null;
    }

    const diff = diff2DArrays(d1, d2);

    return (
        <div>
            <Segment color={'grey'} loading={isLoading}>
                <ResultsSelectorFlow
                    data={{
                        type: selectedType,
                        layer: selectedLay,
                        totim: selectedTotim,
                    }}
                    onChange={handleChangeTypeLayerOrTotim}
                    layerValues={layerValues}
                    soilmodel={soilmodel}
                    stressperiods={stressperiods}
                    totalTimes={totalTimes}
                />
            </Segment>

            <Segment color={'grey'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={7}>
                            <Form.Dropdown
                                style={{zIndex: 1000}}
                                selection={true}
                                fluid={true}
                                id={0}
                                options={modelOptions()}
                                value={selected[0]}
                                onChange={handleSelect}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Header as={'h4'}>compare with</Header>
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <Form.Dropdown
                                style={{zIndex: 1000}}
                                selection={true}
                                fluid={true}
                                id={1}
                                options={modelOptions()}
                                value={selected[1]}
                                onChange={handleSelect}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <ResultsMap
                                    key={mId1}
                                    activeCell={[selectedCol || 0, selectedRow || 0]}
                                    boundaries={BoundaryCollection.fromObject([])}
                                    data={diff}
                                    model={m1}
                                    onClick={(colRow) => {
                                        setSelectedCol(colRow[0]);
                                        setSelectedRow(colRow[1]);
                                    }}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment>
                                <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                <ResultsChart
                                    data={diff}
                                    col={selectedCol}
                                    row={selectedRow}
                                    show={'row'}
                                />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                <ResultsChart
                                    data={diff}
                                    col={selectedCol}
                                    row={selectedRow}
                                    show={'col'}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );*/
};

export default difference;
