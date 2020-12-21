import { Header, Message, Segment } from 'semantic-ui-react';
import { IToolInstance } from '../../types';
import { deleteToolInstance, updateToolInstanceMetadata } from '../../dashboard/commands';
import { fetchApiWithToken, sendCommandAsync } from '../../../services/api';
import React, { useEffect, useState } from 'react';
import ToolsDataTable from './ToolsDataTable';

const Tools = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);
  const [tools, setTools] = useState<IToolInstance[]>([]);

  useEffect(() => {
    const f = async () => {
      setIsLoading(true);
      setErrorLoading(false);
      try {
        const tools: IToolInstance[] = (await fetchApiWithToken('tools')).data;
        setTools(tools);
      } catch (e) {
        setErrorLoading(true);
      } finally {
        setIsLoading(false);
      }
    };

    f();
  }, []);

  const handleChangeMetadata = (tool: string, id: string, name: string, description: string, isPublic: boolean) => {
    const sc = async () => {
      setIsLoading(true);
      setErrorLoading(false);
      try {
        await sendCommandAsync(updateToolInstanceMetadata(tool, { id, name, description, isPublic }));
        setTools(tools.map((t) => {
          if (t.id === id) {
            t.public = isPublic;
          }
          return t;
        }));
      } catch (e) {
        setErrorLoading(true);
      } finally {
        setIsLoading(false);
      }
    };

    sc();
  };

  const handleDeleteTool = (tool: string, id: string) => {
    const sc = async () => {
      setIsLoading(true);
      setErrorLoading(false);
      try {
        await sendCommandAsync(deleteToolInstance(tool, id));
        setTools(tools.filter((t) => t.id !== id));
      } catch (e) {
        setErrorLoading(true);
      } finally {
        setIsLoading(false);
      }
    };

    sc();
  };

  return (
    <Segment color={'grey'} loading={isLoading}>
      {errorLoading && <Message negative>
        <Message.Header>Error</Message.Header>
        <p>There was an error fetching the tool data.</p>
      </Message>}
      <Header as={'h2'}>Tools</Header>
      <ToolsDataTable
        tools={tools}
        onChangeMetadata={handleChangeMetadata}
        onDelete={handleDeleteTool}
        showUserName={true}
      />
    </Segment>
  );
};

export default Tools;
