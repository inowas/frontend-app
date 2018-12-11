import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Icon, List} from 'semantic-ui-react';

// @param: array of objects with parameters id and name
// @return: array of object IDs

class InputObjectList extends React.Component {

    handleAdd = (e, {name, value}) => {
        const objects = this.props.objectsInList.map(i => i);
        objects.push(value);
        return this.props.onChange(
            objects
        );
    };

    handleRemove = id => {
        const objects = this.props.objectsInList;
        return this.props.onChange(
            objects.filter(obj => obj !== id)
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
                                this.props.addableObjects
                                    .filter(value =>
                                        this.props.objectsInList.indexOf(value.id) === -1)
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
                        {this.props.objectsInList.map(id => {
                            const object = this.props.addableObjects.filter(obj => obj.id === id)[0];
                            return (
                                <List.Item key={id}>
                                    <List.Content floated="right">
                                        <Button icon color="red"
                                                style={styles.iconFix}
                                                size="small"
                                                onClick={() => this.handleRemove(id)}>
                                            <Icon name="trash"/>
                                        </Button>
                                    </List.Content>
                                    <List.Content
                                        verticalAlign="middle">
                                        {object ? object.name : 'ERROR: OBJECT HAS BEEN DELETED'}
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
    addableObjects: PropTypes.array,
    objectsInList: PropTypes.array,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default InputObjectList;