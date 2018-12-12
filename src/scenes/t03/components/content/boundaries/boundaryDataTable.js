import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {Table} from 'semantic-ui-react';
import {Boundary, Stressperiods} from 'core/model/modflow';

class BoundaryDataTable extends React.Component {

    render() {

        const header = () => (
            <Table.Row equal>
                <Table.HeaderCell>Start Date</Table.HeaderCell>
                {this.props.boundary.valueProperties.map((p, idx) => (
                    <Table.HeaderCell key={idx}>{p.name}</Table.HeaderCell>
                ))}
            </Table.Row>
        );

        return (
            <Table color={'red'} size={'small'}>
                <Table.Header>{header()}</Table.Header>
            </Table>
        )
    }
}

BoundaryDataTable.proptypes = {
    readOnly: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired
};

export default BoundaryDataTable;
