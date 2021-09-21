import { Accordion, AccordionProps, Button, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { Array2D } from '../../../../../core/model/geometry/Array2D.type';
import { BoundaryCollection } from '../../../../../core/model/modflow/boundaries';
import { Calculation, ModflowModel, Soilmodel, Transport } from '../../../../../core/model/modflow';
import { ICell } from '../../../../../core/model/geometry/Cells.type';
import { IT03Reducer } from '../../../../t03/reducers';
import { MouseEvent, useEffect, useState } from 'react';
import { fetchCalculationResultsTransport, sendCommand } from '../../../../../services/api';
import { useHistory } from 'react-router-dom';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsMap from '../../../../t03/components/maps/resultsMap';
import ResultsSelectorTransport from '../../../../shared/complexTools/ResultsSelectorTransport';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import Uuid from 'uuid';

interface IProps {
  reducer: IT03Reducer;
}

const TransportResults = (props: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [data, setData] = useState<Array2D<number> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLay, setSelectedLay] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [selectedCol, setSelectedCol] = useState<number>(0);
  const [selectedTotim, setSelectedTotim] = useState<number>(0);
  const [selectedSubstance, setSelectedSubstance] = useState<number>(0);
  const [layerValues, setLayerValues] = useState<string[][] | null>(null);
  const [totalTimes, setTotalTimes] = useState<number[] | null>(null);

  const boundaries = props.reducer.boundaries ? BoundaryCollection.fromObject(props.reducer.boundaries) : null;
  const calculation = props.reducer.calculation ? Calculation.fromObject(props.reducer.calculation) : null;
  const model = props.reducer.model ? ModflowModel.fromObject(props.reducer.model) : null;
  const soilmodel = props.reducer.soilmodel ? Soilmodel.fromObject(props.reducer.soilmodel) : null;
  const transport = props.reducer.transport ? Transport.fromObject(props.reducer.transport) : null;

  const history = useHistory();

  const fetchData = ({ substance, layer, totim }: { substance: number; layer: number; totim: number }) => {
    if (!calculation) {
      return null;
    }
    const calculationId = calculation.id;
    setIsLoading(true);

    fetchCalculationResultsTransport(
      { calculationId, substance: selectedSubstance, layer, totim },
      (cData: Array2D<number>) => {
        setSelectedLay(layer);
        setSelectedSubstance(substance);
        setSelectedTotim(totim);
        setData(cData);
        setIsLoading(false);
      },
      () => null
    );
  };

  useEffect(() => {
    if (model === null) {
      return;
    }

    setSelectedCol(Math.floor(model.gridSize.nX / 2));
    setSelectedRow(Math.floor(model.gridSize.nY / 2));

    fetchData({ substance: selectedSubstance, layer: selectedLay, totim: selectedTotim });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useEffect(() => {
    if (calculation && calculation.times) {
      const times = calculation.times.concentration;
      setLayerValues(calculation.layer_values);
      setSelectedTotim(times.idx.slice(-1)[0]);
      setTotalTimes(times.total_times);
    }
  }, [calculation]);

  if (!boundaries || !calculation || !model || !soilmodel || !transport) {
    return (
      <Segment color={'grey'}>
        <Header as={'h2'}>
          No result data found. <br />
          Have you started the calculation?
        </Header>
      </Segment>
    );
  }

  const handleChangeSelector = ({ substance, layer, totim }: { substance: number; layer: number; totim: number }) => {
    setSelectedSubstance(substance);
    setSelectedLay(layer);
    setSelectedTotim(totim);
    fetchData({ substance, layer, totim });
  };

  const handleClickMap = (colRow: ICell) => {
    setSelectedRow(colRow[1]);
    setSelectedCol(colRow[0]);
  };

  const handleCreateScenarioAnalysisClick = () => {
    const scenarioAnalysisId = Uuid.v4();
    sendCommand(
      ScenarioAnalysisCommand.createScenarioAnalysis(
        scenarioAnalysisId,
        model.id,
        'New scenario analysis ' + model.name,
        '',
        model.isPublic
      ),
      () => history.push('/tools/T07/' + scenarioAnalysisId),
      () => null
    );
  };

  const handleClickAccordion = (e: MouseEvent, titleProps: AccordionProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  return (
    <Segment color={'grey'} loading={isLoading}>
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            {totalTimes && layerValues && (
              <ResultsSelectorTransport
                data={{
                  substance: selectedSubstance,
                  layer: selectedLay,
                  totim: selectedTotim,
                }}
                onChange={handleChangeSelector}
                layerValues={layerValues}
                soilmodel={soilmodel}
                stressperiods={model.stressperiods}
                totalTimes={totalTimes}
                transport={transport}
              />
            )}
            <Segment color={'grey'} loading={isLoading}>
              <Accordion>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
                  <Icon name="dropdown" />
                  Results Map
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                  {data && (
                    <ResultsMap
                      activeCell={[selectedCol, selectedRow]}
                      boundaries={boundaries}
                      data={data}
                      model={model}
                      onClick={handleClickMap}
                      colors={['#0000F0', '#016CFD', '#5FFF97', '#FDCC01', '#E20000']}
                      opacity={0.75}
                    />
                  )}
                </Accordion.Content>
              </Accordion>
            </Segment>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment loading={isLoading} color={'blue'}>
                    <Header textAlign={'center'} as={'h4'}>
                      Horizontal cross section
                    </Header>
                    {data && <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'row'} />}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment loading={isLoading} color={'blue'}>
                    <Header textAlign={'center'} as={'h4'}>
                      Vertical cross section
                    </Header>
                    {data && <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'col'} />}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {!model.readOnly && (
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Button onClick={handleCreateScenarioAnalysisClick}>Create Scenario Analysis</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default TransportResults;
