import {BoundaryCollection, Calculation, ModflowModel, Soilmodel} from '../../../core/model/modflow';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IRootReducer} from '../../../reducers';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {List, Loader, Modal} from 'semantic-ui-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import {
    clear, updateBoundaries, updateCalculation, updateModel,
    updateScenarioAnalysis,
    updateSoilmodel
} from '../actions/actions';
import {fetchCalculationDetails, fetchUrl} from '../../../services/api';
import {fetchSoilmodel} from '../../../core/model/modflow/soilmodel/updater/services';
import {useDispatch, useSelector} from 'react-redux';
import React, {ReactNode, useEffect, useState} from 'react';
import updater from '../../../core/model/modflow/soilmodel/updater/updater';

interface IOwnProps {
    children: ReactNode;
    key: string;
}

type IProps = IOwnProps & RouteComponentProps<{ id: string }>;

interface IIdValueObject<T> {
    [id: string]: T;
}

const DataFetcherWrapper = (props: IProps) => {
    const dispatch = useDispatch();

    const [scenarioAnalysisId, setScenarioAnalysisId] = useState<string | null>(null);

    const [showModal, setShowModal] = useState<boolean>(true);

    const T07 = useSelector((state: IRootReducer) => state.T07);
    const {scenarioAnalysis} = T07;
    const boundaries = T07.boundaries;
    const models: IIdValueObject<IModflowModel> = T07.models;
    const calculations: IIdValueObject<ICalculation> = T07.calculations;
    const soilmodels: IIdValueObject<ISoilmodel> = T07.soilmodels;

    useEffect(() => {
        dispatch(clear());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (scenarioAnalysisId !== props.match.params.id) {
            setScenarioAnalysisId(props.match.params.id);
            if (!scenarioAnalysis || scenarioAnalysis.id !== scenarioAnalysisId) {
                fetchScenarioAnalysis(props.match.params.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id]);

    const fetchScenarioAnalysis = (id: string) => {
        if (!scenarioAnalysis) {
            fetchUrl(
                `tools/T07/${id}`,
                (data) => {
                    const cScenarioAnalysis = ScenarioAnalysis.fromObject(data);
                    dispatch(updateScenarioAnalysis(cScenarioAnalysis));
                    [cScenarioAnalysis.basemodelId].concat(cScenarioAnalysis.scenarioIds).forEach(
                        (sId, idx) => fetchModel(sId, 1 + idx)
                    );
                },
                (cError) => {
                    return handleError(cError);
                }
            );
        }
    };

    const fetchModel = (id: string, idx: number) => {
        if (!models[idx]) {
            fetchUrl(
                `modflowmodels/${id}`,
                (data) => {
                    const mfModel = ModflowModel.fromQuery(data);
                    dispatch(updateModel(mfModel, id));
                    fetchAndUpdateSoilmodel(mfModel, id);
                    fetchBoundaries(id);
                    if (mfModel.calculationId) {
                        fetchCalculationDetails(mfModel.calculationId)
                            .then((cData) => {
                                dispatch(updateCalculation(Calculation.fromQuery(cData), id));
                            })
                            .catch((cError) => {
                                // tslint:disable-next-line:no-console
                                console.log(cError);
                            });
                    }
                },
                (cError) => {
                    return handleError(cError);
                });
        }
    };

    const fetchBoundaries = (id: string) => {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            (data) => {
                dispatch(updateBoundaries(BoundaryCollection.fromQuery(data), id));
            },
            (cError) => {
                return handleError(cError);
            });
    };

    const fetchAndUpdateSoilmodel = (model: ModflowModel, id: string) => {
        if (model) {
            fetchUrl(`modflowmodels/${id}/soilmodel`,
                (data) => {
                    updater(
                        data,
                        model,
                        () => null,
                        (result, needsToBeFetched) => {
                            if (needsToBeFetched) {
                                const sm = Soilmodel.fromObject(result);
                                if (sm.checkVersion()) {
                                    return fetchSoilmodel(
                                        result,
                                        () => null,
                                        (r) => {
                                            return dispatch(updateSoilmodel(Soilmodel.fromObject(r), id));
                                        }
                                    );
                                }
                            }
                            return dispatch(updateSoilmodel(Soilmodel.fromObject(result), id));
                        }
                    );
                },
                (cError) => {
                    return handleError(cError);
                }
            );
        }
    };

    const handleError = (dError: any) => {
        // tslint:disable-next-line:no-console
        console.log(dError);
    };

    const renderList = (listItems: Array<{ name: string, loading: boolean, success: boolean | null }>) => (
        listItems.map((item, idx) => (
            <List.Item key={idx}>
                {item.loading ?
                    <List.Icon size="large" verticalAlign="middle">
                        <Loader active={true} inline={true} size="tiny"/>
                    </List.Icon>
                    :
                    <List.Icon
                        name={item.success ? 'check circle' : 'remove circle'}
                        size={'large'}
                        verticalAlign={'middle'}
                    />
                }
                <List.Content>
                    <List.Header>
                        {item.name}
                    </List.Header>
                </List.Content>
            </List.Item>
        ))
    );

    const renderScenarioList = (key: string, idx: number) => {
        return (
            <List.Item key={idx}>
                {!models[key] && !boundaries[key] && !soilmodels[key] && !calculations[key] ?
                    <List.Icon
                        name={(
                            !!models[key] &&
                            !!boundaries[key] && !!soilmodels[key] &&
                            !!calculations[key]
                        ) ? 'check circle' : 'remove circle'
                        }
                        size={'large'}
                    /> :
                    <List.Icon size="large">
                        <Loader active={true} inline={true} size="tiny"/>
                    </List.Icon>
                }
                <List.Content>
                    <List.Header>Model {key}</List.Header>
                    <List.List>
                        {renderList([
                            {
                                name: 'Model',
                                loading: !models[key],
                                success: !!models[key]
                            },
                            {
                                name: 'Boundaries',
                                loading: !boundaries[key],
                                success: !!boundaries[key]
                            },
                            {
                                name: 'Soilmodel',
                                loading: !soilmodels[key],
                                success: !!soilmodels[key]
                            },
                            {
                                name: 'Calculation',
                                loading: !calculations[key],
                                success: !!calculations[key]
                            }
                        ])}
                    </List.List>
                </List.Content>
            </List.Item>
        );
    };

    const everythingIsLoaded = () => {
        const eil: boolean = !!scenarioAnalysis && !!models && !!boundaries && !!soilmodels && !!calculations;
        if (eil) {
            setTimeout(() => setShowModal(false), 1000);
        }
        return eil;
    };

    return (
        <div>
            {everythingIsLoaded() && props.children}
            <Modal size={'small'} closeIcon={false} open={showModal} dimmer={'inverted'}>
                <Modal.Header>Loading Model Data</Modal.Header>
                <Modal.Content>
                    <List>
                        {renderList([
                            {
                                name: 'Scenario analysis', loading: !scenarioAnalysis,
                                success: !!scenarioAnalysis
                            }
                        ])}
                        {scenarioAnalysis && [scenarioAnalysis.data.base_id].concat(scenarioAnalysis.data.scenario_ids)
                            .map((key, idx) => renderScenarioList(key, idx))}
                    </List>
                </Modal.Content>
            </Modal>
        </div>
    );
};

export default withRouter(DataFetcherWrapper);
