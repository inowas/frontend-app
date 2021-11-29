import { BoundaryCollection, ModflowModel } from '../../../../../core/model/modflow';
import { CALCULATE_STATISTICS_INPUT } from '../../../../modflow/worker/t03.worker';
import {
  ChartObservedVsCalculatedHeads,
  ChartRankedResidualsAgainstNormalProbability,
  ChartTimeSeries,
  ChartWeightedResidualsVsSimulatedHeads,
} from './charts';
import { Container, DropdownProps, Form, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react';
import { ILinearRegression } from '../../../../../services/statistics/calculateStatistics';
import { IRootReducer } from '../../../../../reducers';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { asyncWorker } from '../../../../modflow/worker/worker';
import { fetchCalculationObservations } from '../../../../../services/api';
import { useSelector } from 'react-redux';

export type IHobData = Array<{
  simulated: number;
  observed: number;
  name: string;
}>;

export interface IStatistics {
  names: string[];
  data: Array<{
    name: string;
    simulated: number;
    observed: number;
    residual: number;
    absResidual: number;
    npf: number;
  }>;
  stats: {
    observed: {
      std: number;
      z: number;
      deltaStd: number;
    };
    simulated: {
      std: number;
    };
    residual: {
      std: number;
      sse: number;
      rmse: number;
      nrmse: number;
      min: number;
      max: number;
      mean: number;
    };
    absResidual: {
      max: number;
      mean: number;
      min: number;
    };
  };
  linRegObsSim: ILinearRegression;
  linRegResSim: ILinearRegression;
  linRegObsRResNpf: ILinearRegression;
}

const ObservationStatistics = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const [hobData, setHobData] = useState<IHobData | null>(null);
  const [statistics, setStatistics] = useState<IStatistics | null>(null);
  const [excludedValues, setExcludedValues] = useState<string[]>([]);
  const [excludedWells, setExcludedWells] = useState<string[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('statistics');

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
  const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

  const menuItems = [
    { id: 'statistics', name: 'Statistics' },
    { id: 'time_series', name: 'Time Series' },
  ];

  useEffect(
    () => {
      if (model && model.calculationId) {
        setIsLoading(true);
        fetchCalculationObservations(model.calculationId)
          .then((d: IHobData) => {
            setHobData(d);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            setHobData([]);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (hobData && Array.isArray(hobData)) {
      setIsCalculating(true);
      asyncWorker({
        type: CALCULATE_STATISTICS_INPUT,
        data: {
          data: hobData,
          exclude: excludedValues,
        },
      })
        .then((data: IStatistics) => {
          setStatistics(data);
        })
        .catch(() => {
          setError('Calculation Error: Add more observation wells or stress periods.');
        })
        .finally(() => {
          setIsCalculating(false);
        });
    }
  }, [hobData, excludedValues]);

  const memoizedCharts = useMemo(() => {
    if (!statistics || !model) {
      return null;
    }

    return (
      <div>
        <Header size={'large'}>Simulated vs. Observed Values</Header>
        <ChartObservedVsCalculatedHeads statistics={statistics} />

        <Header size={'large'}>Weighted residuals vs. simulated heads</Header>
        <ChartWeightedResidualsVsSimulatedHeads statistics={statistics} />

        <Header size={'large'}>Ranked residuals against normal probability</Header>
        <ChartRankedResidualsAgainstNormalProbability statistics={statistics} />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statistics]);

  const handleChangeExcludeValue = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const values: string[] = data.value as string[];
    setExcludedValues(values);
  };

  const handleChangeExcludeWell = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    if (!hobData && !Array.isArray(hobData)) {
      return null;
    }
    const wells: string[] = data.value as string[];
    const values = hobData.filter((h) => wells.filter((w) => h.name.includes(w)).length > 0).map((v) => v.name);

    setExcludedValues(values);
    setExcludedWells(wells);
  };

  const handleChangeSelectedMenuItem = (id: string) => () => setSelectedMenuItem(id);

  return (
    <Segment color={'grey'} loading={isLoading}>
      <Grid>
        <Grid.Column width={3}>
          <Menu fluid={true} vertical={true} tabular={true}>
            <Menu.Item>&nbsp;</Menu.Item>
            {menuItems.map((i) => (
              <Menu.Item key={i.id} active={i.id === selectedMenuItem} onClick={handleChangeSelectedMenuItem(i.id)}>
                {i.name}
              </Menu.Item>
            ))}
          </Menu>
        </Grid.Column>
        {selectedMenuItem === 'statistics' ? (
          <Grid.Column width={13}>
            {error && <Message negative>{error}</Message>}
            {!statistics && !error && <span>LOADING</span>}
            {hobData && hobData.length === 0 && <span>No observation data available</span>}
            {hobData && hobData.length > 0 && statistics && (
              <Container fluid={true}>
                <Header size={'large'}>Calculate statistics</Header>
                <Segment raised={true}>
                  <Table celled={true}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Symbol</Table.HeaderCell>
                        <Table.HeaderCell>Value</Table.HeaderCell>
                        <Table.HeaderCell>Unit</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body style={{ overflowY: 'auto' }}>
                      <Table.Row>
                        <Table.Cell>Number of data points</Table.Cell>
                        <Table.Cell>n [-]</Table.Cell>
                        <Table.Cell>{statistics.data.length}</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Maximum Absolute Residual</Table.Cell>
                        <Table.Cell>
                          R<sub>MAX</sub>{' '}
                        </Table.Cell>
                        <Table.Cell>{statistics.stats.absResidual.max.toFixed(3)}</Table.Cell>
                        <Table.Cell>m</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Minimum Absolute Residual</Table.Cell>
                        <Table.Cell>
                          R<sub>MIN</sub>
                        </Table.Cell>
                        <Table.Cell>{statistics.stats.absResidual.min.toFixed(3)}</Table.Cell>
                        <Table.Cell>m</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Residual Mean</Table.Cell>
                        <Table.Cell>
                          R<sub>MEAN</sub>
                        </Table.Cell>
                        <Table.Cell>{statistics.stats.residual.mean.toFixed(3)}</Table.Cell>
                        <Table.Cell>m</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Absolute residual Mean</Table.Cell>
                        <Table.Cell>
                          |R<sub>MEAN</sub>|
                        </Table.Cell>
                        <Table.Cell>{statistics.stats.residual.mean.toFixed(3)}</Table.Cell>
                        <Table.Cell>m</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Standard error of estimation</Table.Cell>
                        <Table.Cell>SSE</Table.Cell>
                        <Table.Cell>{statistics.stats.residual.sse.toFixed(3)}</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Root Mean Squared Error</Table.Cell>
                        <Table.Cell>RMSE</Table.Cell>
                        <Table.Cell>{statistics.stats.residual.rmse.toFixed(3)}</Table.Cell>
                        <Table.Cell>m</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Normalized Root Mean Squared Error</Table.Cell>
                        <Table.Cell>NRMSE</Table.Cell>
                        <Table.Cell>{statistics.stats.residual.nrmse.toFixed(3)}</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Correlation Coefficient Pearson R</Table.Cell>
                        <Table.Cell>R</Table.Cell>
                        <Table.Cell>{statistics.linRegObsSim.r.toFixed(3)}</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Coefficient of determination</Table.Cell>
                        <Table.Cell>
                          R<sup>2</sup>
                        </Table.Cell>
                        <Table.Cell>{statistics.linRegObsSim.r2.toFixed(3)}</Table.Cell>
                        <Table.Cell>-</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Segment>
                <Grid>
                  <Grid.Column width={8}>
                    <Header size={'large'}>Exclude Wells</Header>
                    <Segment raised={true}>
                      <Form>
                        <Form.Dropdown
                          closeOnChange={true}
                          loading={isCalculating}
                          name={'excludedWells'}
                          onChange={handleChangeExcludeWell}
                          options={boundaries
                            ?.filterBy('type', 'hob')
                            .map((w) => ({ key: w.name, value: w.name, text: w.name }))}
                          multiple={true}
                          search
                          selection={true}
                          value={excludedWells}
                        />
                      </Form>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Header size={'large'}>Exclude Values</Header>
                    <Segment raised={true}>
                      <Form>
                        <Form.Dropdown
                          closeOnChange={true}
                          loading={isCalculating}
                          name={'excludedValues'}
                          onChange={handleChangeExcludeValue}
                          options={hobData.map((w) => ({ key: w.name, value: w.name, text: w.name }))}
                          multiple={true}
                          search
                          selection={true}
                          value={excludedValues}
                        />
                      </Form>
                    </Segment>
                  </Grid.Column>
                </Grid>
                <br />
                {memoizedCharts}
              </Container>
            )}
          </Grid.Column>
        ) : (
          <Grid.Column width={13}>
            <Header size="large">Time series</Header>
            <ChartTimeSeries />
          </Grid.Column>
        )}
      </Grid>
    </Segment>
  );
};

export default ObservationStatistics;
