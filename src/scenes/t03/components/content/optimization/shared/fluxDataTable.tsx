import moment from 'moment/moment';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Input, InputOnChangeData, Table} from 'semantic-ui-react';
import {IMinMaxResult} from '../../../../../../core/model/modflow/optimization/OptimizationObject.type';

const styles = {
    input: {
        border: 0,
        maxWidth: '200px'
    }
};

interface IProps {
    onChange: (rows: IMinMaxResult[]) => any;
    readOnly: boolean;
    rows: IMinMaxResult[];
}

const fluxDataTable = (props: IProps) => {
    const [rows, setRows] = useState(props.rows);

    useEffect(() => {
        setRows(props.rows);
    }, [props.rows]);

    const handleLocalChange = (id: number) => (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setRows(props.rows.map((row, rKey) => {
            if (rKey === id) {
                row[name] = value;
            }
            return row;
        }));
    };

    const handleBlur = () => props.onChange(rows);

    return (
        <Table color={'red'} size={'small'} singleLine={true}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Start Time</Table.HeaderCell>
                    <Table.HeaderCell>Min</Table.HeaderCell>
                    <Table.HeaderCell>Max</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows.map((row, rKey) =>
                    <Table.Row key={rKey}>
                        <Table.Cell>{moment(row.date_time).format('YYYY-MM-DD')}</Table.Cell>
                        <Table.Cell>
                            <Input
                                disabled={props.readOnly}
                                onBlur={handleBlur}
                                onChange={handleLocalChange(rKey)}
                                style={styles.input}
                                type="number"
                                name="min"
                                value={row.min ? row.min : 0}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                disabled={props.readOnly}
                                onBlur={handleBlur}
                                onChange={handleLocalChange(rKey)}
                                style={styles.input}
                                type="number"
                                name="max"
                                value={row.max ? row.max : 0}
                            />
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    );
};

export default fluxDataTable;
