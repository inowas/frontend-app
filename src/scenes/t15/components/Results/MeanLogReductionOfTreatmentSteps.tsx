import { Table } from 'semantic-ui-react';
import IStatsLogRemoval from '../../../../core/model/qmra/result/StatsLogRemoval.type';

interface IProps {
  data: IStatsLogRemoval[];
}

const MeanLogReductionOfTreatmentSteps = ({ data }: IProps) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Treatment Name</Table.HeaderCell>
          <Table.HeaderCell>Pathogen Group</Table.HeaderCell>
          <Table.HeaderCell>min</Table.HeaderCell>
          <Table.HeaderCell>5 Percentile</Table.HeaderCell>
          <Table.HeaderCell>mean</Table.HeaderCell>
          <Table.HeaderCell>median</Table.HeaderCell>
          <Table.HeaderCell>95 Percentile</Table.HeaderCell>
          <Table.HeaderCell>max</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((r, key) => (
          <Table.Row key={key}>
            <Table.Cell>{r.TreatmentName}</Table.Cell>
            <Table.Cell>{r.PathogenGroup}</Table.Cell>
            <Table.Cell>{r.min}</Table.Cell>
            <Table.Cell>{r.p05}</Table.Cell>
            <Table.Cell>{r.mean}</Table.Cell>
            <Table.Cell>{r.median}</Table.Cell>
            <Table.Cell>{r.p95}</Table.Cell>
            <Table.Cell>{r.max}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default MeanLogReductionOfTreatmentSteps;
