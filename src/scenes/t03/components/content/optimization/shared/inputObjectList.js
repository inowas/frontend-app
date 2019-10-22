import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Icon, List} from 'semantic-ui-react';
import {OptimizationObjectsCollection} from '../../../../../../core/model/modflow/optimization';

class InputObjectList extends React.Component {

    handleAdd = (e, {name, value}) => {
        const objectsCollection = this.props.objectsInList;
        const objectToAdd = this.props.addableObjects.findById(value);

        if (objectToAdd) {
            objectsCollection.add(objectToAdd);
        }

        return this.props.onChange(
            objectsCollection
        );
    };

    handleRemove = id => {
        const objectsCollection = this.props.objectsInList;
        objectsCollection.remove(id);
        return this.props.onChange(
            objectsCollection
        );
    };

    render() {
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
                    {this.props.label ? <label>{this.props.label}</label> : ''}
                    {this.props.addableObjects && this.props.addableObjects.length > 0 ?
                        <Form.Select
                            disabled={this.props.disabled ? this.props.disabled : false}
                            name={this.props.name}
                            placeholder={this.props.placeholder ? this.props.placeholder : ''}
                            options={
                                this.props.addableObjects.all
                                    .filter(value =>
                                        this.props.objectsInList.all.indexOf(value.id) === -1)
                                    .map((value, index) => {
                                        return {
                                            key: String(index),
                                            text: String(value.name),
                                            value: String(value.id)
                                        };
                                    })
                            }
                            onChange={this.handleAdd}
                        />
                        :
                        <p>No objects</p>
                    }
                </Form.Field>
                {this.props.objectsInList && this.props.objectsInList.length > 0 ?
                    <List divided>
                        {this.props.objectsInList.all.map(object => {
                            return (
                                <List.Item key={object.id}>
                                    <List.Content floated="right">
                                        <Button icon color="red"
                                                style={styles.iconFix}
                                                size="small"
                                                onClick={() => this.handleRemove(object.id)}>
                                            <Icon name="trash"/>
                                        </Button>
                                    </List.Content>
                                    <List.Content
                                        verticalAlign="middle">
                                        {object.name || 'ERROR: OBJECT HAS BEEN DELETED'}
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
    }
}

InputObjectList.propTypes = {
    name: PropTypes.string.isRequired,
    addableObjects: PropTypes.instanceOf(OptimizationObjectsCollection),
    objectsInList: PropTypes.instanceOf(OptimizationObjectsCollection),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default InputObjectList;