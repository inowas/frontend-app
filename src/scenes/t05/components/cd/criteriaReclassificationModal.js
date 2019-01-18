import PropTypes from 'prop-types';
import React from 'react';
import {Rule} from 'core/mcda/criteria';
import {Button, Form, List, Message, Modal} from 'semantic-ui-react';

class CriteriaReclassificationModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rule: props.rule.toObject()
        }
    }

    handleLocalChange = (e, {name, value}) => this.setState({
        rule: {
            ...this.state.rule,
            [name]: value
        }
    });

    handleSave = () => {
        this.props.onSave(Rule.fromObject(this.state.rule))
    };

    render() {
        const {rule} = this.state;

        return (
            <Modal size='tiny' open={!!rule} dimmer={'blurring'} onClose={this.props.onClose}>
                <Modal.Header>Edit reclassification rule</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Select
                                fluid
                                label='From operator'
                                options={[
                                    {key: 0, text: '>', value: '>'},
                                    {key: 1, text: '>=', value: '>='}
                                ]}
                                placeholder='Operator'
                                name={'fromOperator'}
                                onChange={this.handleLocalChange}
                                value={rule.fromOperator}
                            />
                            <Form.Input
                                fluid
                                label='From value'
                                name='from'
                                onChange={this.handleLocalChange}
                                type='number'
                                value={rule.from}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Select
                                fluid
                                label='To operator'
                                options={[
                                    {key: 0, text: '<', value: '<'},
                                    {key: 1, text: '<=', value: '<='}
                                ]}
                                placeholder='Operator'
                                name='toOperator'
                                onChange={this.handleLocalChange}
                                value={rule.toOperator}
                            />
                            <Form.Input
                                fluid
                                label='To value'
                                type='number'
                                onChange={this.handleLocalChange}
                                name='to'
                                value={rule.to}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Select
                                fluid
                                label='Rule type'
                                options={[
                                    {key: 0, text: 'Fixed suitability index', value: 'fixed'},
                                    {key: 1, text: 'Calculation formula', value: 'calc'}
                                ]}
                                placeholder='Rule type'
                                name='type'
                                onChange={this.handleLocalChange}
                                value={rule.type}
                            />
                            <Form.Input
                                fluid
                                label='Suitability'
                                icon={rule.type === 'fixed' ? 'pencil' : 'calculator'}
                                iconPosition='left'
                                onChange={this.handleLocalChange}
                                type={rule.type === 'fixed' ? 'number' : 'text'}
                                name={rule.type === 'fixed' ? 'value' : 'formula'}
                                value={rule.type === 'fixed' ? rule.value : rule.formula}
                            />
                        </Form.Group>
                    </Form>
                    {rule.type === 'calc' &&
                        <Message>
                            <Message.Header>Suitability Calculation</Message.Header>
                            <p>
                                To get suitability values out of the raster data, you can use a calculation formula. The
                                following commands are available:
                            </p>
                            <List>
                                <List.Item>value represents the value of the raster cell</List.Item>
                                <List.Item>max represents the biggest value of inside the raster</List.Item>
                                <List.Item>min represents the lowest value of inside the raster</List.Item>
                            </List>
                        </Message>
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.onClose}>Cancel</Button>
                    <Button primary onClick={this.handleSave}>Save</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

CriteriaReclassificationModal.propTypes = {
    rule: PropTypes.instanceOf(Rule).isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};


export default CriteriaReclassificationModal;