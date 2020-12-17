import {Button, Form, Header, Input, Table} from 'semantic-ui-react';
import {cloneDeep} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import uuidv4 from 'uuid';

class MfiData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mfi: this.setMfiIds(props.mfi),
            newItem: {t: 0, V: 0}
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            mfi: this.setMfiIds(newProps.mfi)
        });
    }

    setMfiIds = mfi => {
        mfi.sort((a, b) => a.t - b.t);
        return mfi.map(
            item => {
                if (!item.id) {
                    item.id = uuidv4();
                }
                return item;
            }
        )
    };

    removeMfiIds = mfi => {
        mfi.sort((a, b) => a.t - b.t);
        return mfi.map(item => ({t: item.t, V: item.V}));
    };

    removeItem = (id) => {
        this.setState({
            mfi: this.setMfiIds(this.state.mfi.filter(e => e.id !== id))
        })
    };

    addItem = () => {
        const mfi = cloneDeep(this.state.mfi);
        mfi.push({...this.state.newItem, id: uuidv4()});
        this.setState({
            mfi: mfi,
            newItem: {t: 0, V: 0}
        });

        this.props.onChange(this.removeMfiIds(mfi));
    };

    onChangeItem = (e, {id, name, value}) => {
        const updatedItems = this.state.mfi.map(item => {
            if (item.id === id) {
                return {
                    ...item, [name]: value
                }
            }
            return item;
        });

        this.setState({
            mfi: this.setMfiIds(updatedItems)
        })
    };

    onChangeNewItem = (e, {name, value}) => {
        this.setState({
            newItem: {...this.state.newItem, [name]: value}
        })
    };

    save = () => {
        this.props.onChange(this.removeMfiIds(this.state.mfi));
    };

    render() {
        const rows = this.state.mfi.map(item => (
            <Table.Row key={item.id}>
                <Table.Cell style={{borderTop:0}}>
                    <Input
                        id={item.id}
                        name={'t'}
                        onBlur={this.save}
                        onChange={this.onChangeItem}
                        step={1}
                        type={'number'}
                        value={item.t}
                    />
                </Table.Cell>
                <Table.Cell style={{borderTop:0}}>
                    <Input
                        id={item.id}
                        name={'V'}
                        onBlur={this.save}
                        onChange={this.onChangeItem}
                        step={0.01}
                        type={'number'}
                        value={item.V}
                    />
                </Table.Cell>
                <Table.Cell style={{borderTop:0}}>
                    <Button icon='trash' onClick={() => this.removeItem(item.id)} size='small' />
                </Table.Cell>
            </Table.Row>
        ));

        return (
            <Form>
                <Header as={'h3'} textAlign={'center'}>MFI</Header>
                <Table singleLine size='small'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign={'center'}>Time [s]</Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>Volume [l]</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                        <Table.Row>
                            <Table.Cell style={{borderTop:0}}>
                                <Input
                                    name={'t'}
                                    onChange={this.onChangeNewItem}
                                    step={1}
                                    type={'number'}
                                    value={this.state.newItem.t}
                                />
                            </Table.Cell>
                            <Table.Cell style={{borderTop:0}}>
                                <Input
                                    name={'V'}
                                    onChange={this.onChangeNewItem}
                                    step={0.01}
                                    type={'number'}
                                    value={this.state.newItem.V}
                                />
                            </Table.Cell>
                            <Table.Cell style={{borderTop:0}}>
                                <Button icon='add' onClick={this.addItem} size='small' />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Form>
        );
    }
}

MfiData.propTypes = {
    mfi: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MfiData;
