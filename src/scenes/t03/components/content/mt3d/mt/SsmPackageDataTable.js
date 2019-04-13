import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'semantic-ui-react';
import moment from 'moment/moment';

const styles = {
    input: {
        maxWidth: '200px'
    }
};

class SsmPackageDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: props.rows
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rows: nextProps.rows
        });
    }

    onLocalChange = id => e => this.setState({
        rows: this.props.rows.map(row => {
            if (row.id === id) {
                row.value = e.target.value;
            }
            return row;
        })
    });

    render() {
        const {rows} = this.props;

        return (
            <Table size={'small'} singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Start Time</Table.HeaderCell>
                        <Table.HeaderCell>Concentration</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows.map(row =>
                        <Table.Row key={row.id}>
                            <Table.Cell>{moment(row.date_time).format('YYYY-MM-DD')}</Table.Cell>
                            <Table.Cell>
                                <input
                                    disabled={this.props.readOnly}
                                    onBlur={() => this.props.onChange(this.state.rows)}
                                    onChange={this.onLocalChange(row.id)}
                                    style={styles.input}
                                    type='number'
                                    value={row.value ? row.value : 0}
                                />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}

SsmPackageDataTable.propTypes = {
    config: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    rows: PropTypes.array.isRequired,
};

export default SsmPackageDataTable;
