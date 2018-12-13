import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {Button, Form, Table} from 'semantic-ui-react';
import {Boundary, Stressperiods} from 'core/model/modflow';

class BoundaryValuesDataTable extends React.Component {

    handleDateTimeValueChange = (e, {id, name, value}) => {
        const {boundary, selectedOP} = this.props;
        let dateTimeValues = boundary.getDateTimeValues(selectedOP);

        if (name === 'dateTime') {
            dateTimeValues = dateTimeValues.map((dtv, dtvIdx) => {
                if (id === dtvIdx) {
                    dtv.date_time = moment.utc(value).toISOString();
                    return dtv;
                }

                return dtv;
            });
        }

        if (name === 'dateTimeValue') {
            dateTimeValues = dateTimeValues.map((dtv, dtvIdx) => {
                if (id === dtvIdx) {
                    dtv.values[id] = value;
                    return dtv;
                }

                return dtv;
            });
        }

        boundary.setDateTimeValues(dateTimeValues, selectedOP);
        this.props.onChange(boundary)
    };

    handleRemoveDateTimeValues = (dtvIdx) => {
        const {boundary, selectedOP} = this.props;
        let dateTimeValues = boundary.getDateTimeValues(selectedOP);
        dateTimeValues = dateTimeValues.filter((dtv, idx) => (dtvIdx !== idx));
        boundary.setDateTimeValues(dateTimeValues, selectedOP);
        if (boundary.getDateTimeValues(selectedOP).length === 0) {
            boundary.setDefaultValues(this.props.stressperiods.startDateTime);
        }
        this.props.onChange(boundary);
    };

    body = (dateTimeValues) => (
        dateTimeValues.map((dtv, dtvIdx) => (
            <Table.Row key={dtvIdx}>
                <Table.Cell>
                    <Form.Input
                        disabled={this.props.readOnly}
                        id={dtvIdx}
                        name={'dateTime'}
                        onChange={this.handleDateTimeValueChange}
                        type={'date'}
                        value={moment(dtv.date_time).format('YYYY-MM-DD')}
                    />
                </Table.Cell>
                {dtv.values.map((v, vIdx) => (
                    <Table.Cell key={vIdx}>
                        <Form.Input
                            disabled={this.props.readOnly}
                            id={vIdx}
                            name={'dateTimeValue'}
                            onChange={this.handleDateTimeValueChange}
                            type={'number'}
                            value={v}
                        >
                        </Form.Input>
                    </Table.Cell>
                ))}
                <Table.Cell>
                    {!this.props.readOnly && <Button
                        floated={'right'}
                        icon={'trash'}
                        onClick={() => this.handleRemoveDateTimeValues(dtvIdx)}
                    />}
                </Table.Cell>
            </Table.Row>
        ))
    );

    render() {
        const {boundary, selectedOP} = this.props;
        const dateTimeValues = boundary.getDateTimeValues(selectedOP);

        return (
            <Table color={'red'} size={'small'} singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Start Date</Table.HeaderCell>
                        {boundary.valueProperties.map((p, idx) => (
                            <Table.HeaderCell key={idx}>{p.name}</Table.HeaderCell>))}
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{this.body(dateTimeValues)}</Table.Body>
            </Table>
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
