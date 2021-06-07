import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import { IUser } from './Users';
import { IUserDetails } from './User';
import { buildPayloadToolInstance } from '../../shared/simpleTools/helpers';

import { defaultsWithSession as defaultsT02 } from '../../t02/defaults';
import { defaultsWithSession as defaultsT08 } from '../../t08/defaults';
import { defaultsWithSession as defaultsT09A } from '../../t09/defaults/T09A';
import { defaultsWithSession as defaultsT09B } from '../../t09/defaults/T09B';
import { defaultsWithSession as defaultsT09C } from '../../t09/defaults/T09C';
import { defaultsWithSession as defaultsT09D } from '../../t09/defaults/T09D';
import { defaultsWithSession as defaultsT09E } from '../../t09/defaults/T09E';
import { defaultsWithSession as defaultsT12 } from '../../t12/defaults/T12';
import { defaultsWithSession as defaultsT13A } from '../../t13/defaults/T13A';
import { defaultsWithSession as defaultsT13B } from '../../t13/defaults/T13B';
import { defaultsWithSession as defaultsT13C } from '../../t13/defaults/T13C';
import { defaultsWithSession as defaultsT13D } from '../../t13/defaults/T13D';
import { defaultsWithSession as defaultsT13E } from '../../t13/defaults/T13E';
import { defaultsWithSession as defaultsT14A } from '../../t14/defaults/T14A';
import { defaultsWithSession as defaultsT14B } from '../../t14/defaults/T14B';
import { defaultsWithSession as defaultsT14C } from '../../t14/defaults/T14C';
import { defaultsWithSession as defaultsT14D } from '../../t14/defaults/T14D';
import { defaultsWithSession as defaultsT18 } from '../../t18/defaults/T18';

import { deleteToolInstance } from '../../dashboard/commands';
import { fetchApiWithToken, sendCommandAsync } from '../../../services/api';
import React, { useEffect, useState } from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import ToolsDataTable from './ToolsDataTable';

const DefaultTools = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [defaultUserName, setDefaultUserName] = useState<string>('inowas');
  const [defaultUser, setDefaultUser] = useState<IUserDetails | null>(null);

  useEffect(() => {
    const f = async () => {
      setIsLoading(true);
      setErrorLoading(false);
      try {
        const users: IUser[] = (await fetchApiWithToken('users')).data;
        setUsers(users);
      } catch (e) {
        setErrorLoading(true);
      } finally {
        setIsLoading(false);
      }
    };

    f();
  }, []);

  useEffect(() => {
    const f = async () => {
      setIsLoading(true);
      setErrorLoading(false);
      try {
        const du = users.filter((u) => u.username === defaultUserName)[0];
        const user: IUserDetails = (await fetchApiWithToken(`users/${du.id}`)).data;
        setDefaultUser(user);
      } catch (e) {
        setErrorLoading(true);
      } finally {
        setIsLoading(false);
      }
    };

    f();
  }, [users, defaultUserName]);

  const onDeleteToolClick = (tool: string, id: string) => {
    const sc = async () => {
      if (!defaultUser) {
        return;
      }

      setIsLoading(true);
      setErrorLoading(false);
      try {
        await sendCommandAsync(deleteToolInstance(tool, id));
        setDefaultUser({ ...defaultUser, tools: defaultUser.tools.filter((t) => t.id !== id) });
      } catch (e) {
        setErrorLoading(true);
      } finally {
        setIsLoading(false);
      }
    };

    sc();
  };

  const createCommand = (defaults: any) => {
    const command = SimpleToolsCommand.createToolInstance({
      ...buildPayloadToolInstance(defaults), public: true, name: 'Default'
    });
    command.metadata = { 'user_id': defaultUser && defaultUser.id };
    return command;
  };

  const generateDefaultTools = () => {
    const g = async () => {
      setIsLoading(true);
      setErrorLoading(false);
      try {
        await sendCommandAsync(createCommand(defaultsT02()));
        await sendCommandAsync(createCommand(defaultsT08()));
        await sendCommandAsync(createCommand(defaultsT09A()));
        await sendCommandAsync(createCommand(defaultsT09B()));
        await sendCommandAsync(createCommand(defaultsT09C()));
        await sendCommandAsync(createCommand(defaultsT09D()));
        await sendCommandAsync(createCommand(defaultsT09E()));
        await sendCommandAsync(createCommand(defaultsT12()));
        await sendCommandAsync(createCommand(defaultsT13A()));
        await sendCommandAsync(createCommand(defaultsT13B()));
        await sendCommandAsync(createCommand(defaultsT13C()));
        await sendCommandAsync(createCommand(defaultsT13D()));
        await sendCommandAsync(createCommand(defaultsT13E()));
        await sendCommandAsync(createCommand(defaultsT14A()));
        await sendCommandAsync(createCommand(defaultsT14B()));
        await sendCommandAsync(createCommand(defaultsT14C()));
        await sendCommandAsync(createCommand(defaultsT14D()));
        await sendCommandAsync(createCommand(defaultsT18()));
      } catch (e) {
        setErrorLoading(true);
      } finally {
        if (defaultUser) {
          const user: IUserDetails = (await fetchApiWithToken(`users/${defaultUser.id}`)).data;
          setDefaultUser(user);
        }

        setIsLoading(false);
      }
    };

    g();
  };

  const deleteAllTools = () => {
    const g = async () => {
      setIsLoading(true);
      setErrorLoading(false);
      try {
        if (defaultUser) {
          for (const t of defaultUser.tools) {
            const { tool, id } = t;
            await sendCommandAsync(deleteToolInstance(tool, id));
            setDefaultUser({ ...defaultUser, tools: defaultUser.tools.filter((t) => t.id !== id) });
          }
        }
      } catch (e) {
        setErrorLoading(true);
      } finally {
        if (defaultUser) {
          const user: IUserDetails = (await fetchApiWithToken(`users/${defaultUser.id}`)).data;
          setDefaultUser(user);
        }

        setIsLoading(false);
      }
    };

    g();
  };

  return (
    <Segment color={'grey'} loading={isLoading}>
      {errorLoading && <Message negative>
        <Message.Header>Error</Message.Header>
        <p>There was an error fetching the userdata.</p>
      </Message>}
      <Header as={'h1'}>Default Tools</Header>
      <Form>
        <Form.Dropdown
          label={'Default User'}
          selection
          options={users.map((u) => ({ key: u.id, value: u.username, text: u.username }))}
          value={defaultUserName}
          onChange={(e, data: any) => setDefaultUserName(data.value)}
        />

        <Button
          negative={true}
          onClick={deleteAllTools}
        >
          Delete all tools
        </Button>
        <Button
          positive={true}
          onClick={generateDefaultTools}
        >
          Generate default tools
        </Button>
      </Form>

      {defaultUser &&
      <ToolsDataTable
        tools={defaultUser.tools}
        onChangeMetadata={() => ({})}
        onDelete={onDeleteToolClick}
      />}
    </Segment>
  );
};

export default DefaultTools;
