import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useParams, useHistory, useLocation} from 'react-router-dom';
import {Icon} from 'semantic-ui-react';

import {includes} from 'lodash';
import {IRootReducer} from '../../../reducers';

import {AppContainer} from '../../shared';
import {Background, Chart, Info, Parameters, Settings} from '../components';
import {SliderParameter, ToolGrid, ToolMetaData} from '../../shared/simpleTools';

import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';

import image from '../images/T02.png';
import {defaultsWithSession, IT02} from '../defaults';

import {fetchTool, sendCommand} from '../../../services/api';
import {buildPayloadToolInstance, deepMerge} from '../../shared/simpleTools/helpers';

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
        console.log('useEffect');
        if (urlParams.id) {
            console.log('Fetchtool');
            fetchTool(
                data.tool,
                urlParams.id,
                (data: IT02) => setData(
                    deepMerge(data, defaultsWithSession(session))
                ),
                (error) => setError(error)
            );
        }
    }, [urlParams.id, data.tool, session]);

    const save = () => {
        if (urlParams.id) {
            sendCommand(
                SimpleToolsCommand.updateToolInstance(buildPayloadToolInstance(data)),
                () => setIsDirty(false),
                () => setError(true)
            );

            return;
        }

        sendCommand(
            SimpleToolsCommand.createToolInstance(buildPayloadToolInstance(data)),
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
