import {AppContainer} from '../../shared';
import {Grid, Icon, Loader, Message} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {ToolMetaData} from '../../shared/simpleTools';
import {clear, updateQmra} from '../actions/actions';
import {createToolInstance} from '../../dashboard/commands';
import {fetchUrl, sendCommand} from '../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import IQmra from '../../../core/model/qmra/Qmra.type';
import Qmra from '../../../core/model/qmra/Qmra';
import React, {useEffect, useState} from 'react';
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
  const {id} = useParams<{id: string}>();

  const T15 = useSelector((state: IRootReducer) => state.T15);
  const qmra = T15.qmra ? Qmra.fromObject(T15.qmra) : null;

  useEffect(() => {
    return function() {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  if (!qmra || isFetching) {
    return (
      <AppContainer navbarItems={navigation} loading={isFetching}>
        <Loader inverted={true}>Loading</Loader>
      </AppContainer>
    );
  }

  const handleDismissError = (id: string) => () => setErrors(errors.filter((e) => e.id !== id));

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
          <Grid.Column width={16}>
            {errors.map((error, key) => (
              <Message key={key} negative={true} onDismiss={handleDismissError(error.id)}>
                <Message.Header>Error</Message.Header>
                <p>{error.message}</p>
              </Message>
            ))}
            <p>QMRA</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppContainer>
  );
};
