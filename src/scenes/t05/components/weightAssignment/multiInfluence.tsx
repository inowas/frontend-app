import { Button, Form, Grid, InputProps, Message, Segment, Table } from 'semantic-ui-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CriteriaCollection, WeightAssignment } from '../../../../core/model/mcda/criteria';
import { IWeightAssignment } from '../../../../core/model/mcda/criteria/WeightAssignment.type';
import Graph, { Edge, Network, Node } from 'react-graph-vis';

const styles = {
  graph: {
    minHeight: '300px',
  },
  nodes: {
    color: {
      background: '#ffffff',
      border: '#000000',
    },
    shadow: true,
    shape: 'box',
    shapeProperties: {
      borderRadius: 0,
    },
  },
};

interface IProps {
  criteriaCollection: CriteriaCollection;
  handleChange: (weightAssignment: WeightAssignment) => any;
  readOnly?: boolean;
  toolName: string;
  weightAssignment: WeightAssignment;
}

const MultiInfluence = (props: IProps) => {
  const [edges, setEdges] = useState<Node[]>([]);
  const [nodes, setNodes] = useState<Edge[]>([]);
  const [editEdgeMode, setEditEdgeMode] = useState<boolean>(false);
  const [selectedEdges, setSelectedEdges] = useState<any>(null);
  const [wa, setWa] = useState<IWeightAssignment>(props.weightAssignment.toObject());
  const [showInfo, setShowInfo] = useState<boolean>(true);

  const network = useRef<Network>();

  useEffect(() => {
    const newEdges = props.weightAssignment.weightsCollection.allRelations.map((relation) => {
      return {
        id: relation.id,
        from: relation.from,
        to: relation.to,
        dashes: relation.value === 0,
      };
    });
    const n = props.weightAssignment.weightsCollection.all.map((weight) => {
      return {
        id: weight.criterion.id,
        label: weight.criterion.name,
      };
    });

    n.push({
      id: 'mcda-main-node',
      label: props.toolName,
    });

    setEdges(newEdges);
    setNodes(n);
    setWa(props.weightAssignment.toObject());
  }, [props.toolName, props.weightAssignment]);

  const handleDismiss = () => setShowInfo(!showInfo);

  const addEdge = (data: Node) => {
    const newEdges = edges;
    newEdges.push({
      id: data.id,
      from: data.from,
      to: data.to,
    });
    setEdges(newEdges);
    network.current.redraw();
  };

  const changeEdgeType = () => {
    if (!selectedEdges) {
      return null;
    }
    setEdges(
      edges.map((edge) => {
        return {
          ...edge,
          dashes: selectedEdges.edges.includes(edge.id) ? !edge.dashes : edge.dashes,
        };
      })
    );
    network.current.redraw();
  };

  const deleteEdge = () => {
    if (!selectedEdges) {
      return null;
    }
    const newEdges = edges.filter((e) => !selectedEdges.edges.includes(e.id));
    setEdges(newEdges);
    network.current.redraw();
  };

  const onToggleEditMode = () => setEditEdgeMode(!editEdgeMode);

  const onClickNode = () => {
    if (editEdgeMode) {
      network.current.addEdgeMode();
    }
  };

  const onDeselectEdge = () => setSelectedEdges(null);

  const onSelectEdge = (e: any) => setSelectedEdges(e);

  const onSaveEdges = () => {
    const weights = props.weightAssignment.weightsCollection.toObject().map((weight) => {
      return {
        ...weight,
        relations: edges
          .filter((edge) => edge.from === weight.criterion.id)
          .map((edge) => {
            return {
              id: edge.id,
              to: edge.to,
              value: edge.dashes ? 0 : 1,
            };
          }),
      };
    });
    const weightAssignment = WeightAssignment.fromObject(wa);

    weights.forEach((w) => {
      weightAssignment.weightsCollection = weightAssignment.weightsCollection.update(w);
    });
    weightAssignment.calculateWeights();

    return props.handleChange(weightAssignment);
  };

  const handleLocalChange = (e: ChangeEvent, { name, value }: InputProps) => {
    if (props.readOnly) {
      return;
    }
    setWa({
      ...wa,
      [name]: value,
    });
  };

  const setNetworkInstance = (nw: Network) => (network.current = nw);

  const { readOnly } = props;
  const weights = props.weightAssignment.weightsCollection;

  const graph = {
    nodes: nodes,
    edges: edges,
  };

  const options = {
    height: '500px',
    interaction: {
      dragNodes: !editEdgeMode,
      dragView: !editEdgeMode,
    },
    manipulation: {
      enabled: editEdgeMode,
      addEdge: (data: any, callback: any) => {
        if (data.from !== data.to) {
          callback(data);
          addEdge(data);
        }
      },
    },
    nodes: styles.nodes,
    layout: {
      improvedLayout: true,
      hierarchical: false,
    },
    edges: {
      color: '#000000',
      smooth: true,
    },
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.18,
        avoidOverlap: 1.5,
      },
      maxVelocity: 146,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 25,
      },
    },
  };

  const events = {
    click: onClickNode,
    deselectEdge: onDeselectEdge,
    selectEdge: onSelectEdge,
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {showInfo && (
        <Message onDismiss={handleDismiss}>
          <Message.Header>Weight Assignment: Multi-Influence Factor</Message.Header>
          <p>
            To activate editing, click on the button below the influence chart. If editing mode is not active, you can
            drag and drop the criteria and move around inside the editor window. If editing mode is active, you can
            click on a criterion, hold the mouse key and move it to another criterion to set the relation. You can
            select relations by clicking on the arrows. You can select all incoming and outgoing relations by clicking
            on a criterion. When there are selected relations, you can delete them or change their effect value with the
            buttons on the right. Do not forget to save changes by clicking on the blue button on the left.
          </p>
          <p>
            There is one more node, than criteria, which describes the whole suitability project itself. You can connect
            criteria with this node, to give information about their influence on the whole project.
          </p>
        </Message>
      )}
      {weights.length > 0 && (
        <Grid columns={2}>
          <Grid.Column>
            <Segment textAlign="center" inverted color="grey" secondary>
              Influence Chart
            </Segment>
            <Segment>
              <Graph
                getNetwork={setNetworkInstance}
                graph={graph}
                options={options}
                events={events}
                style={styles.graph}
              />
            </Segment>
            {!editEdgeMode ? (
              <Button fluid disabled={readOnly} onClick={onToggleEditMode}>
                Start Editing
              </Button>
            ) : (
              <Button.Group>
                <Button onClick={onToggleEditMode}>Cancel</Button>
                <Button onClick={onSaveEdges} positive icon="save" />
              </Button.Group>
            )}
            {selectedEdges && editEdgeMode && (
              <Button.Group disabled={readOnly} floated="right">
                <Button onClick={deleteEdge} negative icon="trash" />
                <Button onClick={changeEdgeType}>Mayor / Minor</Button>
              </Button.Group>
            )}
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" inverted color="grey" secondary>
              Settings
            </Segment>
            <Form>
              <Form.Field>
                <Form.Input
                  fluid
                  onBlur={onSaveEdges}
                  onChange={handleLocalChange}
                  name="name"
                  type="text"
                  label="Name"
                  readOnly={readOnly}
                  value={wa.name}
                />
              </Form.Field>
            </Form>
            <Segment textAlign="center" inverted color="grey" secondary>
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
                {weights.all.map((w, key) => (
                  <Table.Row key={key}>
                    <Table.Cell>{w.criterion.name}</Table.Cell>
                    <Table.Cell textAlign="center">{(w.value * 100).toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      )}
    </div>
  );
};

export default MultiInfluence;