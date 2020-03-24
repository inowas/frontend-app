import {cloneDeep} from 'lodash';
import React, {ReactNode, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Grid, Icon} from 'semantic-ui-react';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import {
    Calculation,
    ModflowModel,
    Soilmodel,
    Transport,
    VariableDensity
} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import Optimization from '../../../core/model/modflow/optimization/Optimization';
import {sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import ErrorsBox from '../../shared/ErrorsBox';
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
import {DataFetcherWrapper} from '../components';
import {CalculationProcess} from '../components/content/calculation';
import {ContentWrapper} from '../components/content/index';
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

type IProps = IStateProps & IDispatchProps & RouteComponentProps<{
    id: string;
    property?: string;
    type?: string;
}>;

const t03 = (props: IProps) => {
    const [navigation, setNavigation] = useState<Array<{
        name: string;
        path: string;
        icon: ReactNode
    }>>(navDocumentation);

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
    }, []);

    const handleChangeToolMetaData = () => {
        return null;
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

    return (
        <AppContainer navbarItems={navigation}>
            <DataFetcherWrapper>
                {props.model && <ToolMetaData
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
                />}
                <Grid padded={true}>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Navigation/>
                            <CalculationProcess/>
                            <OptimizationProgressBar/>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <ErrorsBox/>
                            <ContentWrapper
                                readOnly={props.model ? props.model.readOnly : false}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </DataFetcherWrapper>
        </AppContainer>
    );
};

const mapStateToProps = (state: any) => ({
    model: state.T03.model ? ModflowModel.fromObject(state.T03.model) : null,
    boundaries: state.T03.boundaries ? BoundaryCollection.fromObject(state.T03.boundaries) : null,
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
    packages: state.T03.packages.data ? FlopyPackages.fromObject(state.T03.packages.data) : null,
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
