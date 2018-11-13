import React from 'react';
import PropTypes from 'prop-types';
import {Form, Header, Input, Table} from "semantic-ui-react";

class MfiCorrections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            corrections: props.corrections
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            corrections: nextProps.corrections
        })
    }

    handleChange = (e, {id, value}) => {
        this.setState({
            corrections: this.state.corrections.map(c => {
                if (c.id === id) {
                    c.value = value;
                }
                return c;
            })
        })
    };

    save = () => {
        this.props.onChange(this.state.corrections);
    };

    render() {
        const rows = this.state.corrections.map(item => (
            <Table.Row key={item.id}>
                <Table.Cell>
                    {item.name}
                </Table.Cell>
                <Table.Cell>
                    <Input
                        id={item.id}
                        onChange={this.handleChange}
                        onBlur={this.save}
                        size={'small'}
                        step={item.stepSize}
                        type={'number'}
                        value={item.value}
                    />
                </Table.Cell>
                <Table.Cell>
                    {item.unit}
                </Table.Cell>
            </Table.Row>
        ));

        return (
            <Form>
                <Header as={'h3'} textAlign={'center'}>Experimental setup</Header>
                <Table size='small' singleLine striped color={'red'}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Parameter</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Unit</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            </Form>
        )
    }
}

MfiCorrections.propTypes = {
    corrections: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MfiCorrections;
