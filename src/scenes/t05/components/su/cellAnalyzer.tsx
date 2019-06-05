import React, {Fragment} from 'react';
import {Button, Icon, Segment, Table} from 'semantic-ui-react';
import {Criterion} from '../../../../core/model/mcda/criteria';
import MCDA from '../../../../core/model/mcda/MCDA';
import {retrieveDroppedData} from '../../../../services/api';

interface IPointObject {
    x: number;
    y: number;
}

interface ICellAnalyzerProps {
    cell: IPointObject;
    mcda: MCDA;

    onClose(): any;
}

export class CellAnalyzer extends React.PureComponent<ICellAnalyzerProps> {
    constructor(props: ICellAnalyzerProps) {
        super(props);
    }

    public renderCriterion(criterion: Criterion) {
        const raster = criterion.raster;
        const {cell} = this.props;

        /* TODO: criteria raster are not available at this point
        return (
            <Table.Row>
                <Table.Cell>{criterion.name}</Table.Cell>
                <Table.Cell>{raster.data[cell.y][cell.x]}</Table.Cell>
            </Table.Row>
        );*/
    }

    public renderSuitability() {
        const {cell} = this.props;

        const value = this.props.mcda.suitability.raster.data[cell.y][cell.x];
        const rule = this.props.mcda.suitability.rulesCollection.findByValue(value);

        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>Suitability</Table.Cell>
                    <Table.Cell>{value.toFixed(4)}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Class</Table.Cell>
                    <Table.Cell>{rule[0].name}</Table.Cell>
                </Table.Row>
            </Fragment>
        );
    }

    public render() {
        const {onClose, cell, mcda} = this.props;

        return (
            <div>
                <Button
                    fluid={true}
                    primary={true}
                    icon={true}
                    labelPosition="left"
                    onClick={onClose}
                >
                    <Icon name="arrow circle left"/>
                    Back
                </Button>
                <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                    Cell Analyzer
                </Segment>
                <Table>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                Cell
                            </Table.Cell>
                            <Table.Cell>
                                x: {cell.x}, y: {cell.y}
                            </Table.Cell>
                        </Table.Row>
                        {mcda.criteriaCollection.all.map((criterion: Criterion) => this.renderCriterion(criterion))}
                        {this.renderSuitability()}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
