import {Button, Icon, Segment, Table} from 'semantic-ui-react';
import {ICriterion} from '../../../../core/model/mcda/criteria/Criterion.type';
import MCDA from '../../../../core/model/mcda/MCDA';
import React, {Fragment} from 'react';

interface IPointObject {
    x: number;
    y: number;
}

interface ICellAnalyzerProps {
    cell: IPointObject;
    mcda: MCDA;

    onClose(): any;
}

const CellAnalyzer = (props: ICellAnalyzerProps) => {
    const {onClose, cell, mcda} = props;

    const renderCriterion = (criterion: ICriterion, key: number) => {
        if (criterion.raster.data[cell.y] && criterion.raster.data[cell.y][cell.x]) {
            return (
                <Table.Row key={key}>
                    <Table.Cell>{criterion.name}</Table.Cell>
                    <Table.Cell>{criterion.raster.data[cell.y][cell.x]} {criterion.unit}</Table.Cell>
                </Table.Row>
            );
        }
    };

    const renderSuitability = () => {
        if (props.mcda.suitability.raster.data[cell.y] && props.mcda.suitability.raster.data[cell.y][cell.x]) {
            const value = props.mcda.suitability.raster.data[cell.y][cell.x];
            const rule = props.mcda.suitability.rulesCollection.findByValue(value);

            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell>Suitability</Table.Cell>
                        <Table.Cell>{value ? value.toFixed(4) : 'No Value'}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Class</Table.Cell>
                        <Table.Cell>{rule && rule.length > 0 ? rule[0].name : 'Unsuitable'}</Table.Cell>
                    </Table.Row>
                </Fragment>
            );
        }
    };

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
                    {
                        mcda.toObject().criteria.map(
                            (criterion: ICriterion, key: number) => renderCriterion(criterion, key)
                        )
                    }
                    {renderSuitability()}
                </Table.Body>
            </Table>
        </div>
    );
};

export default CellAnalyzer;
