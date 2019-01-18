import PropTypes from 'prop-types';
import React from 'react';
import {Criterion, Rule} from 'core/mcda/criteria';
import {Button, Dropdown, Icon, Input, Message, Table} from 'semantic-ui-react';

class CriteriaReclassification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            criterion: props.criterion.toObject(),
            showInfo: true
        }
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleAddRule = () => {
        const criterion = Criterion.fromObject(this.state.criterion);
        const rule = new Rule();
        criterion.rulesCollection.add(rule);
        this.props.onChange(criterion);
    };

    renderEditorContinuous() {
        const {showInfo} = this.state;
        const criterion = this.props.criterion.toObject();

        if (!criterion.rules || criterion.rules.length === 0) {
            return (
                <Message warning>
                    <Message.Header>No data found</Message.Header>
                    <p>You need to upload a raster file before adding reclassification rules.</p>
                </Message>
            )
        }

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Reclassification for continuous values</Message.Header>
                    <p>Min: {criterion.raster.min}</p>
                    <p>Max: {criterion.raster.max}</p>
                </Message>
                }
                <Button primary icon labelPosition='left' onClick={this.handleAddRule}>
                    <Icon name='add' />
                    Add Rule
                </Button>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>From</Table.HeaderCell>
                            <Table.HeaderCell>To</Table.HeaderCell>
                            <Table.HeaderCell>Suitability Index</Table.HeaderCell>
                        </Table.Row>
                        {criterion.rules.map((rule, key) =>
                            <Table.Row key={key}>
                                <Table.Cell>
                                    <Input
                                        disabled={rule.from === criterion.raster.min}
                                        label={<Dropdown
                                            text={rule.fromOperator}
                                            value={rule.fromOperator} labeled>
                                            <Dropdown.Menu>
                                                <Dropdown.Item text='>' value='>'/>
                                                <Dropdown.Item text='>=' value='>='/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        }
                                        labelPosition='left'
                                        placeholder='From'
                                        type='number'
                                        value={rule.from}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        disabled={rule.to === criterion.raster.max}
                                        label={<Dropdown
                                            text={rule.toOperator}
                                            value={rule.toOperator} labeled>
                                            <Dropdown.Menu>
                                                <Dropdown.Item text='<' value='<'/>
                                                <Dropdown.Item text='<=' value='<='/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        }
                                        labelPosition='left'
                                        placeholder='To'
                                        type='number'
                                        value={rule.to}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        label={
                                            <Dropdown
                                                icon={rule.type === 'fixed' ? 'pencil' : 'calculator'}
                                                value={rule.type} labeled className='icon'>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item icon='pencil' text='Suitability index'
                                                                   value='fixed'/>
                                                    <Dropdown.Item icon='calculator' text='Calculation formula'
                                                                   value='calculation'/>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        }
                                        labelPosition='left'
                                        placeholder='To'
                                        type={rule.type === 'fixed' ? 'number' : 'text'}
                                        value={rule.type === 'fixed' ? rule.value : rule.formula}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Header>
                </Table>
            </div>
        )
    }

    renderEditorDiscrete() {

    }

    render() {
        const {criterion} = this.props;

        console.log('CRITERION', criterion);

        if (criterion.type === 'continuous') {
            return this.renderEditorContinuous();
        }

        if (criterion.type === 'discrete') {
            return this.renderEditorDiscrete();
        }
    }
}

CriteriaReclassification.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaReclassification;
