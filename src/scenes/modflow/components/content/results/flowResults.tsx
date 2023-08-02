import { BoundaryCollection } from '../../../../../core/model/modflow/boundaries';
import { Button, Grid, Header, Menu, Segment } from 'semantic-ui-react';
import { Calculation, ModflowModel, Soilmodel } from '../../../../../core/model/modflow';
import { IT03Reducer } from '../../../../t03/reducers';
import { IT20Reducer } from '../../../../t20/reducers';
import { sendCommand } from '../../../../../services/api';
import { useHistory } from 'react-router-dom';
import BudgetResults from './budgetResults';
import CrossSection from './crossSection';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import React, { useState } from 'react';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import TimeSeries from './timeSeries';
import Uuid from 'uuid';

export enum EResultType {
  DRAWDOWN = 'drawdown',
  HEAD = 'head',
}

interface IProps {
  reducer: IT03Reducer | IT20Reducer;
}

enum EMode {
  CROSS_SECTION,
  TIME_SERIES,
  BUDGET,
}

const FlowResults = (props: IProps) => {
  const [mode, setMode] = useState<EMode>(EMode.CROSS_SECTION);
  const boundaries = props.reducer.boundaries ? BoundaryCollection.fromObject(props.reducer.boundaries) : null;
  const calculation = props.reducer.calculation ? Calculation.fromObject(props.reducer.calculation) : null;
  const model = props.reducer.model ? ModflowModel.fromObject(props.reducer.model) : null;
  const packages = props.reducer.packages.data ? FlopyPackages.fromObject(props.reducer.packages.data) : null;
  const soilmodel = props.reducer.soilmodel ? Soilmodel.fromObject(props.reducer.soilmodel) : null;

  const history = useHistory();

  if (!boundaries || !calculation || !model || !packages || !soilmodel) {
    return (
      <Segment color={'grey'}>
        <Header as={'h2'}>
          No result data found. <br />
          Have you started the calculation?
        </Header>
      </Segment>
    );
  }

  const handleChangeMode = (m: EMode) => () => setMode(m);

  const handleCreateScenarioAnalysisClick = () => {
    const scenarioAnalysisId = Uuid.v4();
    sendCommand(
      ScenarioAnalysisCommand.createScenarioAnalysis(
        scenarioAnalysisId,
        model.id,
        'New scenario analysis ' + model.name,
        '',
        model.isPublic,
      ),
      () => history.push('/tools/T07/' + scenarioAnalysisId),
      () => null,
    );
  };

  const renderMode = () => {
    if (mode === EMode.CROSS_SECTION) {
      return (
        <CrossSection
          boundaries={boundaries}
          calculation={calculation}
          model={model}
          packages={packages}
          soilmodel={soilmodel}
        />
      );
    }
    if (mode === EMode.TIME_SERIES) {
      return <TimeSeries
        boundaries={boundaries}
        calculation={calculation}
        model={model}
        soilmodel={soilmodel}
      />;
    }
    if (mode === EMode.BUDGET) {
      return <BudgetResults reducer={props.reducer} />;
    }
  };


  return (
    <Segment color={'grey'}>
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column width={3}>
            <Menu fluid={true} vertical={true} tabular={true}>
              <Menu.Item active={mode === EMode.CROSS_SECTION} onClick={handleChangeMode(EMode.CROSS_SECTION)}>
                Cross Section
              </Menu.Item>
              <Menu.Item active={mode === EMode.TIME_SERIES} onClick={handleChangeMode(EMode.TIME_SERIES)}>
                Time Series
              </Menu.Item>
              <Menu.Item active={mode === EMode.BUDGET} onClick={handleChangeMode(EMode.BUDGET)}>
                Budget
              </Menu.Item>
            </Menu>
            {!model.readOnly && <Button
              style={{ marginTop: '10px' }}
              primary={true}
              onClick={handleCreateScenarioAnalysisClick}
            >
              Create Scenario Analysis
            </Button>}
          </Grid.Column>
          <Grid.Column width={13}>{renderMode()}</Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default FlowResults;
