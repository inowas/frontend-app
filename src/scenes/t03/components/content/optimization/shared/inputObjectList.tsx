import React, {SyntheticEvent} from 'react';
import {Button, DropdownProps, Form, Icon, List} from 'semantic-ui-react';
import OptimizationObjectsCollection from '../../../../../../core/model/modflow/optimization/ObjectsCollection';

interface IProps {
    name: string;
    addableObjects: OptimizationObjectsCollection;
    objectsInList: OptimizationObjectsCollection;
    label: string;
    placeholder: string;
    disabled: boolean;
    onChange: (objects: OptimizationObjectsCollection) => any;
}

const inputObjectList = (props: IProps) => {

    const handleAdd = (e: SyntheticEvent, {value}: DropdownProps) => {
        if (typeof value === 'string') {
            const objectsCollection = props.objectsInList;
            const objectToAdd = props.addableObjects.findById(value);

            if (objectToAdd) {
                objectsCollection.add(objectToAdd);
            }

            return props.onChange(objectsCollection);
        }
    };

    const handleRemove = (id: string) => {
        const objectsCollection = props.objectsInList;
        objectsCollection.removeById(id);
        return props.onChange(objectsCollection);
    };

    const styles = {
        iconFix: {
            width: 'auto',
            height: 'auto'
        },
        inputFix: {
            padding: '0'
        }
    };

    return (
        <div>
            <Form.Field>
                {props.label ? <label>{props.label}</label> : ''}
                {props.addableObjects && props.addableObjects.length > 0 ?
                    <Form.Select
                        disabled={props.disabled}
                        name={props.name}
                        placeholder={props.placeholder || ''}
                        options={
                            props.addableObjects.all
                                .filter((value) =>
                                    !props.objectsInList.findById(value.id))
                                .map((value, index) => {
                                    return {
                                        key: index,
                                        text: value.meta.name,
                                        value: String(value.id)
                                    };
                                })
                        }
                        onChange={handleAdd}
                    />
                    :
                    <p>No objects</p>
                }
            </Form.Field>
            {props.objectsInList && props.objectsInList.length > 0 ?
                <List divided={true}>
                    {props.objectsInList.all.map((object) => {
                        return (
                            <List.Item key={object.id}>
                                <List.Content floated="right">
                                    <Button
                                        icon={true}
                                        color="red"
                                        style={styles.iconFix}
                                        size="small"
                                        onClick={() => handleRemove(object.id)}
                                    >
                                        <Icon name="trash"/>
                                    </Button>
                                </List.Content>
                                <List.Content
                                    verticalAlign="middle"
                                >
                                    {object.meta.name || 'ERROR: OBJECT HAS BEEN DELETED'}
                                </List.Content>
                            </List.Item>
                        );
                    })
                    }
                </List>
                :
                ''
            }
        </div>
    );
};

export default inputObjectList;
