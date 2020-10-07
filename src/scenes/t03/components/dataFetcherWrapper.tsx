import React, {ReactNode, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {List, Message, Modal} from 'semantic-ui-react';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import {Calculation, ModflowModel, Soilmodel, Transport, VariableDensity} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {fetchSoilmodel} from '../../../core/model/modflow/soilmodel/updater/services';
import updater from '../../../core/model/modflow/soilmodel/updater/updater';
import {IRootReducer} from '../../../reducers';
import {fetchCalculationDetails, fetchUrl} from '../../../services/api';
import {
    clear,
    updateBoundaries,
    updateCalculation,
    updateModel,
    updatePackages,
    updateSoilmodel,
    updateTransport,
    updateVariableDensity
} from '../actions/actions';

interface IOwnProps {
    children: ReactNode;
}

type IProps = IOwnProps & RouteComponentProps<{ id: string }>;

const dataFetcherWrapper = (props: IProps) => {

    const dispatch = useDispatch();

    const [modelId, setModelId] = useState<string | null>(null);

    const [fetchingModel, setFetchingModel] = useState<boolean>(false);
    const [fetchingModelSuccess, setFetchingModelSuccess] = useState<boolean | null>(null);

    const [fetchingBoundaries, setFetchingBoundaries] = useState<boolean>(false);
    const [fetchingBoundariesSuccess, setFetchingBoundariesSuccess] = useState<boolean | null>(null);

    const [fetchingPackages, setFetchingPackages] = useState<boolean>(false);
    const [fetchingPackagesSuccess, setFetchingPackagesSuccess] = useState<boolean | null>(null);

    const [fetchingSoilmodel, setFetchingSoilmodel] = useState<boolean>(false);
    const [fetchingSoilmodelSuccess, setFetchingSoilmodelSuccess] = useState<boolean | null>(null);

    const [fetchingTransport, setFetchingTransport] = useState<boolean>(false);
    const [fetchingTransportSuccess, setFetchingTransportSuccess] = useState<boolean | null>(null);

    const [fetchingVariableDensity, setFetchingVariableDensity] = useState<boolean>(false);
    const [fetchingVariableDensitySuccess, setFetchingVariableDensitySuccess] = useState<boolean | null>(null);

    const [showModal, setShowModal] = useState<boolean>(true);

    const [soilmodelFetcher, setSoilmodelFetcher] = useState<{
        message: string;
        fetching: boolean;
    }>({
        message: 'Start Fetching Soilmodel ...',
        fetching: false
    });

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const {model, soilmodel, boundaries, packages, variableDensity, transport} = T03;

    useEffect(() => {
        dispatch(clear());
    }, []);

    useEffect(() => {
        if (modelId !== props.match.params.id) {
            setModelId(props.match.params.id);
        }
    }, [props.match.params.id]);

    useEffect(() => {
        fetchModel(props.match.params.id);
    }, [modelId]);

    const fetchModel = (id: string) => {
        if (!fetchingModel) {
            setFetchingModel(true);
            fetchUrl(
                `modflowmodels/${id}`,
                (data) => {
                    const mfModel = ModflowModel.fromQuery(data);
                    dispatch(updateModel(mfModel));
                    setFetchingModel(false);
                    setFetchingModelSuccess(true);

                    fetchBoundaries(id);
                    fetchPackages(id);
                    fetchAndUpdateSoilmodel(mfModel);
                    fetchTransport(id);
                    fetchVariableDensity(id);

                    if (mfModel.calculationId) {
                        fetchCalculationDetails(mfModel.calculationId)
                            .then((cData) => dispatch(updateCalculation(Calculation.fromQuery(cData))))
                            // tslint:disable-next-line:no-console
                            .catch((cError) => console.log(cError));
                    }
                },
                (cError) => {
                    setFetchingModel(false);
                    setFetchingModelSuccess(false);
                    return handleError(cError);
                });
        }
    };

    const fetchBoundaries = (id: string) => {
        setFetchingBoundaries(true);
        fetchUrl(`modflowmodels/${id}/boundaries`,
            (data) => {
                dispatch(updateBoundaries(BoundaryCollection.fromQuery(data)));
                setFetchingBoundaries(false);
                setFetchingBoundariesSuccess(true);
            },
            (cError) => {
                setFetchingBoundaries(false);
                setFetchingBoundariesSuccess(false);
                return handleError(cError);
            });
    };

    const fetchAndUpdateSoilmodel = (mfModel: ModflowModel) => {
        const id = mfModel.id;
        setFetchingSoilmodel(true);
        fetchUrl(`modflowmodels/${id}/soilmodel`,
            (data) => {

                setSoilmodelFetcher({
                    message: 'Start updating soilmodel.',
                    fetching: true
                });
                updater(
                    data,
                    mfModel,
                    (result) => setSoilmodelFetcher({
                        message: result.message,
                        fetching: true
                    }),
                    (result, needsToBeFetched) => {
                        setSoilmodelFetcher({
                            message: 'Finished updating soilmodel.',
                            fetching: false
                        });

                        setFetchingSoilmodel(false);
                        setFetchingSoilmodelSuccess(true);

                        if (needsToBeFetched) {
                            setSoilmodelFetcher({
                                message: `Start fetching soilmodel...`,
                                fetching: true
                            });

                            const sm = Soilmodel.fromObject(result);
                            if (sm.checkVersion()) {
                                return fetchSoilmodel(
                                    result,
                                    (r) => setSoilmodelFetcher(r),
                                    (r) => {
                                        setSoilmodelFetcher({
                                            message: 'Finished fetching soilmodel.',
                                            fetching: false
                                        });
                                        return dispatch(updateSoilmodel(Soilmodel.fromObject(r)));
                                    }
                                );
                            }
                        }

                        return dispatch(updateSoilmodel(Soilmodel.fromObject(result)));
                    }
                );
            },
            (cError) => {
                setFetchingSoilmodel(false);
                setFetchingSoilmodelSuccess(false);
                return handleError(cError);
            });
    };

    const fetchPackages = (id: string) => {
        setFetchingPackages(true);
        fetchUrl(`modflowmodels/${id}/packages`,
            (data) => {
                setFetchingPackages(false);
                setFetchingPackagesSuccess(true);
                const p = FlopyPackages.fromQuery(data);
                if (p) {
                    return dispatch(updatePackages(p));
                }
            },
            (cError) => {
                setFetchingPackages(false);
                setFetchingPackagesSuccess(false);
                return handleError(cError);
            });
    };

    const fetchTransport = (id: string) => {
        setFetchingTransport(true);
        fetchUrl(`modflowmodels/${id}/transport`,
            (data) => {
                dispatch(updateTransport(Transport.fromQuery(data)));
                setFetchingTransport(false);
                setFetchingTransportSuccess(true);
            },
            (cError) => {
                setFetchingTransport(false);
                setFetchingTransportSuccess(false);
                return handleError(cError);
            });
    };

    const fetchVariableDensity = (id: string) => {
        setFetchingVariableDensity(true);
        fetchUrl(`modflowmodels/${id}/variableDensity`,
            (data) => {
                dispatch(updateVariableDensity(VariableDensity.fromQuery(data)));
                setFetchingVariableDensity(false);
                setFetchingVariableDensitySuccess(true);
            },
            (cError) => {
                setFetchingVariableDensity(true);
                setFetchingVariableDensitySuccess(false);
                return handleError(cError);
            });
    };

    const handleError = (dError: any) => {
        // tslint:disable-next-line:no-console
        console.log(dError);
        const {response} = dError;
        const {status} = response;
        if (status === 422 || status === 403) {
            props.history.push('/tools');
        }
    };

    const renderList = (listItems: Array<{ name: string, loading: boolean, success: boolean | null }>) => (
        listItems.map((item, idx) => (
            <List.Item key={idx}>
                <List.Icon
                    name={item.loading ? 'circle notched' : item.success ? 'check circle' : 'remove circle'}
                    size={'large'}
                    verticalAlign={'middle'}
                    loading={item.loading}
                />
                <List.Content>
                    <List.Header>{item.name}</List.Header>
                </List.Content>
            </List.Item>
        ))
    );

    const everythingIsLoaded = () => {
        const eil: boolean = !!model && !!boundaries && !!soilmodel && !!transport && !!variableDensity && !!packages;
        if (eil) {
            setTimeout(() => setShowModal(false), 1000);
        }
        return eil;
    };

    if (soilmodel && !Soilmodel.fromObject(soilmodel).checkVersion()) {
        return (
            <Message error={true}>
                The model you requested is not compatible with the current version. Contact an administrator or
                create a new model.
            </Message>
        );
    }

    const renderSoilmodel = () => soilmodelFetcher.fetching ? `Soilmodel ... ${soilmodelFetcher.message}` : 'Soilmodel';

    return (
        <div>
            {everythingIsLoaded() && props.children}
            <Modal size={'small'} closeIcon={false} open={showModal} dimmer={'inverted'}>
                <Modal.Header>Loading Model Data</Modal.Header>
                <Modal.Content>
                    <List>
                        {renderList([
                            {name: 'Main model', loading: fetchingModel, success: fetchingModelSuccess},
                            {name: 'Boundaries', loading: fetchingBoundaries, success: fetchingBoundariesSuccess},
                            {name: renderSoilmodel(), loading: fetchingSoilmodel, success: fetchingSoilmodelSuccess},
                            {name: 'Transport', loading: fetchingTransport, success: fetchingTransportSuccess},
                            {
                                name: 'Variable Density',
                                loading: fetchingVariableDensity,
                                success: fetchingVariableDensitySuccess
                            },
                            {name: 'Packages', loading: fetchingPackages, success: fetchingPackagesSuccess},
                        ])}
                    </List>
                </Modal.Content>
            </Modal>
        </div>
    );
};

export default withRouter(dataFetcherWrapper);
