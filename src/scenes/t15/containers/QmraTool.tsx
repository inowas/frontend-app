import {AppContainer} from '../../shared';
import {Button, Grid, Icon, Loader, Message} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {ToolMetaData} from '../../shared/simpleTools';
import {clear, updateQmra} from '../actions/actions';
import {createToolInstance} from '../../dashboard/commands';
import {fetchUrl, sendCommand} from '../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Calculation from '../components/Calculation/Calculation';
import DoseResponseEditor from '../components/DoseResponse/DoseResponseEditor';
import ExposureEditor from '../components/Exposure/ExposureEditor';
import HealthEditor from '../components/Health/HealthEditor';
import IQmra from '../../../core/model/qmra/Qmra.type';
import JsonUpload from '../components/JsonUpload';
import Navigation from './Navigation';
import PathogenEditor from '../components/Inflow/PathogenEditor';
import ProcessEditor from '../components/Processes/ProcessEditor';
import Qmra from '../../../core/model/qmra/Qmra';
import React from 'react';
import SchemeEditor from '../components/TreatmentSchemes/SchemeEditor';
import Setup from '../components/Setup';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import StatsTotal from '../components/Results/StatsTotal';
import uuid from 'uuid';

const navigation = [{
  name: 'Documentation',
  path: 'https://inowas.com/tools',
  icon: <Icon name="file"/>
}];

interface IError {
  id: string;
  message: string;
}

const tool = 'T15';

export const QmraTool = () => {
  const [errors, setErrors] = useState<IError[]>([]);
  const [isDirty, setDirty] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const {id, property} = useParams<{ id: string, property: string }>();

  const T15 = useSelector((state: IRootReducer) => state.T15);
  const qmra = T15.qmra ? Qmra.fromObject(T15.qmra) : null;
  const results = T15.results;

  useEffect(() => {
    return function () {
      dispatch(clear());
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      setIsFetching(true);
      fetchUrl(`tools/${tool}/${id}`,
        (q: IQmra) => {
          dispatch(updateQmra(Qmra.fromObject(q)));
          setIsFetching(false);
          setDirty(false);
        },
        () => {
          setIsFetching(false);
        }
      );
      return;
    }

    if (!id) {
      const newInstance = Qmra.fromDefaults();
      sendCommand(createToolInstance(newInstance.tool, newInstance.toObject()),
        () => history.push(`/tools/${newInstance.tool}/${newInstance.id}`),
        (e) => setErrors([{id: uuid.v4(), message: `Creating new instance failed: ${e}`}])
      );
    }
  }, [dispatch, history, id]);

  useEffect(() => {
    if (id && !property) {
      history.push(`/tools/${tool}/${id}/setup`);
    }
  }, [history, id, property]);

  const handleExport = () => {
    if (!qmra) {
      return;
    }
    const filename = 'qmra_config.json';
    const text = JSON.stringify(qmra.toPayload(), null, 2);

    const element: HTMLAnchorElement = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
    if (!qmra) {
      return;
    }
    const {name, description} = tool;
    const cQmra = qmra.toObject();
    cQmra.public = tool.public;
    cQmra.name = name;
    cQmra.description = description;
    handleSave(Qmra.fromObject(cQmra));
  };

  const handleSave = (q: Qmra) => {
    setIsFetching(true);
    sendCommand(
      SimpleToolsCommand.updateToolInstance(q.toObject()),
      () => {
        dispatch(updateQmra(q));
        setIsFetching(false);
      }
    );
  };

  if (!qmra) {
    return (
      <AppContainer navbarItems={navigation}>
        <Loader inverted={true}>Loading</Loader>
      </AppContainer>
    );
  }

  const handleDismissError = (id: string) => () => setErrors(errors.filter((e) => e.id !== id));

  const handleUploadJson = (r: Qmra) => handleSave(r);

  const renderContent = () => {
    switch (property) {
      case 'calculation':
        return <Calculation qmra={qmra}/>
      case 'doseResponse':
        return <DoseResponseEditor onChange={handleSave} qmra={qmra}/>
      case 'exposure':
        return <ExposureEditor onChange={handleSave} qmra={qmra}/>
      case 'health':
        return <HealthEditor onChange={handleSave} qmra={qmra}/>
      case 'inflow':
        return <PathogenEditor onChange={handleSave} qmra={qmra}/>
      case 'processes':
        return <ProcessEditor onChange={handleSave} qmra={qmra}/>
      case 'schemes':
        return <SchemeEditor onChange={handleSave} qmra={qmra}/>
      case 'stats_total':
        return <StatsTotal />
      default:
        return <Setup onChange={handleSave} qmra={qmra}/>
    }
  };

  return (
    <AppContainer navbarItems={navigation}>
      <ToolMetaData
        isDirty={isDirty}
        readOnly={false}
        tool={{
          tool: 'T15',
          name: qmra.name,
          description: qmra.description,
          public: qmra.public
        }}
        onSave={handleSaveMetaData}
      />
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column width={3}>
            <Navigation hasResults={!!results} isFetching={isFetching} property={property} qmra={qmra}/>
            <Button
              primary={true}
              fluid={true}
              icon="download"
              content="Export Json"
              labelPosition="left"
              onClick={handleExport}
            />
            <br/>
            <JsonUpload
              onChange={handleUploadJson}
              qmra={qmra}
            />
          </Grid.Column>
          <Grid.Column width={13}>
            {errors.map((error, key) => (
              <Message key={key} negative={true} onDismiss={handleDismissError(error.id)}>
                <Message.Header>Error</Message.Header>
                <p>{error.message}</p>
              </Message>
            ))}
            {renderContent()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppContainer>
  );
};
