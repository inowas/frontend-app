import React from "react";
import PropTypes from "prop-types";
import {Header, Message, Segment, Table, Button} from "semantic-ui-react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

class Ranking extends React.Component {
    constructor(props) {
        super();
        
        props.mcda.addWeightAssignment();

        this.state = {
            criteria: props.mcda.criteria.map(c => c.toObject)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            criteria: nextProps.mcda.criteria.map(c => c.toObject)
        });
    }

    onDragEnd = (e) => {
        console.log('DRAG ENDED', e);
    };

    render() {
        const {readOnly} = this.props;

        return (
            <Segment>
                <Header as='h3'>Weight Assignment</Header>

                <Message>
                    <Message.Header>Method 1: Ranking</Message.Header>
                    <p>You can perform more of the weight assignment methods and compare the results in the end.</p>
                    <p>Ranking: place the criteria in your preferred order by drag and drop or using the arrow buttons
                        on the right.</p>
                </Message>

                {this.state.criteria.length > 0 &&
                <div>
                    <Segment textAlign='center'>
                        Most Important
                    </Segment>
                    <Table>
                        <Table.Body>
                            <DragDropContext
                                onDragEnd={this.onDragEnd}
                            >
                                <Droppable droppableId='droppable-1'>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            style={{backgroundColor: snapshot.isDraggingOver ? 'white' : 'white'}}
                                            {...provided.droppableProps}
                                        >
                                            {this.state.criteria.map((c, key) =>
                                                <Draggable draggableId={c.id} index={key} key={key}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Table.Row>
                                                                <Table.Cell width={2}>{key + 1}</Table.Cell>
                                                                <Table.Cell width={8}>{c.name}</Table.Cell>
                                                                <Table.Cell width={2}>0</Table.Cell>
                                                                <Table.Cell width={4}><Button.Group>
                                                                    <Button icon='arrow up'/>
                                                                    <Button icon='arrow down'/>
                                                                </Button.Group></Table.Cell>
                                                            </Table.Row>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Table.Body>
                    </Table>
                    <Segment textAlign='center'>
                        Least Important
                    </Segment>
                </div>
                }
            </Segment>
        );
    }

}

Ranking.propTypes = {
    mcda: PropTypes.object,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default Ranking;