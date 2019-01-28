import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

import {Button, Icon, Input, Table} from 'semantic-ui-react';
import {Boundary, Stressperiods} from 'core/model/modflow';
import {cloneDeep} from 'lodash';
import CsvUpload from '../../../../shared/simpleTools/upload/CsvUpload';

class BoundaryValuesDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadState: {
                activeInput: null,
                error: false,
                errorMsg: [],
                id: uuidv4(),
                success: false
            }
        };
    }

    handleLocalChange = (row, col) => e => this.setState({
        activeInput: {
            col,
            name: e.target.name,
            row,
            value: e.target.value
        }
    });

    handleDateTimeChange = row => (e, {name, value}) => {
        const {boundary, selectedOP} = this.props;
        let dateTimeValues = boundary.getDateTimeValues(selectedOP);

        if (name === 'dateTime') {
            dateTimeValues = dateTimeValues.map((dtv, dtvIdx) => {
                if (row === dtvIdx) {
                    dtv.date_time = moment.utc(value).toISOString();
                    return dtv;
                }

                return dtv;
            });
        }

        boundary.setDateTimeValues(dateTimeValues, selectedOP);
        this.props.onChange(boundary)
    };

    handleDateTimeValueChange = () => {
        if (!this.state.activeInput) {
            return;
        }

        const {name, value, row, col} = this.state.activeInput;

        this.setState({
            activeInput: null
        });

        const {boundary, selectedOP} = this.props;
        let dateTimeValues = boundary.getDateTimeValues(selectedOP);

        if (name === 'dateTimeValue') {
            dateTimeValues = dateTimeValues.map((dtv, dtvIdx) => {
                if (row === dtvIdx) {
                    dtv.values[col] = parseFloat(value) || 0;
                    return dtv;
                }

                return dtv;
            });
        }

        boundary.setDateTimeValues(dateTimeValues, selectedOP);
        this.props.onChange(boundary)
    };

    handleRemoveDateTimeValues = (dtvIdx) => () => {
        const {boundary, selectedOP} = this.props;
        let dateTimeValues = boundary.getDateTimeValues(selectedOP);
        dateTimeValues = dateTimeValues.filter((dtv, idx) => (dtvIdx !== idx));
        boundary.setDateTimeValues(dateTimeValues, selectedOP);
        if (boundary.getDateTimeValues(selectedOP).length === 0) {
            boundary.setDefaultValues(this.props.stressperiods.startDateTime);
        }
        this.props.onChange(boundary);
    };

    addNewDatetimeValue = (number, unit = 'days') => {
        const {boundary, selectedOP} = this.props;
        const dateTimeValues = boundary.getDateTimeValues(selectedOP);
        const lastDateTimeValue = dateTimeValues[dateTimeValues.length - 1];
        const newDateTimeValue = cloneDeep(lastDateTimeValue);
        newDateTimeValue.date_time = moment.utc(lastDateTimeValue.date_time).add(number, unit).toISOString();
        dateTimeValues.push(newDateTimeValue);
        boundary.setDateTimeValues(dateTimeValues, selectedOP);
        this.props.onChange(boundary);
    };

    getCellStyle = (numberOfCells) => {
        switch (numberOfCells) {
            case 2:
                return {
                    maxWidth: '90px',
                    padding: 0,
                    border: 0
                };
            case 3:
                return {
                    maxWidth: '50px',
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

    body = (dateTimeValues) => {
        const {activeInput} = this.state;

        return dateTimeValues.map((dtv, dtvIdx) => (
            <Table.Row key={dtvIdx}>
                <Table.Cell>
                    <Input
                        style={this.getCellStyle()}
                        disabled={this.props.readOnly}
                        id={dtvIdx}
                        name={'dateTime'}
                        onChange={this.handleDateTimeChange(dtvIdx)}
                        type={'date'}
                        value={moment(dtv.date_time).format('YYYY-MM-DD')}
                    />
                </Table.Cell>
                {dtv.values.map((v, vIdx) => (
                    <Table.Cell key={vIdx} width={10}>
                        <Input
                            style={this.getCellStyle(dtv.values.length)}
                            disabled={this.props.readOnly}
                            id={dtvIdx}
                            col={vIdx}
                            name={'dateTimeValue'}
                            onBlur={this.handleDateTimeValueChange}
                            onChange={this.handleLocalChange(dtvIdx, vIdx)}
                            type={'number'}
                            value={activeInput && activeInput.col === vIdx && activeInput.row === dtvIdx ? activeInput.value : v}
                        />
                    </Table.Cell>
                ))}
                <Table.Cell>
                    {!this.props.readOnly && <Button
                        basic
                        floated={'right'}
                        icon={'trash'}
                        onClick={this.handleRemoveDateTimeValues(dtvIdx)}
                    />}
                </Table.Cell>
            </Table.Row>
        ))
    };

    handleCSV = (e) => {
        let hasError = false;
        const errorMessages = [];
        const dateTimeValues = [];

        const dateCodes = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
        const firstLine = moment.utc(e.data[0][0]);

        if (!firstLine.isValid()) {
            return this.setState({
                uploadState: {
                    error: true,
                    errorMsg: [`Invalid date_time at line 1 at ${dateCodes[firstLine.invalidAt()]}.`],
                    id: uuidv4(),
                    success: false
                }
            });
        }

        e.data.forEach((row, rKey) => {
            const values = this.props.boundary.defaultValues.map((v, vKey) => {
                if (row[vKey + 1] && isNaN(row[vKey + 1])) {
                    hasError = true;
                    errorMessages.push(`Invalid value at line ${rKey + 1}, column ${vKey + 1}: value is not a number.`);
                }

                return row[vKey + 1] || v;
            });
            const date_time = moment.utc(row[0]);

            if (!date_time.isValid()) {
                hasError = true;
                errorMessages.push(`Invalid date_time at line ${rKey + 1} at ${dateCodes[firstLine.invalidAt()]}.`);
                return;
            }

            const dateTimeValue = {
                date_time: date_time.toISOString(),
                values: values
            };
            dateTimeValues.push(dateTimeValue);
        });

        if (!hasError) {
            const {boundary, selectedOP} = this.props;
            boundary.setDateTimeValues(dateTimeValues, selectedOP);
            this.props.onChange(boundary);
        }

        return this.setState({
            uploadState: {
                ...this.state.uploadState,
                error: hasError,
                errorMsg: errorMessages,
                id: uuidv4(),
                success: !hasError
            }
        });
    };

    render() {
        const {boundary, selectedOP} = this.props;
        const dateTimeValues = boundary.getDateTimeValues(selectedOP);

        return (
            <div>
                <CsvUpload uploadState={this.state.uploadState} onUploaded={this.handleCSV}/>
                <Table size={'small'} singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                            {boundary.valueProperties.map((p, idx) => (
                                <Table.HeaderCell key={idx}>{p.name}</Table.HeaderCell>))}
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{dateTimeValues && this.body(dateTimeValues)}</Table.Body>
                </Table>
                <Button.Group size={'small'}>
                    <Button icon onClick={() => this.addNewDatetimeValue(1, 'days')}><Icon name='add circle'/> 1
                        Day</Button>
                    <Button icon onClick={() => this.addNewDatetimeValue(1, 'weeks')}><Icon name='add circle'/> 1
                        Week</Button>
                    <Button icon onClick={() => this.addNewDatetimeValue(1, 'months')}><Icon name='add circle'/> 1 Month</Button>
                    <Button icon onClick={() => this.addNewDatetimeValue(1, 'years')}><Icon name='add circle'/> 1
                        Year</Button>
                </Button.Group>
            </div>
        )
    }
}

BoundaryValuesDataTable.proptypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    selectedOP: PropTypes.string,
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired
};

export default BoundaryValuesDataTable;
