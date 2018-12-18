import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Header, Input, Table} from 'semantic-ui-react';
import uuidv4 from 'uuid';
import {cloneDeep} from 'lodash';

class MfiData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mfi: this.setMfiIds(props.mfi),
            newItem: {t: 0, V: 0}
        };
    }

    componentWillReceiveProps(newProps) {
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
                <Table.Cell>
                    <Input
                        id={item.id}
                        name={'t'}
                        onBlur={this.save}
                        onChange={this.onChangeItem}
                        size={'small'}
                        step={1}
                        type={'number'}
                        value={item.t}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        id={item.id}
                        name={'V'}
                        onBlur={this.save}
                        onChange={this.onChangeItem}
                        size={'small'}
                        step={0.01}
                        type={'number'}
                        value={item.V}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Button icon='trash' onClick={() => this.removeItem(item.id)}/>
                </Table.Cell>
            </Table.Row>
        ));

        return (
            <Form>
                <Header as={'h3'} textAlign={'center'}>Filtration</Header>
                <Table singleLine striped size='small' color={'red'}>
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
                            <Table.Cell>
                                <Input
                                    name={'t'}
                                    onChange={this.onChangeNewItem}
                                    size={'small'}
                                    step={1}
                                    type={'number'}
                                    value={this.state.newItem.t}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Input
                                    name={'V'}
                                    onChange={this.onChangeNewItem}
                                    size={'small'}
                                    step={0.01}
                                    type={'number'}
                                    value={this.state.newItem.V}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Button icon='add' onClick={this.addItem}/>
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
