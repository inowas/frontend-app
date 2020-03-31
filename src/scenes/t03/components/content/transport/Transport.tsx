import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Button, Grid, Menu, Segment} from 'semantic-ui-react';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Substance, Transport} from '../../../../../core/model/modflow/transport';
import {ISubstance} from '../../../../../core/model/modflow/transport/Substance.type';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {addMessage, removeMessage, updateMessage, updateTransport} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import {messageDirty, messageError, messageSaving} from '../../../defaults/messages';
import SubstanceDetails from './SubstanceDetails';
import SubstanceList from './SubstanceList';

const transport = () => {
    const [selectedSubstance, setSelectedSubstance] = useState<ISubstance | null>(null);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const transportInstance = T03.transport ? Transport.fromObject(T03.transport) : null;
    const messages = MessagesCollection.fromObject(T03.messages);

    const dispatch = useDispatch();
    const {property} = useParams();

    const transportRef = useRef<Transport>();
    const editingState = useRef<{ [key: string]: IMessage | null }>({
        dirty: null,
        saving: null
    });

    if (!boundaries || !model || !transportInstance) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    useEffect(() => {
        if (!selectedSubstance && transportInstance.substances.length > 0) {
            handleSubstanceListClick(transportInstance.substances.first.id);
        }
        return function cleanup() {
            handleSave();
        };
    }, []);

    useEffect(() => {
        editingState.current = messages.getEditingState(property);
        if (transportInstance) {
            transportRef.current = transportInstance;
        }
    }, [messages, transportInstance]);

    useEffect(() => {
        if (!selectedSubstance && transportInstance.substances.length > 0) {
            handleSubstanceListClick(transportInstance.substances.first.id);
        }
    }, [transportInstance]);

    const handleAddSubstance = () => {
        const substance = Substance.create('new substance');
        const cTransport = transportInstance;
        cTransport.addSubstance(substance);
        cTransport.enabled = true;
        dispatch(updateTransport(cTransport));
        setSelectedSubstance(substance);
    };

    const handleSubstanceListClick = (id: string) => {
        const substance = transportInstance.substances.findById(id);
        setSelectedSubstance(substance || null);
    };

    const handleRemoveSubstance = (id: string) => {
        const cTransport = transportInstance;
        cTransport.removeSubstanceById(id);
        dispatch(updateTransport(cTransport));
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty(property)));
        }

        if (cTransport.substances.length === 0) {
            return setSelectedSubstance(null);
        }
        setSelectedSubstance(cTransport.substances.first);
    };

    const handleChangeSubstance = (substance: Substance) => {
        const cTransport = transportInstance;
        cTransport.updateSubstance(substance);
        dispatch(updateTransport(cTransport));
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty(property)));
        }
        setSelectedSubstance(substance.toObject());
    };

    const handleToggleEnabled = () => {
        const cTransport = transportInstance;
        cTransport.enabled = !cTransport.enabled;
        dispatch(updateTransport(cTransport));
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty(property)));
        }
    };

    const handleSave = () => {
        if (!editingState.current.dirty || !transportRef.current) {
            return;
        }
        const message = messageSaving(property);
        dispatch(addMessage(message));
        return sendCommand(
            Command.updateTransport({
                id: model.id,
                transport: transportRef.current.toObject(),
            }), () => {
                // TODO: Recalculate MT-Package
                if (editingState.current.dirty) {
                    dispatch(removeMessage(editingState.current.dirty));
                }
                return dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
            }, (e) => dispatch(addMessage(messageError(property, e)))
        );
    };

    return (
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Menu fluid={true} vertical={true} tabular={true}>
                            <Menu.Item>
                                <Button
                                    disabled={model.readOnly}
                                    negative={!transportInstance.enabled}
                                    positive={transportInstance.enabled}
                                    icon={transportInstance.enabled ? 'toggle on' : 'toggle off'}
                                    labelPosition="left"
                                    onClick={handleToggleEnabled}
                                    content={transportInstance.enabled ? 'Enabled' : 'Disabled'}
                                    style={{marginLeft: '-20px', width: '200px'}}
                                />
                            </Menu.Item>
                            <SubstanceList
                                addSubstance={handleAddSubstance}
                                onClick={handleSubstanceListClick}
                                onRemove={handleRemoveSubstance}
                                selected={selectedSubstance ? selectedSubstance.id : undefined}
                                substances={transportInstance.substances}
                                readOnly={model.readOnly}
                            />
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <div>
                            <ContentToolBar
                                buttonSave={true}
                                onSave={handleSave}
                            />
                            <SubstanceDetails
                                substance={selectedSubstance ? Substance.fromObject(selectedSubstance) : undefined}
                                boundaries={boundaries}
                                onChange={handleChangeSubstance}
                                readOnly={model.readOnly}
                                stressperiods={model.stressperiods}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default transport;
