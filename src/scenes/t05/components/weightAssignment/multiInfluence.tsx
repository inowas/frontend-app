import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Button, Form, Grid, InputOnChangeData, Message, Segment, Table} from 'semantic-ui-react';
// @ts-ignore
import Graph from 'vis-react';
import {CriteriaCollection, Weight, WeightAssignment} from '../../../../core/model/mcda/criteria';
import {IWeightAssignment} from '../../../../core/model/mcda/criteria/WeightAssignment.type';

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

interface IProps {
    criteriaCollection: CriteriaCollection;
    weightAssignment: WeightAssignment;
    handleChange: (wa: WeightAssignment) => any;
    toolName: string;
    readOnly: boolean;
}

interface IEdge {
    id: string;
    from: string;
    to: string;
    dashes?: boolean;
}

interface INode {
    id: string;
    label: string;
}

const multiInfluence = (props: IProps) => {
    const prepareData = (): {edges: IEdge[], nodes: INode[]} => {
        const cEdges: IEdge[] = props.weightAssignment.weightsCollection.allRelations.map((relation) => {
            return {
                id: relation.id,
                from: '',
                to: relation.to,
                dashes: relation.value === 0
            };
        });
        const cNodes = props.weightAssignment.weightsCollection.all.map((weight) => {
            return {
                id: weight.criterion.id,
                label: weight.criterion.name
            };
        });

        nodes.push({
            id: 'mcda-main-node',
            label: props.toolName
        });

        return {edges: cEdges, nodes: cNodes};
    };

    const data: {edges: IEdge[], nodes: INode[]} = prepareData();
    const [edges, setEdges] = useState<IEdge[]>(data.edges);
    const [nodes, setNodes] = useState<INode[]>(data.nodes);
    const [editEdgeMode, setEditEdgeMode] = useState<boolean>(false);
    const [selectedEdges, setSelectedEdges] = useState<IEdge[] | null>(null);
    const [wa, setWa] = useState<IWeightAssignment>(props.weightAssignment.toObject());
    const [showInfo, setShowInfo] = useState<boolean>(true);

    const network = useRef<any>(null);

    useEffect(() => {
        const cData = prepareData();
        setEdges(cData.edges);
        setNodes(cData.nodes);
        setWa(props.weightAssignment.toObject());
    }, [props.weightAssignment]);

    const handleDismiss = () => setShowInfo(false);

    const addEdge = (cData) => {
        const cEdges = edges;
        cEdges.push({
            id: cData.id,
            from: cData.from,
            to: cData.to
        });

        setEdges(cEdges);
        network.redraw();
    };

    const changeEdgeType = () => {
        setEdges(edges.map((edge) => {
            return {
                ...edge,
                dashes: selectedEdges.includes(edge.id) ? !edge.dashes : edge.dashes
            };
        }));
        network.redraw();
    };

    const deleteEdge = () => {
        const cEdges = edges.filter((e) => !(selectedEdges.includes(e.id)));
        setEdges(cEdges);
        network.redraw();
    };

    const handleToggleEditMode = () => setEditEdgeMode(!editEdgeMode);

    const handleClickNode = () => {
        if (editEdgeMode) {
            network.addEdgeMode();
        }
    };

    const handleDeselectEdge = () => setSelectedEdges(null);

    const handleSelectEdge = (cEdges: IEdge[]) => setSelectedEdges(cEdges);

    const handleSaveEdges = () => {
        const cWeights = props.weightAssignment.weightsCollection.all.map((weight) => {
            return {
                ...weight,
                relations: edges.filter((edge) => edge.from === weight.criterion.id).map((edge) => {
                    return {
                        id: edge.id,
                        to: edge.to,
                        value: edge.dashes ? 0 : 1
                    };
                })
            };
        });
        const weightAssignment = WeightAssignment.fromObject(wa);

        cWeights.forEach((w) => {
            weightAssignment.weightsCollection.update(Weight.fromObject(w));
        });
        weightAssignment.calculateWeights();

        return props.handleChange(weightAssignment);
    };

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return;
        }
        return setWa({
            ...wa,
            [name]: value
        });
    };

    const weights = props.weightAssignment.weightsCollection;

    const graph = {
        nodes,
        edges
    };

    const options = {
        height: '500px',
        interaction: {
            dragNodes: !editEdgeMode,
            dragView: !editEdgeMode
        },
        manipulation: {
            enabled: editEdgeMode,
            addEdge: (cData: IEdge, callback: (e: IEdge) => any) => {
                if (cData.from !== cData.to) {
                    callback(cData);
                    addEdge(cData);
                }
            }
        },
        nodes: styles.nodes,
        layout: {
            improvedLayout: true,
            hierarchical: false
        },
        edges: {
            color: '#000000',
            smooth: true
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18,
                avoidOverlap: 1.5
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {
                enabled: true,
                iterations: 1000,
                updateInterval: 25
            }
        }
    };

    const events = {
        click: handleClickNode,
        deselectEdge: handleDeselectEdge,
        selectEdge: handleSelectEdge
    };

    return (
        <div style={{marginTop: '30px'}}>
            {showInfo &&
            <Message onDismiss={handleDismiss}>
                <Message.Header>Weight Assignment: Multi-Influence Factor</Message.Header>
                <p>
                    To activate editing, click on the button below the influence chart. If editing mode is not
                    active, you can drag and drop the criteria and move around inside the editor window. If editing
                    mode is active, you can click on a criterion, hold the mouse key and move it to another
                    criterion to set the relation. You can select relations by clicking on the arrows. You can
                    select all incoming and outgoing relations by clicking on a criterion. When there are selected
                    relations, you can delete them or change their effect value with the buttons on the right.
                    Do not forget to save changes by clicking on the blue button on the left.
                </p>
                <p>
                    There is one more node, than criteria, which describes the whole suitability project itself. You
                    can connect criteria with this node, to give information about their influence on the whole
                    project.
                </p>
            </Message>
            }
            {weights.length > 0 &&
            <Grid columns={2}>
                <Grid.Column>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Influence Chart
                    </Segment>
                    <Segment>
                        <Graph
                            getNetwork={network}
                            graph={graph}
                            options={options}
                            events={events}
                            style={styles.graph}
                        />
                    </Segment>
                    {!editEdgeMode
                        ?
                        <Button fluid={true} disabled={props.readOnly} onClick={handleToggleEditMode}>
                            Start Editing
                        </Button>
                        :
                        <Button.Group>
                            <Button onClick={handleToggleEditMode}>Cancel</Button>
                            <Button onClick={handleSaveEdges} positive={true} icon="save"/>
                        </Button.Group>
                    }
                    {selectedEdges && editEdgeMode &&
                        <Button.Group disabled={props.readOnly} floated="right">
                        <Button onClick={deleteEdge} negative={true} icon="trash"/>
                        <Button onClick={changeEdgeType}>Mayor / Minor</Button>
                        </Button.Group>
                    }
                </Grid.Column>
                <Grid.Column>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Settings
                    </Segment>
                    <Form>
                        <Form.Field>
                            <Form.Input
                                fluid={true}
                                onBlur={handleSaveEdges}
                                onChange={handleLocalChange}
                                name="name"
                                type="text"
                                label="Name"
                                readOnly={props.readOnly}
                                value={wa.name}
                            />
                        </Form.Field>
                    </Form>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Resulting Weights
                    </Segment>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Criteria</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Sum Weight [%]</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {weights.all.map((w, key) =>
                                <Table.Row key={key}>
                                    <Table.Cell>{w.criterion.name}</Table.Cell>
                                    <Table.Cell
                                        textAlign="center"
                                    >
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
};

export default multiInfluence;
