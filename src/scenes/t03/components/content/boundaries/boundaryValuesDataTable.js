import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

import {Input, Table} from 'semantic-ui-react';
import {Boundary, Stressperiods} from 'core/model/modflow';
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

    handleSpValuesChange = () => {
        if (!this.state.activeInput) {
            return;
        }
        const {value, row, col} = this.state.activeInput;
        this.setState({
            activeInput: null
        });

        const {boundary, selectedOP} = this.props;
        const spValues = boundary.getSpValues(selectedOP);

        const updatedSpValues = spValues.map((spv, spvIdx) => {
            if (row === spvIdx) {
                spv[col] = parseFloat(value) || 0;
                return spv;
            }
            return spv;
        });

        boundary.setSpValues(updatedSpValues, selectedOP);
        this.props.onChange(boundary)
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

    body = (spValues) => {
        const {activeInput} = this.state;
        const {stressperiods} = this.props;

        const dateTimes = stressperiods.dateTimes;

        if (dateTimes.length !== spValues.length) {
            // do something;
        }

        return spValues.map((spValue, spIdx) => (
            <Table.Row key={spIdx}>
                <Table.Cell>
                    <Input
                        style={this.getCellStyle()}
                        disabled={true}
                        id={spIdx}
                        name={'dateTime'}
                        type={'date'}
                        value={moment(dateTimes[spIdx]).format('YYYY-MM-DD')}
                    />
                </Table.Cell>
                {spValue.map((v, vIdx) => (
                    <Table.Cell key={vIdx} width={10}>
                        <Input
                            style={this.getCellStyle(spValue.length)}
                            disabled={this.props.readOnly}
                            id={spIdx}
                            col={vIdx}
                            name={'dateTimeValue'}
                            onBlur={this.handleSpValuesChange}
                            onChange={this.handleLocalChange(spIdx, vIdx)}
                            type={'number'}
                            value={activeInput && activeInput.col === vIdx && activeInput.row === spIdx ? activeInput.value : v}
                        />
                    </Table.Cell>
                ))}
            </Table.Row>
        ));
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
        const spValues = boundary.getSpValues(selectedOP);

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
                    <Table.Body>{spValues && this.body(spValues)}</Table.Body>
                </Table>
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
