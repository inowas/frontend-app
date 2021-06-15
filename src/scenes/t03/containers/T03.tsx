import {ContentWrapper} from '../components/content/index';
import {DataFetcherWrapper} from '../components';
import {Grid, Icon} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {
  ModflowModel,
} from '../../../core/model/modflow';
import {RouteComponentProps} from 'react-router-dom';
import {cloneDeep} from 'lodash';
import {sendCommand} from '../../../services/api';
import {
  updateCalculation, updateModel
} from '../actions/actions';
import {updateProcessedPackages, updateProcessingPackages} from '../../t20/actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import AppContainer from '../../shared/AppContainer';
import CalculationProcess from '../../modflow/components/content/calculation/CalculationProcess';
import MessageBox from '../../shared/MessageBox';
import ModflowModelCommand from '../commands/modflowModelCommand';
import Navigation from './navigation';
import OptimizationProgressBar from '../components/content/optimization/optimizationProgressBar';
import React, {ReactNode, useEffect, useState} from 'react';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';

const navDocumentation = [{
  name: 'Documentation',
  path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
  icon: <Icon name="file"/>
}];

type IProps = RouteComponentProps<{
  id: string;
  property?: string;
  type?: string;
}>;

const T03 = (props: IProps) => {
  const [navigation, setNavigation] = useState<Array<{
    name: string;
    path: string;
    icon: ReactNode
  }>>(navDocumentation);

  const dispatch = useDispatch();
  const T03Reducer = useSelector((state: IRootReducer) => state.T03);
  const model = T03Reducer.model ? ModflowModel.fromObject(T03Reducer.model) : null;

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

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const saveMetaData = (tool: IToolMetaDataEdit) => {
    const {name, description} = tool;
    const isPublic = tool.public;

    if (model) {
      const cModel = model;
      cModel.name = name;
      cModel.description = description;
      cModel.isPublic = isPublic;

      return sendCommand(
        ModflowModelCommand.updateModflowModelMetadata(cModel.id, name, description, isPublic),
        () => dispatch(updateModel(cModel)),
        // tslint:disable-next-line:no-console
        (e) => console.log(e)
      );
    }
  };

  return (
    <AppContainer navbarItems={navigation}>
      <DataFetcherWrapper>
        {model && <ToolMetaData
          isDirty={false}
          readOnly={false}
          tool={{
            tool: 'T03',
            name: model.name,
            description: model.description,
            public: model.isPublic
          }}
          onSave={saveMetaData}
        />}
        <Grid padded={true}>
          <Grid.Row>
            <Grid.Column width={3}>
              <Navigation/>
              <CalculationProcess
                reducer={T03Reducer}
                updateCalculation={updateCalculation}
                updateProcessedPackages={updateProcessedPackages}
                updateProcessingPackages={updateProcessingPackages}
              />
              <OptimizationProgressBar/>
            </Grid.Column>
            <Grid.Column width={13}>
              <MessageBox/>
              <ContentWrapper/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DataFetcherWrapper>
    </AppContainer>
  );
};

export default T03;
