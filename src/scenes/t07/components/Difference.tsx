import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {Calculation, ModflowModel, Soilmodel, Stressperiods} from '../../../core/model/modflow';
import {DropdownProps, Form, Grid, Header, Segment} from 'semantic-ui-react';
import {EResultType} from '../../t03/components/content/results/flowResults';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import {cloneDeep} from 'lodash';
import {fetchCalculationResultsFlow} from '../../../services/api';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import ResultsChart from '../../shared/complexTools/ResultsChart';
import ResultsMap from '../../shared/complexTools/ResultsMap';
import ResultsSelectorFlow from '../../shared/complexTools/ResultsSelectorFlow';

interface IProps {
    models: { [id: string]: IModflowModel };
    boundaries: { [id: string]: IBoundary[] };
    calculations: { [id: string]: ICalculation };
    scenarioAnalysis: ScenarioAnalysis;
    soilmodels: { [id: string]: ISoilmodel };
}

const Difference = (props: IProps) => {
    const [selected, setSelected] = useState<[string | null, string | null]>([null, null]);
    const [selectedModels, setSelectedModels] = useState<[IModflowModel, IModflowModel] | null>(null);
    const [data, setData] = useState<{ [id: string]: Array2D<number> }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCol, setSelectedCol] = useState<number>();
    const [selectedLay, setSelectedLay] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<number>();
    const [selectedTotim, setSelectedTotim] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);

    useEffect(() => {
        if (selected[0] && selected[1] && (
            !selectedModels || (
                selectedModels && (selectedModels[0].id !== selected[0] || selectedModels[1].id !== selected[1])
            ))
        ) {
            setSelectedModels([props.models[selected[0]], props.models[selected[1]]]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    useEffect(() => {
        if (selectedModels) {
            const basemodel = ModflowModel.fromObject(selectedModels[0]);
            const basemodelCalculation = Calculation.fromObject(props.calculations[basemodel.id]);
            setSelectedLay(0);
            setSelectedCol(Math.floor(basemodel.gridSize.nX / 2));
            setSelectedRow(Math.floor(basemodel.gridSize.nY / 2));
            if (basemodelCalculation && basemodelCalculation.times) {
                setSelectedTotim(0);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedModels]);

    useEffect(() => {
        if (selectedModels && selectedLay !== null && selectedTotim !== null && selectedType !== null) {
            setIsLoading(true);
            fetchDataRecursive(selectedLay, selectedTotim, selectedType);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLay, selectedTotim, selectedType]);

    const fetchDataRecursive = (
        layer = selectedLay,
        totim = selectedTotim,
        type = selectedType,
        results: { [id: string]: Array2D<number> } = {}
    ) => {
        if (!selectedModels || type === null || layer === null || totim === null) {
            return null;
        }

        const modelToFetch = selectedModels.filter((m) => !(m.id in results));
        if (modelToFetch.length === 0) {
            setIsLoading(false);
            return setData(results);
        }

        let cData = results;
        fetchCalculationResultsFlow({
            calculationId: modelToFetch[0].calculation_id,
            type,
            totim,
            layer
        }, (d) => {
            if (!Array.isArray(d)) {
                throw new Error('Data must be typeof Array!');
            }
            cData = {...results, [modelToFetch[0].id]: d};
            return fetchDataRecursive(layer, totim, type, cData);
        }, () => {
            setIsLoading(false);
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
    };

    const diff2DArrays = (a1: Array2D<number>, a2: Array2D<number>) => {
        const res = cloneDeep(a2);
        a1.map(((r, rId) => r.map((v, cId) => res[rId][cId] = a1[rId][cId] - a2[rId][cId])));
        return res;
    };

    const handleSelectModel = (e: SyntheticEvent, {id, value}: DropdownProps) => {
        if (typeof value === 'string') {
            const cSelected = cloneDeep(selected);
            cSelected[id] = value;
            return setSelected(cSelected);
        }
    };

    const modelOptions = () => {
        if (!props.models) {
            return [];
        }

        return Object.keys(props.models).map((id) => {
            const m = props.models[id];
            return {key: m.id, value: m.id, text: m.name};
        });
    };

    const renderSelector = () => {
        if (!selected[0] || !selected[1]) {
            return;
        }

        const basemodel = props.models[selected[0]];
        const basemodelResults = props.calculations[selected[0]];
        const stressperiods = basemodel.discretization.stressperiods;
        const soilmodel = props.soilmodels[basemodel.id];

        if (!basemodelResults || !basemodelResults.times) {
            return (
                <div>Results not found.</div>
            );
        }

        const layerValues = basemodelResults.layer_values;
        const times = selectedType === EResultType.HEAD ? basemodelResults.times.head : basemodelResults.times.drawdown;

        if (!stressperiods || !soilmodel || selectedLay === null || selectedTotim === null || !times) {
            return (
                <div>Data not found.</div>
            );
        }

        return (
            <Segment color={'grey'} loading={isLoading}>
                <ResultsSelectorFlow
                    data={{
                        type: selectedType,
                        layer: selectedLay,
                        totim: selectedTotim,
                    }}
                    onChange={handleChangeTypeLayerOrTotim}
                    layerValues={layerValues}
                    soilmodel={Soilmodel.fromObject(soilmodel)}
                    stressperiods={Stressperiods.fromObject(stressperiods)}
                    totalTimes={times.total_times}
                />
            </Segment>
        );
    };

    const renderDifferences = () => {
        if (!selectedModels) {
            return (
                <Segment color={'grey'} loading={isLoading}>
                    Two models must be selected!
                </Segment>
            );
        }

        const [mId1, mId2] = selected;
        if (!mId1 || !mId2 || !props.models[mId1]) {
            return (
                <div>id1: {mId1}, id2: {mId2}, ... model not found?</div>
            );
        }

        const m1 = ModflowModel.fromObject(props.models[mId1]);
        const d1 = data[mId1];
        const d2 = data[mId2];

        if (!d1 || !d2) {
            return null;
        }

        const diff = diff2DArrays(d1, d2);

        return (
            <React.Fragment>
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
                                        mode="contour"
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
            </React.Fragment>
        );
    };

    return (
        <div>
            <Segment color={'grey'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={7}>
                            <Form.Dropdown
                                style={{zIndex: 1000}}
                                selection={true}
                                fluid={true}
                                id="0"
                                options={modelOptions()}
                                value={selected[0] || undefined}
                                onChange={handleSelectModel}
                                placeholder="Select scenario 1"
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
                                id="1"
                                options={modelOptions()}
                                value={selected[1] || undefined}
                                onChange={handleSelectModel}
                                placeholder="Select scenario 2"
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            {renderSelector()}
            {renderDifferences()}
        </div>
    );
};

export default Difference;
