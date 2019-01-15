import React from 'react';
import {Button, Input, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {SoilmodelLayer} from 'core/model/modflow/soilmodel';
import {pure} from 'recompose';

const styles = {
    input: {
        border: 0,
        width: 'auto'
    }
};

class ZonesTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            layer: props.layer.toObject()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            layer: nextProps.layer.toObject()
        }));
    }

    onChange = () => this.props.onChange(SoilmodelLayer.fromObject(this.state.layer));

    onLocalChange = id => e => {
        const value = e.target.value;
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zonesCollection.findById(id);
        if (zone) {
            zone[this.props.parameter] = value;
            layer.zonesCollection.update(zone);
            this.setState({
                layer: layer.toObject()
            });
        }
    };

    onSetToDefault = id => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zonesCollection.findById(id);
        zone[this.props.parameter] = null;
        layer.zonesCollection.update(zone);

        this.props.onChange(layer);
    };

    onReorder = (id, order) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);

        const zone = layer.zonesCollection.findById(id);
        layer.zonesCollection = layer.zonesCollection.changeOrder(zone, order);

        if (zone) {
            this.props.onChange(layer);
        }
    };

    render() {
        const {onEdit, parameter, readOnly} = this.props;
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zones = layer.zonesCollection.orderBy('priority', 'desc').all;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Zone</Table.HeaderCell>
                        <Table.HeaderCell>Priority</Table.HeaderCell>
                        <Table.HeaderCell>Value</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {zones.map((zone, key) =>
                        <Table.Row key={key}>
                            <Table.Cell>{zone.name}</Table.Cell>
                            <Table.Cell>{zone.priority}</Table.Cell>
                            <Table.Cell>
                                {zone.priority === 0 &&
                                <div>
                                    <Input
                                        onBlur={this.onChange}
                                        onChange={this.onLocalChange(zone.id)}
                                        style={styles.input}
                                        type='number'
                                        value={Array.isArray(zone[parameter]) ? '' : zone[parameter]}
                                    />
                                    {Array.isArray(zone[parameter]) &&
                                    <span>RASTER</span>
                                    }
                                </div>
                                }
                                {zone.priority > 0 &&
                                <Input
                                    onBlur={this.onChange}
                                    onChange={this.onLocalChange(zone.id)}
                                    style={styles.input}
                                    type='number'
                                    value={zone[parameter] !== null ? zone[parameter] : ''}
                                />
                                }
                            </Table.Cell>
                            <Table.Cell>
                                {zone.priority === 0 &&
                                <Button.Group floated='right' size='small'>
                                    <Button onClick={this.props.onClickUpload}>
                                        Upload Raster
                                    </Button>
                                </Button.Group>
                                }
                                {!readOnly && zone.priority > 0 &&
                                <Button.Group floated='right' size='small'>
                                    <Button
                                        disabled={readOnly || zone[parameter] === null}
                                        icon={'ban'}
                                        onClick={() => this.onSetToDefault(zone.id)}
                                    />
                                    <Button
                                        disabled={readOnly}
                                        icon="pencil"
                                        onClick={() => onEdit(zone.id)}
                                    />
                                    <Button
                                        disabled={readOnly || !(zone.priority < zones.length - 1)}
                                        icon="arrow up"
                                        onClick={() => this.onReorder(zone.id, 'up')}
                                    />
                                    <Button
                                        disabled={readOnly || !(zone.priority > 1)}
                                        icon="arrow down"
                                        onClick={() => this.onReorder(zone.id, 'down')}
                                    />
                                </Button.Group>
                                }
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}

ZonesTable.propTypes = {
    onClickUpload: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    parameter: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    layer: PropTypes.instanceOf(SoilmodelLayer).isRequired
};

export default pure(ZonesTable);