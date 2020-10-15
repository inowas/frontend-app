import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';
import {Button, Grid, Header, Icon, Message, Popup, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Calculation, ModflowModel, Soilmodel} from '../../../core/model/modflow';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import {IScenarioAnalysis} from '../../../core/model/scenarioAnalysis/ScenarioAnalysis';
import {IPropertyValueObject} from '../../../core/model/types';
import {IRootReducer} from '../../../reducers';
import {sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {
    updateScenarioAnalysis
} from '../actions/actions';
import ScenarioAnalysisCommand from '../commands/scenarioAnalysisCommand';
import * as Content from '../components';
import DataFetcherWrapper from '../components/dataFetcherWrapper';

const styles = {
    modelitem: {
        cursor: 'pointer'
    }
};

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools/t07-application-specific-scenarios-analyzer/',
        icon: <Icon name="file"/>
    }
];

const menuItems = [{
    header: 'Results',
    items: [
        {
            name: 'Cross Section',
            property: 'crosssection',
            icon: <Icon name="calendar alternate outline"/>
        },
        {
            name: 'Difference',
            property: 'difference',
            icon: <Icon name="expand"/>
        },
        {
            name: 'Time Series',
            property: 'timeseries',
            icon: <Icon name="map marker alternate"/>
        }
    ]
}];

const T07 = (props: RouteComponentProps<{
    id: string;
    property: string;
}>) => {
    const [localScenarioAnalysis, setLocalScenarioAnalysis] = useState<IScenarioAnalysis | null>(null);
    const [selected, setSelected] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [hasError, setHasError] = useState<any>(null);
    const [wrapperKey, setWrapperKey] = useState<string>(Uuid.v4());

    const dispatch = useDispatch();
    const T07 = useSelector((state: IRootReducer) => state.T07);
    const scenarioAnalysis = T07.scenarioAnalysis ? ScenarioAnalysis.fromObject(T07.scenarioAnalysis) : null;
    const models: IPropertyValueObject = T07.models || null;
    const soilmodels: IPropertyValueObject = T07.soilmodels || null;
    const calculations: IPropertyValueObject = T07.calculations || null;
    const boundaries: IPropertyValueObject = T07.boundaries || null;

    useEffect(() => {
        if (T07.scenarioAnalysis) {
            setLocalScenarioAnalysis(T07.scenarioAnalysis);
            setSelected([T07.scenarioAnalysis.data.base_id]);
        }
    }, [T07.scenarioAnalysis]);

    if (hasError) {
        return (
            <AppContainer navbarItems={navigation}>
                <Message icon={true}>
                    Error: {hasError.hasOwnProperty('message') ? hasError.message : hasError}
                </Message>
            </AppContainer>
        );
    }

    const renderContent = (id: string, property: string) => {
        if (!scenarioAnalysis) {
            return (<Segment color={'grey'} loading={true}/>);
        }

        let basemodel = null;
        if (models && models.hasOwnProperty(scenarioAnalysis.basemodelId)) {
            basemodel = ModflowModel.fromObject(models[scenarioAnalysis.basemodelId]);
        }

        if (!basemodel) {
            return (<Segment color={'grey'} loading={true}/>);
        }

        let basemodelCalculation = null;
        if (calculations && calculations.hasOwnProperty(scenarioAnalysis.basemodelId)) {
            basemodelCalculation = Calculation.fromObject(calculations[scenarioAnalysis.basemodelId]);
        }

        if (!basemodelCalculation) {
            return (<Segment color={'grey'} loading={true}/>);
        }

        let basemodelSoilmodel = null;
        if (soilmodels && soilmodels.hasOwnProperty(scenarioAnalysis.basemodelId)) {
            basemodelSoilmodel = Soilmodel.fromObject(soilmodels[scenarioAnalysis.basemodelId]);
        }

        if (!basemodelSoilmodel) {
            return (<Segment color={'grey'} loading={true}/>);
        }

        switch (property) {
            case 'crosssection':
                return (
                    <Content.CrossSection
                        boundaries={boundaries}
                        calculations={calculations}
                        models={models}
                        scenarioAnalysis={scenarioAnalysis}
                        basemodel={basemodel}
                        basemodelCalculation={basemodelCalculation}
                        basemodelSoilmodel={basemodelSoilmodel}
                        selected={selected}
                    />
                );
            case 'difference':
                return (
                    <Content.Difference
                        boundaries={boundaries}
                        calculations={calculations}
                        models={models}
                        scenarioAnalysis={scenarioAnalysis}
                        soilmodels={soilmodels}
                    />
                );
            case 'timeseries':
                return (
                    <Content.TimeSeries
                        boundaries={boundaries}
                        calculations={calculations}
                        models={models}
                        scenarioAnalysis={scenarioAnalysis}
                        selected={selected}
                        soilmodels={soilmodels}
                    />
                );
            default:
                const basePath = props.match.path.split(':')[0];
                return (
                    <Redirect to={basePath + id + '/crosssection'}/>
                );
        }
    };

    const handleSaveMetaData = (metaData: IToolMetaDataEdit) => {
        if (localScenarioAnalysis) {
            const cScenarioAnalysis = ScenarioAnalysis.fromObject(localScenarioAnalysis);
            cScenarioAnalysis.name = metaData.name;
            cScenarioAnalysis.description = metaData.description;
            cScenarioAnalysis.public = metaData.public;
            return sendCommand(
                ScenarioAnalysisCommand.updateScenarioAnalysis(cScenarioAnalysis.id, cScenarioAnalysis.name,
                    cScenarioAnalysis.description, cScenarioAnalysis.public),
                () => dispatch(updateScenarioAnalysis(cScenarioAnalysis)),
                // tslint:disable-next-line:no-console
                (e) => console.log(e)
            );
        }
    };

    const handleScenarioClick = (id: string) => () => {
        const cSelected = cloneDeep(selected);
        if (selected.indexOf(id) >= 0) {
            return setSelected(cSelected.filter((v) => v !== id));
        }
        cSelected.push(id);
        return setSelected(cSelected);
    };

    const renderModelListItem = (
        {id, name, canBeDeleted = true}: { id: string, name: string, canBeDeleted: boolean }
    ) => {
        return (
            <Grid.Column key={id}>
                <Segment
                    className="modelitem"
                    style={styles.modelitem}
                    color={'blue'}
                    inverted={selected.indexOf(id) >= 0}
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={14} onClick={handleScenarioClick(id)}>
                                <Header as={'a'} size="tiny">{name}</Header>
                            </Grid.Column>
                            <Grid.Column width={2} style={{padding: '0'}}>
                                <Popup
                                    trigger={<Icon name="ellipsis vertical"/>}
                                    content={
                                        <Button.Group size="small">
                                            <Popup
                                                trigger={<Button icon={'edit'} onClick={editScenario(id)}/>}
                                                content="Edit"
                                                position="top center"
                                                size="mini"
                                                inverted={true}
                                            />
                                            <Popup
                                                trigger={<Button icon={'clone'} onClick={cloneScenario(id)}/>}
                                                content="Clone"
                                                position="top center"
                                                size="mini"
                                                inverted={true}
                                            />
                                            {canBeDeleted &&
                                            <Popup
                                                trigger={<Button icon={'trash'} onClick={deleteScenario(id)}/>}
                                                content="Delete"
                                                position="top center"
                                                size="mini"
                                                inverted={true}
                                            />
                                            }
                                        </Button.Group>
                                    }
                                    on={'click'}
                                    position={'right center'}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Grid.Column>
        );
    };

    const cloneScenario = (id: string) => () => {
        if (!scenarioAnalysis) {
            return null;
        }
        const newId = Uuid.v4();
        sendCommand(
            ScenarioAnalysisCommand.createScenario(scenarioAnalysis.id, id, newId),
            () => setWrapperKey(Uuid.v4())
        );
    };

    const deleteScenario = (id: string) => () => {
        if (!scenarioAnalysis) {
            return null;
        }
        sendCommand(
            ScenarioAnalysisCommand.deleteScenario(scenarioAnalysis.id, id),
            () => setWrapperKey(Uuid.v4())
        );
    };

    const editScenario = (id: string) => () => {
        if (!scenarioAnalysis) {
            return null;
        }
        return props.history.push(`/tools/T03/${id}?sid=${scenarioAnalysis.id}`);
    };

    const renderModelList = () => {
        if (!scenarioAnalysis || !models || Object.keys(models).length === 0) {
            return null;
        }
        return scenarioAnalysis.modelIds.map((id, idx) => {
            if (models.hasOwnProperty(id)) {
                const model = ModflowModel.fromObject(models[id]);
                return renderModelListItem({
                    id: model.id,
                    name: model.name,
                    canBeDeleted: idx !== 0
                });
            }

            return null;
        });
    };

    return (
        <AppContainer navbarItems={navigation}>
            <DataFetcherWrapper key={wrapperKey}>
                {localScenarioAnalysis &&
                <ToolMetaData
                    isDirty={false}
                    readOnly={false}
                    tool={{
                        tool: 'T07',
                        name: localScenarioAnalysis.name,
                        description: localScenarioAnalysis.description,
                        public: localScenarioAnalysis.public
                    }}
                    onSave={handleSaveMetaData}
                />
                }
                <Grid padded={true}>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <ToolNavigation navigationItems={menuItems}/>
                            {props.match.params.property !== 'difference' && renderModelList()}
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {renderContent(props.match.params.id, props.match.params.property)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </DataFetcherWrapper>
        </AppContainer>
    );
};

export default withRouter(T07);
