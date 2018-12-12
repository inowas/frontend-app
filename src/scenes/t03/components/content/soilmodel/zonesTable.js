import React from 'react';
import {Button, Icon, Input, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {ZonesCollection} from 'core/model/modflow/soilmodel';
import {pure} from 'recompose';

class ZonesTable extends React.Component {

    constructor(props) {
        super(props);

        // TODO: ÜBERGIB LAYER!!!!
        this.state = {
            zones: props.zones.toArray()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            zones: nextProps.zones.toArray()
        }));
    }

    render() {
        console.log('STATE', this.state);
        const {onEdit, onRemove, onReorder, parameter, readOnly} = this.props;
        const zones = ZonesCollection.fromObject(this.state.zones).orderBy('priority', 'desc').toObject();

        console.log('RENDER ZONES TABLE', zones);

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
                                <Input value={zone[parameter] ? zone[parameter.name] : 'Default'}/>
                            </Table.Cell>
                            <Table.Cell>
                                {!readOnly && zone.priority > 0 &&
                                <Button.Group>
                                    <Button
                                        disabled={readOnly}
                                        icon
                                        onClick={() => onRemove(zone.id)}
                                    >
                                        <Icon name={'ban'}/>
                                    </Button>
                                    <Button
                                        disabled={readOnly}
                                        icon
                                        onClick={() => onEdit(zone.id)}
                                    >
                                        <Icon name="pencil"/>
                                    </Button>
                                    {zone.priority < zones.length - 1 &&
                                    <Button
                                        disabled={readOnly}
                                        icon
                                        onClick={() => onReorder(zone.id, 'up')}
                                    >
                                        <Icon name="arrow up"/>
                                    </Button>
                                    }
                                    {zone.priority > 1 &&
                                    <Button
                                        disabled={readOnly}
                                        icon
                                        onClick={() => onReorder(zone.id, 'down')}
                                    >
                                        <Icon name="arrow down"/>
                                    </Button>
                                    }
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
    onEdit: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    parameter: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    zones: PropTypes.instanceOf(ZonesCollection)
};

export default pure(ZonesTable);