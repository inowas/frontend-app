import {AppContainer} from '../../shared';
import {BoundaryCollection, ModflowModel} from '../../../core/model/modflow';
import {CalculationProcess} from '../../modflow/components/content/calculation';
import {Grid, Icon} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {ToolMetaData} from '../../shared/simpleTools';
import {ToolNavigation} from '../../shared/complexTools';
import {sendCommand} from '../../../services/api';
import {
    updateCalculation,
    updateProcessedPackages, updateProcessingPackages,
    updateRTModelling
} from '../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import Calculation from '../components/calculation/Calculation';
import DataFetcherWrapper from '../components/DataFetcherWrapper';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import RTModellingBoundaries from '../components/RTModellingBoundaries';
import RTModellingSetup from '../components/RTModellingSetup';
import React, {useEffect} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const RealTimeModelling = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {id, property} = useParams();

    const T20 = useSelector((state: IRootReducer) => state.T20);
    const rtm = T20.rtmodelling ? RTModelling.fromObject(T20.rtmodelling) : null;

    useEffect(() => {
        if (!property && id) {
            history.push(`${id}/settings`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [property]);

    const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
        if (!rtm) {
            return;
        }
        const {name, description} = tool;
        const isPublic = tool.public;
        const cRtm: IRtModelling = {...rtm.toObject(), name, description, public: isPublic};
        dispatch(updateRTModelling(RTModelling.fromObject(cRtm)));
    };

    const handleSave = (r: RTModelling) => {
        sendCommand(
            SimpleToolsCommand.updateToolInstance(r.toQuery()),
            () => {
                dispatch(updateRTModelling(r));
            }
        );
    };

    const renderContent = () => {
        if (property === 'calculation') {
            return (
                <Calculation/>
            );
        }
        if (property === 'boundaries') {
            return (
                <RTModellingBoundaries
                    onChange={handleSave}
                />
            );
        }
        return (
            <RTModellingSetup
                onChange={handleSave}
            />
        );
    };

    return (
        <AppContainer navbarItems={navigation}>
            <DataFetcherWrapper>
                {rtm &&
                <ToolMetaData
                    isDirty={false}
                    readOnly={false}
                    tool={{
                        tool: 'T20',
                        name: rtm.name,
                        description: rtm.description,
                        public: rtm.public
                    }}
                    onSave={handleSaveMetaData}
                />
                }
                <Grid padded={true}>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <ToolNavigation
                                navigationItems={[
                                    {
                                        header: 'Setup',
                                        items: [
                                            {
                                                name: 'Settings',
                                                property: 'settings',
                                                icon: <Icon name="map"/>
                                            },
                                            {
                                                name: 'Boundaries',
                                                property: 'boundaries',
                                                icon: <Icon name="map marker alternate"/>
                                            }
                                        ]
                                    },
                                    {
                                        header: 'Calculation',
                                        items: [
                                            {
                                                name: 'Run calculation',
                                                property: 'calculation',
                                                icon: <Icon name="save outline"/>
                                            }
                                        ]
                                    },
                                    {
                                        header: 'Results',
                                        items: [
                                            {
                                                name: 'Flow',
                                                property: 'flow',
                                                icon: <Icon name="chart line"/>,
                                            },
                                            {
                                                name: 'Budget',
                                                property: 'budget',
                                                icon: <Icon name="chart bar outline"/>
                                            },
                                            {
                                                name: 'Concentration',
                                                property: 'concentration',
                                                icon: <Icon name="chart area"/>
                                            }
                                        ]
                                    }
                                ]}
                            />
                            {rtm && rtm.results &&
                            <CalculationProcess
                                boundaries={BoundaryCollection.fromObject(rtm.results.boundaries)}
                                model={ModflowModel.fromObject(rtm.results.model)}
                                reducer={T20}
                                updateCalculation={updateCalculation}
                                updateProcessedPackages={updateProcessedPackages}
                                updateProcessingPackages={updateProcessingPackages}
                            />
                            }
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {renderContent()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </DataFetcherWrapper>
        </AppContainer>
    );
};

export default RealTimeModelling;
