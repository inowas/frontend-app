import {Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment/moment';

const styles = {
    input: {
        border: 0,
        maxWidth: '200px'
    }
};

class FluxDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: props.rows
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            rows: nextProps.rows
        });
    }

    onLocalChange = id => e => this.setState({
        rows: this.props.rows.map(row => {
            if (row.id === id) {
                row[e.target.name] = e.target.value;
            }
            return row;
        })
    });

    render() {
        const {rows} = this.props;

        return (
            <Table color={'red'} size={'small'} singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Start Time</Table.HeaderCell>
                        <Table.HeaderCell>Min</Table.HeaderCell>
                        <Table.HeaderCell>Max</Table.HeaderCell>
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
                                    name='min'
                                    value={row.min ? row.min : 0}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <input
                                    disabled={this.props.readOnly}
                                    onBlur={() => this.props.onChange(this.state.rows)}
                                    onChange={this.onLocalChange(row.id)}
                                    style={styles.input}
                                    type='number'
                                    name='max'
                                    value={row.max ? row.max : 0}
                                />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}

FluxDataTable.propTypes = {
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    rows: PropTypes.array.isRequired,
};

export default FluxDataTable;
