import React from 'react';
import {Button, Icon, Input, Popup, Table} from 'semantic-ui-react';
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

    onChange = () => this.props.onChange(SoilmodelLayer.fromObject(this.state.layer, true));

    onLocalChange = id => e => {
        const value = e.target.value;
        const layer = SoilmodelLayer.fromObject(this.state.layer, false);
        const zone = layer.zonesCollection.findById(id);
        if (zone) {
            zone[this.props.parameter.name].value = value;
            layer.zonesCollection.update(zone);
            this.setState({
                layer: layer.toObject()
            });
        }
    };

    onReorder = (id, order) => {
        const layer = SoilmodelLayer.fromObject(this.state.layer);

        const zone = layer.zonesCollection.findById(id);
        layer.zonesCollection = layer.zonesCollection.changeOrder(zone, order);

        if (zone) {
            this.props.onChange(layer);
        }
    };

    onToggleDefault = id => {
        const {parameter} = this.props;
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zonesCollection.findById(id);
        if (zone && zone[parameter.name].isArray()) {
            zone[parameter.name].value = zone[parameter.name].defaultValue || 0;
            layer.zonesCollection.update(zone);
            this.props.onChange(layer);
        }
    };

    onToggleZone = id => {
        const {parameter} = this.props;
        const layer = SoilmodelLayer.fromObject(this.state.layer);
        const zone = layer.zonesCollection.findById(id);
        if (zone) {
            zone[parameter.name].isActive = !zone[parameter.name].isActive;
            layer.zonesCollection.update(zone);
            this.props.onChange(layer);
        }
    };

    renderRow(zone, key) {
        const {onEdit, parameter, readOnly} = this.props;
        const zoneParameter = zone[parameter.name];
        const isArray = zoneParameter.isArray();

        return (
            <Table.Row key={key}>
                <Table.Cell>{zone.name}</Table.Cell>
                <Table.Cell>{zone.priority}</Table.Cell>
                <Table.Cell>
                    {zone.priority === 0 &&
                    <div>
                        <Input
                            disabled={isArray}
                            onBlur={this.onChange}
                            onChange={this.onLocalChange(zone.id)}
                            style={styles.input}
                            type={isArray ? 'text' : 'number'}
                            value={isArray ? 'Raster' : zoneParameter.value}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    this.onChange();
                                }
                            }}
                            icon={
                                <Icon
                                    name={isArray ? 'map' : 'map pin'}
                                    link={isArray}
                                    onClick={isArray ? () => this.onToggleDefault(zone.id) : null}
                                />
                            }
                        />
                    </div>
                    }
                    {zone.priority > 0 &&
                    <Input
                        disabled={!zoneParameter.isActive}
                        onBlur={this.onChange}
                        onChange={this.onLocalChange(zone.id)}
                        style={styles.input}
                        type={zoneParameter.isActive ? 'number' : 'text'}
                        value={zoneParameter.isActive ? zoneParameter.value : 'Default'}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                this.onChange();
                            }
                        }}
                        icon={<Popup
                                trigger={<Icon name={zoneParameter.isActive ? 'toggle off' : 'toggle on'} link
                                               onClick={() => this.onToggleZone(zone.id)}/>}
                                content='Default'
                                size='mini'
                                />
                        }
                    />
                    }
                </Table.Cell>
                <Table.Cell>
                    {zone.priority === 0 &&
                    <Button.Group floated='right' size='small'>
                        <Button icon primary onClick={this.props.onClickUpload}>
                            <Popup
                                trigger={<Icon name="upload"/>}
                                content='Upload Raster'
                                size='mini'
                                />
                        </Button>
                    </Button.Group>
                    }
                    {!readOnly && zone.priority > 0 &&
                    <Button.Group floated='right' size='small'>
                        <Button
                            disabled={readOnly}
                            icon
                            onClick={() => onEdit(zone.id)}
                        >
                            <Popup
                                trigger={<Icon name="pencil"/>}
                                content='Edit Zone'
                                size='mini'
                                />
                        </Button>
                        <Button
                            disabled={readOnly || !(zone.priority < this.state.layer._meta.zones.length - 1)}
                            icon
                            onClick={() => this.onReorder(zone.id, 'up')}
                        >
                            <Popup
                                trigger={<Icon name="arrow up"/>}
                                content='Move Up'
                                size='mini'
                            />
                        </Button>
                        <Button
                            disabled={readOnly || !(zone.priority > 1)}
                            icon
                            onClick={() => this.onReorder(zone.id, 'down')}
                        >
                            <Popup
                                trigger={<Icon name="arrow down"/>}
                                content='Move Down'
                                size='mini'
                            />
                        </Button>
                    </Button.Group>
                    }
                </Table.Cell>
            </Table.Row>
        );
    }


    render() {
        const {parameter} = this.props;
        const layer = SoilmodelLayer.fromObject(this.state.layer, false);
        const zones = layer.zonesCollection.orderBy('priority', 'desc').all;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Zone</Table.HeaderCell>
                        <Table.HeaderCell>Priority</Table.HeaderCell>
                        <Table.HeaderCell>{parameter.description} [{parameter.unit}]</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {zones.map((zone, key) => this.renderRow(zone, key))}
                </Table.Body>
            </Table>
        );
    }
}

ZonesTable.propTypes = {
    onClickUpload: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    parameter: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    layer: PropTypes.instanceOf(SoilmodelLayer).isRequired
};

export default pure(ZonesTable);