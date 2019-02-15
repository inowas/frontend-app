import React from 'react';
import PropTypes from 'prop-types';
import {Button, Grid, Header, Icon, Input, Message, Radio, Segment, Select, Table} from 'semantic-ui-react';

import {MCDA} from 'core/model/mcda';
import {Criterion, CriteriaCollection} from 'core/model/mcda/criteria';

import Graph from 'vis-react';

const styles = {
    graph: {
        minHeight: '300px'
    },
    nodes: {
        color: {
            background: '#ffffff',
            border: '#000000'
        },
        shadow: true,
        shape: 'box',
        shapeProperties: {
            borderRadius: 0
        }
    },
    link: {
        lineHeight: '0.2em',
        backgroundColor: 'none'
    }
};

class CriteriaEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criteria: props.mcda.criteriaCollection.toArray(),
            network: null,
            showInfo: true
        };
    }

    setNetworkInstance = nw => this.setState({
        network: nw
    });

    componentWillReceiveProps(nextProps) {
        this.setState({
            criteria: nextProps.mcda.criteriaCollection.toArray()
        });
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleAddCriteria = () => {
        const criteriaCollection = CriteriaCollection.fromArray(this.state.criteria);
        criteriaCollection.add(new Criterion());
        return this.handleChange(criteriaCollection);
    };

    handleAddSubCriterion = id => {
        const criterion = new Criterion();
        criterion.parentId = id;
        const criteriaCollection = CriteriaCollection.fromArray(this.state.criteria);
        criteriaCollection.add(criterion);
        return this.handleChange(criteriaCollection);
    };

    handleChange = criteriaCollection => {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        return this.props.handleChange({
            name: 'criteria',
            value: criteriaCollection
        });
    };

    handleClickAhp = () => {
        const mcda = this.props.mcda.toObject();
        mcda.withAhp = !this.props.mcda.withAhp;
        return this.props.handleChange({
            name: 'mcda',
            value: MCDA.fromObject(mcda)
        });
    };

    handleLocalChange = id => (e, {name, value}) => {
        const criteriaCollection = CriteriaCollection.fromArray(this.state.criteria);
        const criterion = criteriaCollection.findById(id);

        if (!criterion) {
            return;
        }

        criterion[name] = value;

        return this.setState({
            criteria: criteriaCollection.update(criterion).toArray()
        });
    };

    handleRemoveCriteria = id => this.handleChange(
        CriteriaCollection.fromArray(this.state.criteria).remove(id).removeBy('parentId', id)
    );

    handleSelectChange = id => (e, {name, value}) => {
        const criteriaCollection = CriteriaCollection.fromArray(this.state.criteria);
        const criterion = criteriaCollection.findById(id);

        if (!criterion) {
            return;
        }

        criterion[name] = value;

        return this.handleChange(criteriaCollection.update(criterion));
    };

    onBlur = () => this.handleChange(
        CriteriaCollection.fromArray(this.state.criteria)
    );

    render() {
        const {mcda, readOnly} = this.props;
        const allCriteria = this.state.criteria;
        let criteria = allCriteria;

        if (mcda.withAhp) {
            criteria = allCriteria.filter(c => !c.parentId);
        }

        const options = {
            height: '500px',
            interaction: {
                dragNodes: true,
                dragView: true
            },
            manipulation: {
                enabled: false
            },
            nodes: styles.nodes,
            layout: {
                hierarchical: {
                    direction: 'UD'
                }
            },
            edges: {
                color: '#000000'
            },
            physics: false
        };

        const graph = {
            nodes: [{id: 0, label: this.props.toolName, level: 0}].concat(allCriteria.map(c => {
                return {
                    id: c.id,
                    label: c.name,
                    level: !c.parentId ? 1 : 2
                };
            })),
            edges: allCriteria.map((c, key) => {
                return {
                    id: key,
                    from: c.parentId || 0,
                    to: c.id
                }
            })
        };

        return (
            <Grid>
                {this.state.showInfo &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Choose your criteria</Message.Header>
                            <p>For managed aquifer recharge (MAR) MCDA you can find information of former scientific
                                works and recommendations for criteria in our database:
                                <Button basic style={styles.link} onClick={this.props.routeTo}>T04</Button>
                                Do not forget to specify, if a criteria is described by continuous or discrete values.
                            </p>
                            <p><b>Analytical Hierarchy Process</b> <i>(Saaty, 1980)</i>: Choose this method, to separate
                                your criteria in main and sub criteria. It is recommended, to use it for large numbers
                                of criteria. You should decide to use this method before adding criteria. </p>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                }
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Segment textAlign='center'>
                            <Header as='h5' icon>
                                <Icon name='sitemap'/>
                                Analytical Hierarchy Process</Header>
                            <Radio
                                checked={mcda.withAhp}
                                onChange={this.handleClickAhp}
                                toggle
                            />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={13}>

                        {this.props.mcda.weightAssignmentsCollection.length > 0 &&
                        <Message
                            content='To change, delete or add criteria, you have to delete all weight assignments first or start
                        a new project.'
                            icon='lock'
                            warning
                        />
                        }

                        {criteria.length > 0 &&
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            {criteria.map((c, key) =>
                                <Table.Body key={key}>
                                    <Table.Row>
                                        <Table.Cell>{key + 1}</Table.Cell>
                                        <Table.Cell>
                                            <Input
                                                name='name'
                                                disabled={readOnly}
                                                value={c.name}
                                                onBlur={this.onBlur}
                                                onChange={this.handleLocalChange(c.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {!mcda.withAhp ?
                                                <Select
                                                    name='type'
                                                    disabled={readOnly}
                                                    value={c.type}
                                                    onChange={this.handleSelectChange(c.id)}
                                                    options={[
                                                        {key: 'discrete', value: 'discrete', text: 'Discrete'},
                                                        {key: 'continuous', value: 'continuous', text: 'Continuous'}
                                                    ]}
                                                /> : <Input type='text' value='Main Criterion' readOnly/>
                                            }
                                        </Table.Cell>
                                        <Table.Cell textAlign='right'>
                                            {!readOnly &&
                                            <Button.Group>
                                                {mcda.withAhp &&
                                                <Button
                                                    positive
                                                    icon='add'
                                                    onClick={() => this.handleAddSubCriterion(c.id)}
                                                />
                                                }
                                                <Button
                                                    negative
                                                    icon='trash'
                                                    onClick={() => this.handleRemoveCriteria(c.id)}
                                                />
                                            </Button.Group>
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                    {mcda.withAhp && allCriteria.filter(cc => cc.parentId === c.id).map((cc, ckey) =>
                                        <Table.Row key={cc.id}>
                                            <Table.Cell>{key + 1}.{ckey + 1}</Table.Cell>
                                            <Table.Cell>
                                                <Input
                                                    name='name'
                                                    disabled={readOnly}
                                                    value={cc.name}
                                                    onBlur={this.onBlur}
                                                    onChange={this.handleLocalChange(cc.id)}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Select
                                                    name='type'
                                                    disabled={readOnly}
                                                    value={cc.type}
                                                    onChange={this.handleSelectChange(cc.id)}
                                                    options={[
                                                        {key: 'discrete', value: 'discrete', text: 'Discrete'},
                                                        {key: 'continuous', value: 'continuous', text: 'Continuous'}
                                                    ]}
                                                />
                                            </Table.Cell>
                                            <Table.Cell textAlign='right'>
                                                {!readOnly &&
                                                <Button.Group>
                                                    <Button
                                                        negative
                                                        icon='trash'
                                                        onClick={() => this.handleRemoveCriteria(cc.id)}
                                                    />
                                                </Button.Group>
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            )}
                        </Table>
                        }
                        {!readOnly &&
                        <Button
                            fluid
                            onClick={this.handleAddCriteria}
                        >
                            Add new {mcda.withAhp ? 'main' : ''} criterion
                        </Button>
                        }
                    </Grid.Column>
                </Grid.Row>
                {mcda.withAhp &&
                <Grid.Row>
                    <Grid.Column with={16}>
                        <Graph
                            getNetwork={this.setNetworkInstance}
                            graph={graph}
                            options={options}
                            style={styles.graph}
                        />
                    </Grid.Column>
                </Grid.Row>
                }
            </Grid>
        );
    }

}

CriteriaEditor.propTypes = {
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    toolName: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default CriteriaEditor;