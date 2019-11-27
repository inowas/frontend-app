import {cloneDeep} from 'lodash';
import React, {ReactNode, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';
import {Grid, Icon, Message} from 'semantic-ui-react';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import FlopyModflow from '../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModpath from '../../../core/model/flopy/packages/mp/FlopyModpath';
import {FlopyMt3d} from '../../../core/model/flopy/packages/mt';
import FlopySeawat from '../../../core/model/flopy/packages/swt/FlopySeawat';
import {
    Calculation,
    ModflowModel,
    Soilmodel,
    Transport,
    VariableDensity
} from '../../../core/model/modflow';
import {BoundaryCollection, BoundaryFactory} from '../../../core/model/modflow/boundaries';
import {BoundaryType} from '../../../core/model/modflow/boundaries/Boundary.type';
import Optimization from '../../../core/model/modflow/optimization/Optimization';
import {fetchSoilmodel} from '../../../core/model/modflow/soilmodel/updater/services';
import updater from '../../../core/model/modflow/soilmodel/updater/updater';
import {fetchCalculationDetails} from '../../../services/api';
import {fetchUrl, sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {IToolMetaData} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {
    clear,
    updateBoundaries,
    updateCalculation,
    updateModel,
    updateOptimization,
    updatePackages,
    updateSoilmodel,
    updateTransport,
    updateVariableDensity
} from '../actions/actions';
import ModflowModelCommand from '../commands/modflowModelCommand';
import boundaries from '../components/content/boundaries/boundaries';
import CalculationProgressBar from '../components/content/calculation/calculationProgressBar';
import * as Content from '../components/content/index';
import optimization from '../components/content/optimization/optimization';
import OptimizationProgressBar from '../components/content/optimization/optimizationProgressBar';
import Navigation from './navigation';

const navDocumentation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

interface IDispatchProps {
    clear: () => any;
    updateModel: (model: ModflowModel) => any;
    updatePackages: (packages: FlopyPackages) => any;
    updateBoundaries: (boundaries: BoundaryCollection) => any;
    updateCalculation: (calculation: Calculation) => any;
    updateOptimization: (optimization: Optimization) => any;
    updateSoilmodel: (soilmodel: Soilmodel) => any;
    updateTransport: (transport: Transport) => any;
    updateVariableDensity: (variableDensity: VariableDensity) => any;
}

interface IStateProps {
    boundaries: BoundaryCollection | null;
    calculation: Calculation | null;
    packages: FlopyPackages | null;
    model: ModflowModel | null;
    soilmodel: Soilmodel | null;
    transport: Transport | null;
    variableDensity: VariableDensity | null;
}

type IProps = IStateProps & IDispatchProps & RouteComponentProps<any>;

const t03 = (props: IProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [calculatePackages, setCalculatePackages] = useState<boolean | string>(false);
    const [navigation, setNavigation] = useState<Array<{
        name: string;
        path: string;
        icon: ReactNode
    }>>(navDocumentation);
    const [soilmodelFetcher, setSoilmodelFetcher] = useState<{
        message: string;
        fetching: boolean;
    }>({
        message: 'Start Fetching Soilmodel ...',
        fetching: false
    });

    useEffect(() => {
        const {search} = props.location;

        if (search.startsWith('?sid=')) {
            const cScenarioAnalysisId = search.split('=')[1];

            const cNavigation = cloneDeep(navigation);
            cNavigation.push({
                name: 'Return to ScenarioAnalysis',
                path: '/tools/T07/' + cScenarioAnalysisId,
                icon: <Icon name="file"/>
            });

            setNavigation(cNavigation);
        }

        setIsLoading(true);
        return fetchModel(props.match.params.id);
    }, []);

    useEffect(() => {
        if (!props.model || props.model.id !== props.match.params.id) {
            if (!isLoading) {
                setIsLoading(true);
                return fetchModel(props.match.params.id);
            }
        }
    }, [props.match.params]);

    useEffect(() => {
        if (props.model && !props.soilmodel && !soilmodelFetcher.fetching) {
            setSoilmodelFetcher({
                message: `Start fetching soilmodel.`,
                fetching: true
            });
            fetchAndUpdateSoilmodel(props.model.id);
        }
    }, [props.model]);

    const fetchModel = (id: string) => {
        if (props.model && props.model.id !== id) {
            props.clear();
        }
        fetchUrl(
            `modflowmodels/${id}`,
            (data) => {
                const modflowModel = ModflowModel.fromQuery(data);
                props.updateModel(modflowModel);
                setIsLoading(false);
                fetchBoundaries(id);
                fetchPackages(id);
                fetchTransport(id);
                fetchVariableDensity(id);

                if (modflowModel.calculationId) {
                    fetchCalculationDetails(modflowModel.calculationId,
                        (cData) => props.updateCalculation(Calculation.fromQuery(cData)),
                        // tslint:disable-next-line:no-console
                        (cError) => console.log(cError)
                    );
                }
            },
            (cError) => {
                setIsLoading(false);
                return handleError(cError);
            });
    };

    const fetchBoundaries = (id: string) => {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            (data) => props.updateBoundaries(BoundaryCollection.fromQuery(data)),
            (cError) => {
                setIsLoading(false);
                return handleError(cError);
            });
    };

    const fetchPackages = (id: string) => {
        fetchUrl(`modflowmodels/${id}/packages`,
            (data) => {
                if (Array.isArray(data) && data.length === 0) {
                    return setCalculatePackages(true);
                }
                const packages = FlopyPackages.fromQuery(data);
                if (packages) {
                    return props.updatePackages(packages);
                }
            },
            (cError) => {
                setIsLoading(false);
                return handleError(cError);
            });
    };

    const fetchAndUpdateSoilmodel = (id: string) => {
        fetchUrl(`modflowmodels/${id}/soilmodel`,
            (data) => {
                if (props.model) {
                    setSoilmodelFetcher({
                        message: 'Start updating soilmodel.',
                        fetching: true
                    });
                    updater(
                        data,
                        props.model,
                        (result) => setSoilmodelFetcher({
                            message: result.message,
                            fetching: true
                        }),
                        (result, needsToBeFetched) => {
                            setSoilmodelFetcher({
                                message: 'Finished updating soilmodel.',
                                fetching: false
                            });

                            if (needsToBeFetched) {
                                setSoilmodelFetcher({
                                    message: `Start fetching soilmodel...`,
                                    fetching: true
                                });
                                return fetchSoilmodel(
                                    result,
                                    (r) => setSoilmodelFetcher(r),
                                    (r) => {
                                        setSoilmodelFetcher({
                                            message: 'Finished fetching soilmodel.',
                                            fetching: false
                                        });
                                        return props.updateSoilmodel(Soilmodel.fromObject(r));
                                    }
                                );
                            }

                            return props.updateSoilmodel(Soilmodel.fromObject(result));
                        }
                    );
                }
            },
            (cError) => {
                setIsLoading(false);
                return handleError(cError);
            });
    };

    const fetchTransport = (id: string) => {
        fetchUrl(`modflowmodels/${id}/transport`,
            (data) => props.updateTransport(Transport.fromQuery(data)),
            (cError) => {
                setIsLoading(false);
                return handleError(cError);
            });
    };

    const fetchVariableDensity = (id: string) => {
        fetchUrl(`modflowmodels/${id}/variableDensity`,
            (data) => props.updateVariableDensity(VariableDensity.fromQuery(data)),
            (cError) => {
                setIsLoading(false);
                return handleError(cError);
            });
    };

    const calculatePackagesFunction = () => {
        return new Promise((resolve, reject) => {
            if (!props.model || !props.soilmodel || !props.boundaries) {
                return;
            }

            setCalculatePackages('calculation');
            const mf = FlopyModflow.create(props.model, props.soilmodel, props.boundaries);
            const modpath = new FlopyModpath();
            const mt = FlopyMt3d.createFromTransport(props.transport, props.boundaries);
            const swt = FlopySeawat.createFromVariableDensity(props.variableDensity);
            if (props.model) {
                const modelId = props.model.id;

                const flopyPackages = FlopyPackages.create(modelId, mf, modpath, mt, swt);
                if (flopyPackages instanceof FlopyPackages) {
                    setCalculatePackages(false);
                    resolve(flopyPackages);
                }

                setCalculatePackages('error');
                reject('Error creating instance of FlopyPackages.');
            }
        });
    };

    const handleChangeToolMetaData = () => {
        return null;
    };

    const handleError = (dError: any) => {
        // tslint:disable-next-line:no-console
        console.log(dError);
        const {response} = dError;
        const {status} = response;
        if (status === 422) {
            props.history.push('/tools');
        }
    };

    const renderContent = (id: string, property: string, type: BoundaryType) => {
        const readOnly = props.model ? props.model.readOnly : false;
        switch (property) {
            case 'discretization':
                return (<Content.Discretization/>);
            case 'soilmodel':
                return (<Content.SoilmodelEditor fetchSoilmodel={fetchAndUpdateSoilmodel} readOnly={readOnly}/>);
            case 'boundaries':
                if (BoundaryFactory.availableTypes.indexOf(type) > -1) {
                    return (<Content.CreateBoundary readOnly={readOnly} type={type}/>);
                }
                return (<Content.Boundaries types={['chd', 'drn', 'evt', 'ghb', 'rch', 'riv', 'wel']}/>);
            case 'head_observations':
                if (type === 'hob') {
                    return (<Content.CreateBoundary readOnly={readOnly} type="hob"/>);
                }
                return (<Content.Boundaries types={['hob']}/>);
            case 'transport':
                return (<Content.Transport/>);
            case 'variable_density':
                return (<Content.VariableDensityProperties readOnly={readOnly}/>);
            case 'observations':
                return (<Content.Observations/>);
            case 'modflow':
                return (<Content.Modflow/>);
            case 'mt3d':
                return (<Content.Mt3d/>);
            case 'seawat':
                return (<Content.Seawat readOnly={readOnly}/>);
            case 'calculation':
                return (<Content.Calculation/>);
            case 'flow':
                return (<Content.FlowResults/>);
            case 'budget':
                return (<Content.BudgetResults/>);
            case 'modpath':
                return (<Content.Modpath/>);
            case 'concentration':
                return (<Content.TransportResults/>);
            case 'optimization':
                return (<Content.Optimization/>);
            default:
                const path = props.match.path;
                const basePath = path.split(':')[0];
                return (
                    <Redirect to={basePath + id + '/discretization' + props.location.search}/>
                );
        }
    };

    const saveMetaData = (tool: IToolMetaData) => {
        const {name, description} = tool;
        const isPublic = tool.public;

        if (props.model) {
            const cModel = props.model;
            cModel.name = name;
            cModel.description = description;
            cModel.isPublic = isPublic;

            return sendCommand(
                ModflowModelCommand.updateModflowModelMetadata(cModel.id, name, description, isPublic),
                () => props.updateModel(cModel),
                // tslint:disable-next-line:no-console
                (e) => console.log(e)
            );
        }
    };

    if (soilmodelFetcher.fetching || !props.model || !props.boundaries || !props.soilmodel || !props.transport ||
        !props.variableDensity
    ) {
        return (
            <AppContainer navbarItems={navigation}>
                <Message icon={true}>
                    <Icon name="circle notched" loading={true}/>
                </Message>
            </AppContainer>
        );
    }

    if (calculatePackages === true) {
        calculatePackagesFunction().then((packages) => {
            if (props.model) {
                props.updatePackages(packages as FlopyPackages);
                return sendCommand(
                    ModflowModelCommand.updateFlopyPackages(props.model.id, packages),
                    // tslint:disable-next-line:no-console
                    (e) => console.log(e)
                );
            }
        });
    }

    if (!props.packages) {
        return (
            <AppContainer navbarItems={navigation}>
                <Message icon={true}>
                    <Icon name="circle notched" loading={true}/>
                </Message>
            </AppContainer>
        );
    }

    return (
        <AppContainer navbarItems={navigation}>
            <ToolMetaData
                isDirty={false}
                onChange={handleChangeToolMetaData}
                readOnly={false}
                tool={{
                    tool: 'T03',
                    name: props.model.name,
                    description: props.model.description,
                    public: props.model.isPublic
                }}
                defaultButton={false}
                saveButton={false}
                onSave={saveMetaData}
            />
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Navigation/>
                        <CalculationProgressBar/>
                        <OptimizationProgressBar/>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {renderContent(props.match.params.id, props.match.params.property, props.match.params.type)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

const mapStateToProps = (state: any) => ({
    model: state.T03.model ? ModflowModel.fromObject(state.T03.model) : null,
    boundaries: state.T03.boundaries ? BoundaryCollection.fromObject(state.T03.boundaries) : null,
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
    packages: state.T03.packages ? FlopyPackages.fromObject(state.T03.packages) : null,
    soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null,
    transport: state.T03.transport ? Transport.fromObject(state.T03.transport) : null,
    variableDensity: state.T03.variableDensity ? VariableDensity.fromObject(state.T03.variableDensity) : null
});

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    clear: () => dispatch(clear()),
    updateCalculation: (c) => dispatch(updateCalculation(c)),
    updateBoundaries: (b) => dispatch(updateBoundaries(b)),
    updatePackages: (p) => dispatch(updatePackages(p)),
    updateModel: (m) => dispatch(updateModel(m)),
    updateOptimization: (o) => dispatch(updateOptimization(o)),
    updateTransport: (t) => dispatch(updateTransport(t)),
    updateSoilmodel: (s) => dispatch(updateSoilmodel(s)),
    updateVariableDensity: (v) => dispatch(updateVariableDensity(v)),
});

export default withRouter(connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps)
(t03));
