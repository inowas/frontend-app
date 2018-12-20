import React from 'react';
import PropTypes from 'prop-types';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Button, Segment} from 'semantic-ui-react';
import AbstractCollection from 'core/AbstractCollection';
import {pure} from 'recompose';

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
    onArrowClick = (source, destination) => {
        const items = this.props.items.all;
        const movedItem = items[source];

        items.splice(source, 1);
        items.splice(destination, 0, movedItem);

        const newItems = items.map((item, key) => {
            return {
                ...item,
                rank: key + 1
            }
        });

        return this.props.onChange(AbstractCollection.fromArray(newItems));
    };

    onDragEnd = (e) => {
        const {destination, source, draggableId} = e;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const items = this.props.items.all;
        const movedItem = items.filter(i => i.rank === draggableId)[0];

        if (!movedItem) {
            return;
        }

        items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);

        const newItems = items.map((item, key) => {
            return {
                ...item,
                rank: key + 1
            }
        });

        return this.props.onChange(AbstractCollection.fromArray(newItems));
    };

    render() {
        const items = this.props.items;

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
                            {items.all.map((item, key) =>
                                <Draggable draggableId={item.rank} index={key} key={key}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Segment style={styles.segment}>
                                                <div style={styles.columnLeft}>
                                                    {item.rank}
                                                </div>
                                                <div style={styles.column}>
                                                    {item.data}
                                                </div>
                                                <div
                                                    style={styles.columnRight}
                                                >
                                                    <Button.Group size='mini'>
                                                        {key !== 0 &&
                                                        <Button icon='arrow up'
                                                                onClick={() => this.onArrowClick(key, key-1)}/>
                                                        }
                                                        {key !== this.props.items.length - 1 &&
                                                        <Button icon='arrow down'
                                                                onClick={() => this.onArrowClick(key, key+1)}/>
                                                        }
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
    items: PropTypes.instanceOf(AbstractCollection).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default pure(DragAndDropList);