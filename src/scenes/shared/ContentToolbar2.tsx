import React, {ReactChild} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Button, Dropdown, DropdownProps, Grid, Icon, Message, Popup, Transition} from 'semantic-ui-react';
import {EMessageState} from '../../core/model/messages/Message.type';
import MessagesCollection from '../../core/model/messages/MessagesCollection';
import {IRootReducer} from '../../reducers';

interface IProps {
    buttonBack?: boolean;
    buttonImport?: React.ReactNode;
    buttonSave?: boolean;
    dropdown?: DropdownProps;
    onBack?: () => void;
    onSave?: () => void;
    onUndo?: () => void;
}

const contentToolBar = (props: IProps) => {
    const {property} = useParams();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const messages = MessagesCollection.fromObject(T03.messages);
    const editingState = messages.getEditingState(property);

    const fadingTime = 2500;
    const canBeSaved = editingState.dirty && !editingState.saving;

    const renderButtonsRight = () => {
        const children: ReactChild[] = [];

        if (!!props.onUndo) {
            children.push(
                <Popup
                    key="undo"
                    content="Undo changes"
                    position="top right"
                    trigger={
                        <Button
                            icon="undo"
                            negative={true}
                            onClick={props.onUndo}
                            disabled={!canBeSaved}
                        />
                    }
                />
            );
        }

        if (props.buttonSave && !!props.onSave) {
            children.push(
                <Popup
                    key="save"
                    content="Save changes"
                    position="top right"
                    trigger={
                        <Button
                            icon="save"
                            positive={true}
                            onClick={props.onSave}
                            disabled={!canBeSaved}
                        />
                    }
                />
            );
        }

        if (children.length > 1) {
            return (
                <Button.Group children={children}/>
            );
        }
        return children[0];
    };

    const renderMessage = () => {
        if (editingState.saving && editingState.saving.state === EMessageState.IN_PROGRESS) {
            return (
                <Message positive={true} className="thinMessage">Saving...</Message>
            );
        }
        if (editingState.dirty) {
            return (
                <Message warning={true} className="thinMessage">Changes not saved!</Message>
            );
        }
        return (
            <Transition
                duration={{hide: fadingTime, show: 0}}
                visible={!!editingState.saving && editingState.saving.state === EMessageState.SUCCESS}
            >
                <Message positive={true} className="thinMessage">Changes saved.</Message>
            </Transition>
        );
    };

    return (
        <Grid>
            <Grid.Row columns={3}>
                <Grid.Column>
                    {props.buttonBack && !!props.onBack &&
                    <Button icon={true} onClick={props.onBack} labelPosition="left">
                        <Icon name="arrow left"/>
                        Back
                    </Button>
                    }
                    {props.buttonImport}
                </Grid.Column>
                <Grid.Column>
                    {renderMessage()}
                </Grid.Column>
                <Grid.Column textAlign="right">
                    {props.dropdown &&
                    <Dropdown
                        button={true}
                        floating={true}
                        labeled={true}
                        direction="left"
                        name="type"
                        className="icon"
                        text={props.dropdown.text}
                        icon={props.dropdown.icon}
                        options={props.dropdown.options}
                        onChange={props.dropdown.onChange}
                    />
                    }
                    {renderButtonsRight()}
                </Grid.Column>
            </Grid.Row>
        </Grid>

    );
};

export default contentToolBar;
