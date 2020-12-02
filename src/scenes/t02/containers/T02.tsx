import {AppContainer} from '../../shared';
import {Background, Chart, Info, Parameters, Settings} from '../components';
import {IRootReducer} from '../../../reducers';
import {IT02, defaultsWithSession} from '../defaults';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {Icon} from 'semantic-ui-react';
import {SliderParameter, ToolGrid, ToolMetaData} from '../../shared/simpleTools';
import {asyncFetchTool, sendCommand} from '../../../services/api';
import {buildPayloadToolInstance, deepMerge} from '../../shared/simpleTools/helpers';
import {includes} from 'lodash';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import image from '../images/T02.png';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t02-groundwater-mounding-calculator/',
    icon: <Icon name="file"/>
}];

const T02 = () => {

    const session = useSelector((state: IRootReducer) => state.session);
    const [isLoading, setIsLoading] = useState<any>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<any>(false);
    const [isDirty, setIsDirty] = useState<any>(false);
    const [data, setData] = useState<IT02>(defaultsWithSession(session));
    const readOnly = !includes(data.permissions, 'w');

    const urlParams: { id: string } = useParams();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const d: IT02 = await asyncFetchTool(data.tool, urlParams.id);
                setData(deepMerge(defaultsWithSession(session), d));
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        if (urlParams.id) {
            fetchData();
        }
    }, [urlParams.id, data.tool, session]);

    const save = (tool: IToolMetaDataEdit) => {

        const d = {
            ...data, name: tool.name, description: tool.description, public: tool.public
        };

        if (urlParams.id) {
            sendCommand(
                SimpleToolsCommand.updateToolInstance(buildPayloadToolInstance(d)),
                () => setIsDirty(false),
                () => setError(true)
            );

            return;
        }

        sendCommand(
            SimpleToolsCommand.createToolInstance(buildPayloadToolInstance(d)),
            () => history.push(`${location.pathname}/${data.id}`),
            () => setError(true)
        );
    };

    const handleChangeParameters = (parameters: IT02['data']['parameters']) => {
        setData({...data, data: {...data.data, parameters: parameters}});
        setIsDirty(true);
    };

    const handleChangeSettings = (settings: IT02['data']['settings']) => {
        setData({...data, data: {...data.data, settings}});
        setIsDirty(true);
    };

    const handleReset = () => {
        setData(defaultsWithSession(session));
        setError(false);
        setIsLoading(false);
        setIsDirty(false);
    };

    return (
        <AppContainer navbarItems={navigation} loading={isLoading}>
            <ToolMetaData
                tool={data}
                readOnly={readOnly}
                onSave={save}
                saveButton={true}
                onReset={handleReset}
                isDirty={isDirty}
            />
            <ToolGrid rows={2}>
                <Background image={image} title={'T02. GROUNDWATER MOUNDING (HANTUSH)'}/>
                <Chart settings={data.data.settings} parameters={data.data.parameters}/>
                <div>
                    <Settings settings={data.data.settings} onChange={handleChangeSettings}/>
                    <Info parameters={data.data.parameters}/>
                </div>
                <Parameters
                    parameters={data.data.parameters.map(p => SliderParameter.fromObject(p))}
                    handleChange={handleChangeParameters}
                    handleReset={handleReset}
                />
            </ToolGrid>
        </AppContainer>
    );
};

export default T02;
