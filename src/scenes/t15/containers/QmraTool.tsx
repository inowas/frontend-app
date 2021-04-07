import {AppContainer} from '../../shared';
import {Dropdown, DropdownProps, Grid, Icon, Loader, Message} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {SyntheticEvent, useEffect, useState} from 'react';
import {ToolMetaData} from '../../shared/simpleTools';
import {clear, updateQmra} from '../actions/actions';
import {createToolInstance} from '../../dashboard/commands';
import {fetchUrl, sendCommand} from '../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import Calculation from '../components/Calculation/Calculation';
import DoseResponseEditor from '../components/DoseResponse/DoseResponseEditor';
import ExposureEditor from '../components/Exposure/ExposureEditor';
import HealthEditor from '../components/Health/HealthEditor';
import IQmra from '../../../core/model/qmra/Qmra.type';
import Navigation from './Navigation';
import PathogenEditor from '../components/Inflow/PathogenEditor';
import ProcessEditor from '../components/Processes/ProcessEditor';
import Qmra from '../../../core/model/qmra/Qmra';
import SchemeEditor from '../components/TreatmentSchemes/SchemeEditor';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
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

  const handleExport = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    if (!qmra) {
      return;
    }
    const filename = 'qmra.json';
    let text = '';
    if (value === 'inowas') {
      text = JSON.stringify(qmra.toObject(), null, 2);
    }
    if (value === 'kwb') {
      text = JSON.stringify(qmra.toPayload(), null, 2);
    }
  
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
    console.log({q});
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

  const renderContent = () => {
    switch(property) {
      case 'calculation':
        return <Calculation qmra={qmra}/>
      case 'doseResponse':
        return <DoseResponseEditor onChange={handleSave} qmra={qmra}/>
      case 'health':
        return <HealthEditor onChange={handleSave} qmra={qmra}/>
      case 'inflow':
        return <PathogenEditor onChange={handleSave} qmra={qmra}/>
      case 'processes':
        return <ProcessEditor onChange={handleSave} qmra={qmra}/>
      case 'schemes':
        return <SchemeEditor onChange={handleSave} qmra={qmra}/>
      default:
        return <ExposureEditor onChange={handleSave} qmra={qmra}/>
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
            <Navigation isFetching={isFetching} property={property} qmra={qmra}/>
            <Dropdown
              button
              className="icon positive"
              disabled={!qmra}
              floating
              fluid
              labeled
              icon="download"
              options={[
                {key: 0, value: 'inowas', text: 'JSON complete'},
                {key: 1, value: 'kwb', text: 'JSON config'}
              ]}
              onChange={handleExport}
              text="Export"
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
