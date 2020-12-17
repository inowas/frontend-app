import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import {IModflowModel} from '../../../../../core/model/modflow/ModflowModel.type';
import {IRootReducer} from '../../../../../reducers';
import {ModflowModel} from '../../../../../core/model/modflow';
import {addMessage, removeMessage, updateMessage, updateModel} from '../../../actions/actions';
import {messageDirty, messageSaving} from '../../../defaults/messages';
import {sendCommand} from '../../../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import GridEditor from './gridEditor';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import React, {useEffect, useRef, useState} from 'react';
import StressperiodsEditor from './stressperiodsEditor';

const Discretization = () => {
    const menuItems = [
        {id: 'grid', name: 'Spatial discretization'},
        {id: 'stressperiods', name: 'Time discretization'}
    ];
    const [model, setModel] = useState<IModflowModel>();
    const [selected, setSelected] = useState<string>(menuItems[0].id);

    const modelRef = useRef<ModflowModel>();
    const editingState = useRef<{ [key: string]: IMessage | null }>({
        dirty: null,
        saving: null
    });

    const dispatch = useDispatch();

    const handleChangeModel = (m: ModflowModel) => {
        modelRef.current = m;
        setModel(m.toObject());
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('discretization')));
        }
    };

    const handleChangeSelected = (id: string) => () => setSelected(id);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const modelFromProps = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const messages = MessagesCollection.fromObject(T03.messages);

    useEffect(() => {
        if (modelFromProps) {
            modelRef.current = modelFromProps;
            setModel(modelFromProps.toObject());
        }
        return function cleanup() {
            handleSave();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        editingState.current = messages.getEditingState('discretization');
    }, [messages]);

    const handleUndo = () => {
        if (!editingState.current.dirty || !modelFromProps) {
            return;
        }
        dispatch(removeMessage(editingState.current.dirty));
        setModel(modelFromProps.toObject());
    };

    const handleSave = () => {
        if (!modelRef.current || !editingState.current.dirty) {
            return;
        }
        const m = modelRef.current;
        const message = messageSaving('discretization');
        dispatch(addMessage(message));
        const command = ModflowModelCommand.updateModflowModelDiscretization(
            m.id,
            m.geometry.toObject(),
            m.boundingBox.toObject(),
            m.gridSize.toObject(),
            m.cells.toObject(),
            m.stressperiods.toObject(),
            m.lengthUnit.toInt(),
            m.timeUnit.toInt(),
            m.rotation,
            m.intersection
        );

        return sendCommand(command, () => {
                if (editingState.current.dirty) {
                    dispatch(removeMessage(editingState.current.dirty));
                }
                dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
                dispatch(updateModel(m));
            }
        );
    };

    const renderDetails = (id: string) => {
        if (!model || !boundaries) {
            return null;
        }

        switch (id) {
            case 'grid': {
                return (
                    <GridEditor
                        model={ModflowModel.fromObject(model)}
                        onChange={handleChangeModel}
                        onSave={handleSave}
                        onUndo={handleUndo}
                    />
                );
            }
            case 'stressperiods': {
                return (
                    <StressperiodsEditor
                        model={ModflowModel.fromObject(model)}
                        boundaries={boundaries}
                        onChange={handleChangeModel}
                        onSave={handleSave}
                        onUndo={handleUndo}
                    />
                );
            }
        }
    };

    return (
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu
                            fluid={true}
                            vertical={true}
                            tabular={true}
                        >
                            <Menu.Item>&nbsp;</Menu.Item>
                            {menuItems.map((i) =>
                                <Menu.Item
                                    key={i.id}
                                    active={i.id === selected}
                                    onClick={handleChangeSelected(i.id)}
                                >
                                    {i.name}
                                </Menu.Item>
                            )}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {renderDetails(selected)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default Discretization;
