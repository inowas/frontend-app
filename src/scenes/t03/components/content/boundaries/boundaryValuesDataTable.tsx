import moment from 'moment';
import React, {ChangeEvent, useState} from 'react';
import {Input, Table} from 'semantic-ui-react';
import {Stressperiods} from '../../../../../core/model/modflow';
import {Boundary, LineBoundary} from '../../../../../core/model/modflow/boundaries';
import {ISpValues} from '../../../../../core/model/modflow/boundaries/Boundary.type';

interface IActiveInput {
    col: number;
    name: string;
    row: number;
    value: string;
}

interface IProps {
    boundary: Boundary;
    onChange: (boundary: Boundary) => any;
    readOnly: boolean;
    selectedOP?: string;
    stressperiods: Stressperiods;
}

const boundaryValuesDataTable = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);

    const {boundary, selectedOP} = props;

    const getSpValues = () => {
        if (boundary instanceof LineBoundary) {
            return selectedOP ? boundary.getSpValues(selectedOP) : null;
        }
        return boundary.getSpValues();
    };

    const spValues: ISpValues | null = getSpValues();

    const handleLocalChange = (row: number, col: number) => (e: ChangeEvent<HTMLInputElement>) => setActiveInput({
        col,
        name: e.target.name,
        row,
        value: e.target.value
    });

    const handleSpValuesChange = () => {
        if (!activeInput) {
            return;
        }
        const {value, row, col} = activeInput;
        setActiveInput(null);

        if (spValues) {
            const updatedSpValues = spValues.map((spv, spvIdx) => {
                if (row === spvIdx) {
                    spv[col] = parseFloat(value) || 0;
                    return spv;
                }
                return spv;
            });
            boundary.setSpValues(updatedSpValues as ISpValues, selectedOP);
        }
        return props.onChange(boundary);
    };

    const getCellStyle = (numberOfCells: number) => {
        switch (numberOfCells) {
            case 2:
                return {
                    maxWidth: '130px',
                    padding: 0,
                    border: 0
                };
            case 3:
                return {
                    maxWidth: '130px',
                    padding: 0,
                    border: 0
                };
            default:
                return {
                    maxWidth: '150px',
                    padding: 0,
                    border: 0
                };
        }
    };

    const body = () => {
        const {stressperiods} = props;

        const dateTimes = stressperiods.dateTimes;

        if (!spValues || dateTimes.length !== spValues.length) {
            return (
                <Table.Row>
                    <Table.Cell>Boundary stress period number doesn't fit number of model stress periods. <br />
                    Please create a new boundary instead.</Table.Cell>
                </Table.Row>
            );
        }

        return spValues.map((spValue, spIdx) => (
            <Table.Row key={spIdx}>
                <Table.Cell width={4}>
                    <Input
                        style={getCellStyle(1)}
                        disabled={true}
                        id={spIdx}
                        name={'dateTime'}
                        type={'date'}
                        value={moment(dateTimes[spIdx]).format('YYYY-MM-DD')}
                    />
                </Table.Cell>
                {spValue.map((v, vIdx) => (
                    <Table.Cell key={vIdx}>
                        <Input
                            style={getCellStyle(spValue.length)}
                            disabled={props.readOnly}
                            id={spIdx}
                            col={vIdx}
                            name={'dateTimeValue'}
                            onBlur={handleSpValuesChange}
                            onChange={handleLocalChange(spIdx, vIdx)}
                            type={'number'}
                            value={activeInput && activeInput.col === vIdx && activeInput.row === spIdx ?
                                activeInput.value : v}
                        />
                    </Table.Cell>
                ))}
            </Table.Row>
        ));
    };

    /*public handleCSV = (e: any) => { // todo: handle csv and type of e
        let hasError = false;
        const errorMessages: string[] = [];
        const dateTimeValues = [];

        const dateCodes = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
        const firstLine = moment.utc(e.data[0][0]);

        if (!firstLine.isValid()) {
            return this.setState({
                error: true,
                errorMsg: [`Invalid date_time at line 1 at ${dateCodes[firstLine.invalidAt()]}.`],
                id: uuidv4(),
                success: false
            });
        }

        e.data.forEach((row: number[], rKey: number) => {
            const values = this.props.boundary.defaultValues.map((v: number, vKey: number) => {
                if (row[vKey + 1] && isNaN(row[vKey + 1])) {
                    hasError = true;
                    errorMessages.push(`Invalid value at line ${rKey + 1}, column ${vKey + 1}: value is not a number.`);
                }

                return row[vKey + 1] || v;
            });
            const dateTime = moment.utc(row[0]);

            if (!dateTime.isValid()) {
                hasError = true;
                errorMessages.push(`Invalid date_time at line ${rKey + 1} at ${dateCodes[firstLine.invalidAt()]}.`);
                return;
            }

            const dateTimeValue = {
                date_time: dateTime.toISOString(),
                values
            };
            dateTimeValues.push(dateTimeValue);
        });

        if (!hasError) {
            const {boundary, selectedOP} = this.props;
            boundary.setDateTimeValues(dateTimeValues, selectedOP);
            this.props.onChange(boundary);
        }

        return this.setState({
            ...this.state,
            error: hasError,
            errorMsg: errorMessages,
            id: uuidv4(),
            success: !hasError
        });
    };*/

    return (
        <div>
            {/*<CsvUpload uploadState={this.state.uploadState} onUploaded={this.handleCSV}/>*/}
            <Table size={'small'} singleLine={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Start Date</Table.HeaderCell>
                        {boundary.valueProperties.map((p, idx) => (
                            <Table.HeaderCell key={idx}>{p.name} ({p.unit})</Table.HeaderCell>))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>{spValues && body()}</Table.Body>
            </Table>
        </div>
    );
};

export default boundaryValuesDataTable;
