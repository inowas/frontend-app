import React from 'react';
import PropTypes from 'prop-types';
import {Button, Grid, Message, Segment, Table} from 'semantic-ui-react';
import Graph from 'vis-react';
import {CriteriaCollection, Weight, WeightAssignment} from 'core/model/mcda/criteria';

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
    }
};

class MultiInfluence extends React.Component {
    constructor(props) {
        super();

        this.state = {
            edges: props.weightAssignment.weightsCollection.allRelations.map(relation => {
                return {
                    id: relation.id,
                    from: relation.from,
                    to: relation.to,
                    dashes: relation.value === 0
                }
            }),
            nodes: props.criteriaCollection.all.map(criterion => {
                return {
                    id: criterion.id,
                    label: criterion.name
                }
            }),
            editEdgeMode: false,
            selectedEdges: null,
            network: null
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            edges: nextProps.weightAssignment.weightsCollection.allRelations.map(relation => {
                return {
                    id: relation.id,
                    from: relation.from,
                    to: relation.to,
                    dashes: relation.value === 0
                }
            }),
            nodes: nextProps.criteriaCollection.all.map(criterion => {
                return {
                    id: criterion.id,
                    label: criterion.name
                }
            })
        });
    }

    addEdge = (data) => {
        const edges = this.state.edges;
        edges.push({
            id: data.id,
            from: data.from,
            to: data.to
        });
        this.setState({
            edges: edges
        }, this.state.network.redraw());
    };

    changeEdgeType = () => this.setState({
        edges: this.state.edges.map(edge => {
            return {
                ...edge,
                dashes: this.state.selectedEdges.edges.includes(edge.id) ? !edge.dashes : edge.dashes
            }
        })
    }, this.state.network.redraw());

    deleteEdge = () => {
        const edges = this.state.edges.filter(e => !(this.state.selectedEdges.edges.includes(e.id)));
        this.setState({
            edges: edges
        }, this.state.network.redraw());
    };

    onToggleEditMode = () => {
        return this.setState({
            editEdgeMode: !this.state.editEdgeMode
        });
    };

    onClickNode = () => {
        if (this.state.editEdgeMode) {
            this.state.network.addEdgeMode();
        }
    };

    onDeselectEdge = () => this.setState({selectedEdges: null});

    onSelectEdge = (edges) => this.setState({
        selectedEdges: edges
    });

    onSaveEdges = () => {
        const weights = this.props.weightAssignment.weightsCollection.toArray().map(weight => {
            return {
                ...weight,
                relations: this.state.edges.filter(edge => edge.from === weight.criterion.id).map(edge => {
                    return {
                        id: edge.id,
                        to: edge.to,
                        value: edge.dashes ? 0 : 1
                    }
                })
            }
        });
        const weightAssignment = this.props.weightAssignment;

        weights.forEach(w => {
            weightAssignment.weightsCollection.update(Weight.fromObject(w));
        });
        weightAssignment.calculateWeights();

        return this.props.handleChange({
            name: 'weights',
            value: weightAssignment
        });
    };

    setNetworkInstance = nw => this.setState({
        network: nw
    });

    render() {
        const {readOnly} = this.props;
        const weights = this.props.weightAssignment.weightsCollection;

        const graph = {
            nodes: this.state.nodes,
            edges: this.state.edges
        };

        const options = {
            height: '500px',
            interaction: {
                dragNodes: !this.state.editEdgeMode,
                dragView: !this.state.editEdgeMode
            },
            manipulation: {
                enabled: this.state.editEdgeMode,
                addEdge: (data, callback) => {
                    if (data.from !== data.to) {
                        callback(data);
                        this.addEdge(data)
                    }
                }
            },
            nodes: styles.nodes,
            layout: {
                hierarchical: false
            },
            edges: {
                color: '#000000'
            }
        };

        const events = {
            click: this.onClickNode,
            deselectEdge: this.onDeselectEdge,
            selectEdge: this.onSelectEdge
        };

        return (
            <div>
                <Message>
                    <Message.Header>Weight Assignment: Multi-influence factor method</Message.Header>
                    <p>You can perform more of the weight assignment methods and compare the results in the end.</p>
                    <p>If editing mode is not active, you can drag and drop the criteria and move around inside the
                        editor window. To start editing relations, click on the button. If editing mode is active, you
                        can click on a criterion, hold the mouse key and move it to another criterion to set the
                        relation. You can select relations by clicking on the arrows. You can select all incoming and
                        outgoing relations by clicking on a criterion. When there are selected relations, you can delete
                        them or change their effect value with the buttons on the right.</p>
                </Message>

                {weights.length > 0 &&
                <Grid columns={2}>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Influence Editor
                        </Segment>
                        <Segment>
                            <Graph getNetwork={this.setNetworkInstance} graph={graph} options={options} events={events}
                                   style={styles.graph}/>
                        </Segment>
                        {!this.state.editEdgeMode
                            ?
                            <Button fluid disabled={readOnly} onClick={this.onToggleEditMode}>
                                Start Editing
                            </Button>
                            :
                            <Button.Group>
                                <Button onClick={this.onToggleEditMode}>Cancel</Button>
                                <Button onClick={this.onSaveEdges} positive icon='save'/>
                            </Button.Group>
                        }
                        {this.state.selectedEdges && this.state.editEdgeMode &&
                        <Button.Group disabled={readOnly} floated='right'>
                            <Button onClick={this.deleteEdge} negative icon='trash'/>
                            <Button onClick={this.changeEdgeType}>Mayor / Minor</Button>
                        </Button.Group>
                        }
                    </Grid.Column>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Weight Assignment
                        </Segment>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Criteria</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Sum Weight [%]</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {weights.all.map((w, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>{w.criterion.name}</Table.Cell>
                                        <Table.Cell
                                            textAlign='center'>
                                            {(w.value * 100).toFixed(2)}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
                }
            </div>
        );
    }

}

MultiInfluence.propTypes = {
    criteriaCollection: PropTypes.instanceOf(CriteriaCollection).isRequired,
    weightAssignment: PropTypes.instanceOf(WeightAssignment).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default MultiInfluence;