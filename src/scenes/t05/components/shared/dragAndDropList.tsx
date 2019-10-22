import React, {CSSProperties} from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult
} from 'react-beautiful-dnd';
import {pure} from 'recompose';
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

interface IProps {
    items: any[];
    onChange: (items: any[]) => any;
    readOnly: boolean;
}

const dragAndDropList = (props: IProps) => {
    const handleArrowClick = (source: number, destination: number) => () => {
        if (props.readOnly) {
            return;
        }

        const uItems = props.items;
        const movedItem = uItems[source];

        uItems.splice(source, 1);
        uItems.splice(destination, 0, movedItem);

        const newItems = uItems.map((item: any, key: number) => {
            return {
                ...item,
                rank: key + 1
            };
        });

        return props.onChange(newItems);
    };

    const handleDragEnd = (e: DropResult) => {
        if (props.readOnly) {
            return;
        }
        const {destination, source, draggableId} = e;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const cItems = props.items;
        const movedItem = cItems.filter((i) => i.rank === draggableId)[0];

        if (!movedItem) {
            return;
        }

        cItems.splice(source.index, 1);
        cItems.splice(destination.index, 0, movedItem);

        const newItems = cItems.map((item, key) => {
            return {
                ...item,
                rank: key + 1
            };
        });

        return props.onChange(newItems);
    };

    const items = props.items;

    if (!items || items.length < 1) {
        return null;
    }

    return (
        <DragDropContext
            onDragEnd={handleDragEnd}
        >
            <Droppable droppableId="droppable-1">
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={{backgroundColor: snapshot.isDraggingOver ? 'white' : 'white'}}
                        {...provided.droppableProps}
                    >
                        {items.map((item, key) =>
                            <Draggable
                                draggableId={item.rank}
                                isDragDisabled={props.readOnly}
                                index={key}
                                key={key}
                            >
                                {(dProvided: DraggableProvided) => (
                                    <div
                                        ref={dProvided.innerRef}
                                        {...dProvided.draggableProps}
                                        {...dProvided.dragHandleProps}
                                    >
                                        <Segment style={styles.segment}>
                                            <div style={styles.columnLeft}>
                                                {item.rank}
                                            </div>
                                            <div style={styles.column}>
                                                {item.data}
                                            </div>
                                            <div
                                                style={styles.columnRight as CSSProperties}
                                            >
                                                {!props.readOnly &&
                                                <Button.Group size="mini">
                                                    {key !== 0 &&
                                                    <Button
                                                        icon="arrow up"
                                                        onClick={handleArrowClick(key, key - 1)}
                                                    />
                                                    }
                                                    {key !== props.items.length - 1 &&
                                                    <Button
                                                        icon="arrow down"
                                                        onClick={handleArrowClick(key, key + 1)}
                                                    />
                                                    }
                                                </Button.Group>
                                                }
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
};

export default pure(dragAndDropList);
