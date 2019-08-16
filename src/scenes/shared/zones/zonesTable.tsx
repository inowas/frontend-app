import React, {ChangeEvent, MouseEvent, useState} from 'react';
import {
    Button,
    ButtonProps, Icon, Input, InputOnChangeData, Label, LabelProps, Popup, Segment, Table
} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import {ILayerParameterZone} from '../../../core/model/gis/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../../core/model/gis/LayerParameterZonesCollection';
import RasterParameter from '../../../core/model/gis/RasterParameter';
import ZonesCollection from '../../../core/model/gis/ZonesCollection';

const styles = {
    input: {
        border: 0,
        width: 'auto'
    }
};

interface IProps {
    onAddRelation: (relation: ILayerParameterZone) => any;
    onChange: (relations: LayerParameterZonesCollection) => any;
    onClickUpload: () => any;
    onRemoveRelation: (relation: ILayerParameterZone) => any;
    parameter: RasterParameter;
    readOnly: boolean;
    relations: LayerParameterZonesCollection;
    zones: ZonesCollection;
}

const zonesTable = (props: IProps) => {
    const [activeRow, setActiveRow] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');
    const relations = props.relations.all;

    const handleChange = () => {
        if (activeValue && activeRow) {
            const relation = props.relations.findById(activeRow);
            if (relation) {
                relation.value = parseFloat(activeValue);
                props.onChange(LayerParameterZonesCollection.fromObject(relations).update(relation));
            }
        }
        setActiveRow(null);
        return setActiveValue('');
    };

    const handleClickUpload = () => null;

    const handleEdit = (id: string) => () => null;

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveRow(name);
        setActiveValue(value);
    };

    const handleReorder = (e: MouseEvent, {order, relation}: ButtonProps) => {
        const reordered = props.relations.changeOrder(relation, order);
        if (reordered) {
            return props.onChange(reordered);
        }
    };

    const handleToggleDefault = (id: string) => {
        const relation = LayerParameterZonesCollection.fromObject(relations).findById(id);
        if (relation) {
            relation.value = props.parameter.defaultValue || 0;
            return props.onChange(
                LayerParameterZonesCollection.fromObject(relations).update(relation)
            );
        }
    };

    const handlePressEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            return handleChange();
        }
    };

    const handleAddRelation = (relation: ILayerParameterZone) => {
        return props.onAddRelation(relation);
    };

    const handleRemoveRelation = (relation: ILayerParameterZone) => {
        return props.onRemoveRelation(relation);
    };

    const handleToggleZone = (e: MouseEvent<HTMLElement>, data: LabelProps) => {
        const relationExists = props.relations.findFirstBy('zoneId', data.value);

        if (relationExists && relationExists.priority === 0) {
            return null;
        }

        if (relationExists) {
            return handleRemoveRelation(relationExists);
        }

        const relation: ILayerParameterZone = {
            id: uuidv4(),
            layerId: relations[0].layerId,
            zoneId: data.value,
            parameter: props.parameter.id,
            value: props.parameter.defaultValue,
            priority: relations.length
        };

        return handleAddRelation(relation);
    };

    const renderDefaultInput = (relation: ILayerParameterZone) => {
        const isArray = relation.value instanceof Array;
        let value = relation.id === activeRow ? activeValue : relation.value;
        if (isArray) {
            value = 'Raster';
        }

        return (
            <Input
                disabled={isArray}
                name={relation.id}
                onBlur={handleChange}
                onChange={handleLocalChange}
                readOnly={props.readOnly}
                style={styles.input}
                type={isArray ? 'text' : 'number'}
                value={value}
                onKeyPress={handlePressEnter}
                icon={
                    <Icon
                        name={isArray ? 'map' : 'map pin'}
                        link={isArray}
                        onClick={isArray ? () => handleToggleDefault(relation.id) : null}
                    />
                }
            />
        );
    };

    const renderRow = (relation: ILayerParameterZone, key: number) => {
        const zone = props.zones.findById(relation.zoneId);

        if (zone) {
            return (
                <Table.Row key={key}>
                    <Table.Cell>{zone.name}</Table.Cell>
                    <Table.Cell>{relation.priority}</Table.Cell>
                    <Table.Cell>
                        {relation.priority === 0 && renderDefaultInput(relation)}
                        {relation.priority > 0 &&
                        <Input
                            name={relation.id}
                            onBlur={handleChange}
                            onChange={handleLocalChange}
                            readOnly={props.readOnly}
                            style={styles.input}
                            type={'number'}
                            value={relation.id === activeRow ? activeValue : relation.value}
                            onKeyPress={handlePressEnter}
                        />
                        }
                    </Table.Cell>
                    <Table.Cell>
                        {relation.priority === 0 &&
                        <Button.Group floated="right" size="small">
                            <Button
                                icon={true}
                                primary={true}
                                onClick={handleClickUpload}
                                disabled={props.readOnly}
                            >
                                <Popup
                                    trigger={<Icon name="upload"/>}
                                    content="Upload Raster"
                                    size="mini"
                                />
                            </Button>
                        </Button.Group>
                        }
                        {!props.readOnly && relation.priority > 0 &&
                        <Button.Group floated="right" size="small">
                            <Button
                                disabled={props.readOnly || !(relation.priority < props.zones.length - 1)}
                                icon={true}
                                relation={relation}
                                order="up"
                                onClick={handleReorder}
                            >
                                <Popup
                                    trigger={<Icon name="arrow up"/>}
                                    content="Move Up"
                                    size="mini"
                                />
                            </Button>
                            <Button
                                disabled={props.readOnly || !(relation.priority > 1)}
                                icon={true}
                                relation={relation}
                                order="down"
                                onClick={handleReorder}
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
        <React.Fragment>
            <Segment>
                {props.zones.all.map((zone, key) => {
                    const relation = props.relations.findFirstBy('zoneId', zone.id);

                    if (!relation || (relation.priority !== 0)) {
                        return (
                            <Label
                                as="a"
                                color={relation ? 'blue' : 'grey'}
                                value={zone.id}
                                onClick={handleToggleZone}
                                key={key}
                            >
                                {zone.name}
                            </Label>
                        );
                    }
                })}
            </Segment>
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
                    {props.relations.orderBy('priority', 'desc').all.map((relation, key) => renderRow(relation, key))}
                </Table.Body>
            </Table>
        </React.Fragment>
    );
};

export default zonesTable;
