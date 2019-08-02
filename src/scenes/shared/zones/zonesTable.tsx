import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Icon, Input, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import {IRasterParameter} from '../../../core/model/zones/RasterParameter.type';
import {ZonesOrderChange} from '../../../core/model/zones/types';
import {IZone} from '../../../core/model/zones/Zone.type';
import ZonesCollection from '../../../core/model/zones/ZonesCollection';

const styles = {
    input: {
        border: 0,
        width: 'auto'
    }
};

interface IProps {
    onClickUpload: () => any;
    onChange: (zones: IZone[]) => any;
    onEdit: (id: string) => any;
    parameter: IRasterParameter;
    readOnly?: boolean;
    zones: IZone[];
}

const zonesTable = (props: IProps) => {
    const [zones, setZones] = useState(props.zones);

    useEffect(() => {
        setZones(props.zones);
    }, [props.zones]);

    const handleChange = () => props.onChange(zones);

    const handleLocalChange = (id: string) => (e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
        const cZones = ZonesCollection.fromArray(zones);
        const zone = cZones.findById(id);
        if (zone && zone.parameters) {
            zone.parameters = zone.parameters.map((p: IRasterParameter) => {
                if (p.name === props.parameter.name) {
                    p.value = parseFloat(value);
                }
                return p;
            });
            cZones.update(zone);
            return setZones(cZones.toArray());
        }
    };

    const handleReorder = (id: string, order: ZonesOrderChange) => {
        const cZones = ZonesCollection.fromArray(zones);
        const zone = cZones.findById(id);
        if (zone) {
            cZones.changeOrder(zone, order);
            return props.onChange(cZones.toArray());
        }
    };

    const handleToggleDefault = (id: string) => {
        const cZones = ZonesCollection.fromArray(zones);
        const zone = cZones.findById(id);
        if (zone) {
            const fParam = zone.parameters.filter((p) => p.name === props.parameter.name);
            if (fParam.length > 0 && fParam[0].value instanceof Array) {
                zone.parameters = zone.parameters.map((p: IRasterParameter) => {
                    if (p.name === props.parameter.name) {
                        p.value = p.defaultValue || 0;
                    }
                    return p;
                });
                cZones.update(zone);
                return props.onChange(cZones.toArray());
            }
        }
    };

    const handleToggleZone = (id: string) => {
        const cZones = ZonesCollection.fromArray(zones);
        const zone = cZones.findById(id);

        if (zone) {
            zone.parameters = zone.parameters.map((p: IRasterParameter) => {
                if (p.name === props.parameter.name) {
                    p.isActive = !p.isActive;
                }
                return p;
            });
            cZones.update(zone);
            return props.onChange(cZones.toArray());
        }
    };

    const handlePressEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            return handleChange();
        }
    };

    const renderRow = (zone: IZone, key: number) => {
        const {onChange, onClickUpload, onEdit, parameter, readOnly} = props;
        const zoneParameters = zone.parameters.filter((p) => p.name === parameter.name);

        if (zoneParameters.length > 0) {
            const zoneParameter = zoneParameters[0];
            const isArray = zoneParameter.value instanceof Array;

            return (
                <Table.Row key={key}>
                    <Table.Cell>{zone.name}</Table.Cell>
                    <Table.Cell>{zone.priority}</Table.Cell>
                    <Table.Cell>
                        {zone.priority === 0 &&
                        <div>
                            <Input
                                disabled={isArray}
                                onBlur={onChange}
                                onChange={handleLocalChange(zone.id)}
                                readOnly={readOnly}
                                style={styles.input}
                                type={isArray ? 'text' : 'number'}
                                value={isArray ? 'Raster' : zoneParameter.value}
                                onKeyPress={handlePressEnter}
                                icon={
                                    <Icon
                                        name={isArray ? 'map' : 'map pin'}
                                        link={isArray}
                                        onClick={isArray ? () => handleToggleDefault(zone.id) : null}
                                    />
                                }
                            />
                        </div>
                        }
                        {zone.priority > 0 &&
                        <Input
                            disabled={!zoneParameter.isActive}
                            onBlur={onChange}
                            onChange={handleLocalChange(zone.id)}
                            readOnly={readOnly}
                            style={styles.input}
                            type={zoneParameter.isActive ? 'number' : 'text'}
                            value={zoneParameter.isActive ? zoneParameter.value : 'Default'}
                            onKeyPress={handlePressEnter}
                            icon={
                                <Popup
                                    trigger={
                                        <Icon
                                            name={zoneParameter.isActive ? 'toggle off' : 'toggle on'}
                                            link={true}
                                            onClick={handleToggleZone(zone.id)}
                                        />
                                    }
                                    content="Default"
                                    size="mini"
                                />
                            }
                        />
                        }
                    </Table.Cell>
                    <Table.Cell>
                        {zone.priority === 0 &&
                        <Button.Group floated="right" size="small">
                            <Button
                                icon={true}
                                primary={true}
                                onClick={onClickUpload}
                                disabled={readOnly}
                            >
                                <Popup
                                    trigger={<Icon name="upload"/>}
                                    content="Upload Raster"
                                    size="mini"
                                />
                            </Button>
                        </Button.Group>
                        }
                        {!readOnly && zone.priority > 0 &&
                        <Button.Group floated="right" size="small">
                            <Button
                                disabled={readOnly}
                                icon={true}
                                onClick={onEdit(zone.id)}
                            >
                                <Popup
                                    trigger={<Icon name="pencil"/>}
                                    content="Edit Zone"
                                    size="mini"
                                />
                            </Button>
                            <Button
                                disabled={readOnly || !(zone.priority < zones.length - 1)}
                                icon={true}
                                onClick={handleReorder(zone.id, 'up')}
                            >
                                <Popup
                                    trigger={<Icon name="arrow up"/>}
                                    content="Move Up"
                                    size="mini"
                                />
                            </Button>
                            <Button
                                disabled={readOnly || !(zone.priority > 1)}
                                icon={true}
                                onClick={handleReorder(zone.id, 'down')}
                            >
                                <Popup
                                    trigger={<Icon name="arrow down"/>}
                                    content="Move Down"
                                    size="mini"
                                />
                            </Button>
                        </Button.Group>
                        }
                    </Table.Cell>
                </Table.Row>
            );
        }
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width={3}>Zone</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Priority</Table.HeaderCell>
                    <Table.HeaderCell width={8}>{props.parameter.title} [{props.parameter.unit}]</Table.HeaderCell>
                    <Table.HeaderCell width={3}/>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {zones.map((zone, key) => renderRow(zone, key))}
            </Table.Body>
        </Table>
    );
};

export default zonesTable;
