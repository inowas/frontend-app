import PropTypes from 'prop-types';
import React from 'react';
import {Criterion} from 'core/model/mcda/criteria';
import {Button, Grid, Icon, Input, Message, Segment, Table} from 'semantic-ui-react';

class CriteriaReclassificationDiscrete extends React.Component {

    constructor(props) {
        super(props);

        const criterion = props.criterion;
        criterion.rulesCollection.orderBy('from');

        this.state = {
            criterion: criterion.toObject(),
            selectedRule: null,
            showInfo: true
        }
    }

    componentWillReceiveProps(nextProps) {
        const criterion = nextProps.criterion;
        criterion.rulesCollection.orderBy('from');

        this.setState({
            criterion: criterion.toObject(),
        });
    }

    handleChange = () => this.props.onChange(Criterion.fromObject(this.state.criterion));

    handleLocalChange = id => (e, {name, value}) => this.setState(prevState => ({
        criterion: {
            ...prevState.criterion,
            rules: prevState.criterion.rules.map(rule => {
                if (rule.id === id) {
                    rule[name] = value;
                }
                return rule;
            })
        }
    }));

    handleClickCalculate = () => {
        const criterion = this.props.criterion;
        criterion.calculateSuitability();
        return this.props.onChange(criterion);
    };

    render() {
        const {criterion, showInfo} = this.state;
        const rules = criterion.rules;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {showInfo &&
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Reclassification for discrete values</Message.Header>
                            <p>All suitabilities, whose raster values are not covered by the rules, will be set with
                                0.</p>
                        </Message>
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Commands
                        </Segment>
                        <Segment>
                            <Button positive icon fluid labelPosition='left' onClick={this.handleClickCalculate}>
                                <Icon name='calculator'/>
                                Calculate Suitability
                            </Button>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Value</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Class</Table.HeaderCell>
                                </Table.Row>
                                {rules.map((rule, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>
                                            {rule.from}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input
                                                name='name'
                                                onBlur={this.handleChange}
                                                onChange={this.handleLocalChange(rule.id)}
                                                type='text'
                                                value={rule.name}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input
                                                name='value'
                                                onBlur={this.handleChange}
                                                onChange={this.handleLocalChange(rule.id)}
                                                type='number'
                                                value={rule.value}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Header>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

CriteriaReclassificationDiscrete.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaReclassificationDiscrete;