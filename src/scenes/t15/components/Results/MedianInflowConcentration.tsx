import { Table } from 'semantic-ui-react';
import IStatsTotal from '../../../../core/model/qmra/result/StatsTotal.type';

interface IProps {
  data: IStatsTotal[];
}

const MedianInflowConcentration = ({ data }: IProps) => {
  return (
    <Table celled size="small" style={{overflow: 'auto'}}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Scheme</Table.HeaderCell>
          <Table.HeaderCell>Pathogen Group</Table.HeaderCell>
          <Table.HeaderCell>Pathogen Name</Table.HeaderCell>
          <Table.HeaderCell>Key</Table.HeaderCell>
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
            <Table.Cell>{r.TreatmentSchemeName}</Table.Cell>
            <Table.Cell>{r.PathogenGroup}</Table.Cell>
            <Table.Cell>{r.PathogenName}</Table.Cell>
            <Table.Cell>{r.key}</Table.Cell>
            <Table.Cell textAlign="right">{r.min}</Table.Cell>
            <Table.Cell textAlign="right">{r.p05}</Table.Cell>
            <Table.Cell textAlign="right">{r.mean}</Table.Cell>
            <Table.Cell textAlign="right">{r.median}</Table.Cell>
            <Table.Cell textAlign="right">{r.p95}</Table.Cell>
            <Table.Cell textAlign="right">{r.max}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default MedianInflowConcentration;
