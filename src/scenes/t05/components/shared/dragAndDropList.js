import React from 'react';
import PropTypes from 'prop-types';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Button, Segment} from 'semantic-ui-react';

const styles = {
    draggable: {
        background: 'white',
        padding: '10px 0px 10px 0px'
    },
    columnLeft: {
        display: 'inline-block',
        margin: '0px 10px 0px 10px',
        width: '50px'
    },
    column: {
        display: 'inline-block',
        margin: '0px 10px 0px 10px'
    },
    columnRight: {
        display: 'inline-block',
        float: 'right',
        margin: '-5px 0px 0px 0px'
    },
    segment: {
        margin: '10px 0px 10px 0px'
    }
};

class DragAndDropList extends React.Component {

    constructor(props) {
        super();

        this.state = {
            items: props.items
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            items: nextProps.items
        });
    }

    onDragEnd = (e) => {
        const {destination, source, draggableId} = e;

        if(!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const items = this.state.items;
        const movedItem = items.filter(i => i.rank === draggableId)[0];

        if (!movedItem) {
            return;
        }

        items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);

        const newItems = items.map((item, key) => {
            return {
                ...item,
                rank: key
            }
        });

        return this.props.onDragEnd(newItems);
    };

    render() {
        const items = this.state.items.sort((a, b) => a.rank > b.rank);

        if (!items || items.length < 1) {
            return null;
        }

        return (
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
                            {items.map((item, key) =>
                                <Draggable draggableId={item.rank} index={key} key={key}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Segment style={styles.segment}>
                                                <div style={styles.columnLeft}>
                                                    {key+1}
                                                </div>
                                                <div style={styles.column}>
                                                    {item.data}
                                                </div>
                                                <div
                                                    style={styles.columnRight}
                                                >
                                                    <Button.Group size='mini'>
                                                        <Button icon='arrow up' disabled={key === 0}/>
                                                        <Button icon='arrow down' disabled={key === this.props.items.length-1}/>
                                                    </Button.Group>
                                                </div>
                                            </Segment>
                                        </div>
                                    )}
                                </Draggable>
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

DragAndDropList.propTypes = {
    items: PropTypes.array.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default DragAndDropList;