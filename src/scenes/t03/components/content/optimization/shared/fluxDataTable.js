/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';

import * as edit from 'react-edit';
import * as DataTable from "react/cjs/react.development";
import * as Formatter from "lodash";

class FluxDataTable extends DataTable.Component.DataTable {
    constructor(props) {
        super(props);

        this.state = {
            searchColumn: 'all',
            query: {}, // Search query
            page: 1,
            perPage: this.props.perPage || 20,
            selectedRows: [],
            // Sort the first column in a descending way by default.
            // "asc" would work too and you can set multiple if you want.
            sortingColumns: {
                'date_time': {
                    direction: 'asc',
                    position: 0
                },
            },
            columns: [{
                property: 'date_time',
                header: {
                    label: 'Start Time',
                    transforms: [this.resetable],
                    formatters: [this.header]
                },
                cell: {
                    transforms: [],
                    formatters: [(value) => (<span>{Formatter.toDate(value)}</span>)]
                }
            }],
            rows: this.props.rows
        };

        props.config.forEach(item => {
            this.state.columns.push({
                property: item.property,
                header: {label: item.label},
                cell: {
                    transforms: this.props.readOnly ?
                        [] : [this.editable(edit.input({props: {type: 'number'}}))],
                    formatters: [(value) => (<span>{Formatter.toNumber(value)}</span>)]
                }
            });
        });
    }

    onRowsChange = rows => {
        this.props.onChange(rows);
    };
}

FluxDataTable.propTypes = {
    config: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool.isRequired,
    rows: PropTypes.array.isRequired,
};

export default FluxDataTable;