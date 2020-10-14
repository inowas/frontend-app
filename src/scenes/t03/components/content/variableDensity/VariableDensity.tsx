import {useEffect} from 'react';
import {useRef} from 'react';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Button, Checkbox, CheckboxProps, Form, Grid, Menu, Message, Segment} from 'semantic-ui-react';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel, Transport, VariableDensity} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {
    addMessage,
    removeMessage,
    updateMessage,
    updateVariableDensity
} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import {messageDirty, messageSaving} from '../../../defaults/messages';

const VariableDensityProperties = () => {
    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const transport = T03.transport ? Transport.fromObject(T03.transport) : null;
    const variableDensity = T03.variableDensity ? VariableDensity.fromObject(T03.variableDensity) : null;
    const messages = MessagesCollection.fromObject(T03.messages);

    const dispatch = useDispatch();
    const {property} = useParams();

    const variableDensityRef = useRef<VariableDensity>();
    const editingState = useRef<{ [key: string]: IMessage | null }>({
        dirty: null,
        saving: null
    });

    useEffect(() => {
        return function cleanup() {
            handleSave();
        };
    }, []);

    useEffect(() => {
        editingState.current = messages.getEditingState(property);
        if (variableDensity) {
            variableDensityRef.current = variableDensity;
        }
    }, [messages, variableDensity]);

    if (!model || !variableDensity || !transport) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const handleSave = () => {
        if (!editingState.current.dirty || !variableDensityRef.current) {
            return;
        }
        const message = messageSaving(property);
        dispatch(addMessage(message));
        return sendCommand(
            Command.updateVariableDensity({
                id: model.id,
                variableDensity: variableDensityRef.current.toObject(),
            }), () => {
                if (editingState.current.dirty) {
                    dispatch(removeMessage(editingState.current.dirty));
                }
                return dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
            }
        );
    };

    const handleChangeViscosity = (e: React.FormEvent<HTMLInputElement>, {name}: CheckboxProps) => {
        const variableDensityObj = variableDensity.toObject();

        if (name) {
            const cVariableDensity = VariableDensity.fromObject({
                ...variableDensityObj,
                vscEnabled: !variableDensityObj.vscEnabled
            });
            dispatch(updateVariableDensity(cVariableDensity));
            if (!editingState.current.dirty) {
                dispatch(addMessage(messageDirty(property)));
            }
        }
    };

    const handleToggleEnabled = () => {
        const cVariableDensity = variableDensity;
        cVariableDensity.vdfEnabled = !cVariableDensity.vdfEnabled;
        dispatch(updateVariableDensity(cVariableDensity));
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty(property)));
        }
    };

    return (
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Menu fluid={true} vertical={true} tabular={true}>
                            <Menu.Item>
                                <Button
                                    disabled={model.readOnly || !transport.enabled}
                                    negative={!variableDensity.vdfEnabled}
                                    positive={variableDensity.vdfEnabled}
                                    icon={variableDensity.vdfEnabled ? 'toggle on' : 'toggle off'}
                                    labelPosition="left"
                                    onClick={handleToggleEnabled}
                                    content={variableDensity.vdfEnabled ? 'Enabled' : 'Disabled'}
                                    style={{marginLeft: '-20px', width: '200px'}}
                                />
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <div>
                            <ContentToolBar
                                buttonSave={true}
                                onSave={handleSave}
                            />
                            <Form style={{marginTop: '1rem'}}>
                                {!transport.enabled &&
                                <Message negative={true}>
                                    <Message.Header>Transport has to be active, to activate SEAWAT.</Message.Header>
                                    <p>Navigate to Model Setup {'>'} Transport, to enable Transport and add a
                                        substance.</p>
                                </Message>
                                }
                                <Form.Field>
                                    <label>Viscosity</label>
                                    <Checkbox
                                        checked={variableDensity.vscEnabled}
                                        onChange={handleChangeViscosity}
                                        name="vscEnabled"
                                        disabled={model.readOnly}
                                    />
                                </Form.Field>
                            </Form>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default VariableDensityProperties;
