import React, {ReactChild, useEffect, useState} from 'react';
import {Button, Dropdown, Grid, Icon, Message, Popup, Transition} from 'semantic-ui-react';
import {usePrevious} from './simpleTools/helpers/customHooks';

interface IMessage {
    content: string;
    positive?: boolean;
    warning?: boolean;
    icon?: React.ReactNode;
}

interface IProps {
    disableAutoSave?: boolean;
    buttonBack?: boolean;
    buttonImport?: boolean | React.ReactNode;
    buttonSave?: boolean;
    dropdown?: any;
    isDirty?: boolean;
    isError?: boolean;
    isValid?: boolean;
    isVisible?: boolean;
    message?: IMessage;
    onBack?: () => any;
    onUndo?: () => any;
    onSave?: (props?: any) => any;
    onToggleAutoSave?: () => any;
}

enum EState {
    DEFAULT = 'default',
    HAS_BEEN_SAVED = 'hasBeenSaved',
    ERROR = 'error',
    NOT_SAVED = 'notSaved',
    NOT_VALID = 'notValid'
}

const ContentToolBar = (props: IProps) => {
    const fadingTime = 2500;

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [message, setMessage] = useState<IMessage | null>(null);

    const prevIsDirty = usePrevious<boolean>(props.isDirty);

    const canBeSaved = props.isDirty && (props.isValid === undefined || props.isValid) && !props.isError;

    useEffect(() => {
        const isValid = typeof props.isValid === 'boolean' ? props.isValid : true;
        const hasBeenSaved = prevIsDirty === true && props.isDirty === false;
        const error = props.isError;
        const notSaved = props.isDirty;

        let state: EState = EState.DEFAULT;
        if (hasBeenSaved) {
            state = EState.HAS_BEEN_SAVED;
        }
        if (hasBeenSaved) {
            state = EState.HAS_BEEN_SAVED;
        }
        if (error) {
            state = EState.ERROR;
        }
        if (notSaved) {
            state = EState.NOT_SAVED;
        }
        if (!isValid) {
            state = EState.NOT_VALID;
        }

        let cMessage = getMessage(state);

        if (!props.buttonSave && props.isDirty) {
            cMessage = null;
        }

        if (cMessage && props.message) {
            cMessage = props.message;
        }

        if (hasBeenSaved || error || notSaved) {
            setMessage(cMessage);
            setIsVisible(true);
            setTimeout(() => {
                if (cMessage && cMessage.positive) {
                    setIsVisible(false);
                }
            }, 1000);
        }
    }, [props.isValid, props.isDirty, props.isError]);

    const getMessage = (state: EState): IMessage | null => {
        switch (state) {
            case EState.NOT_VALID: {
                return null;
            }
            case EState.NOT_SAVED: {
                return {
                    content: 'Changes not saved!',
                    warning: true,
                    icon: <Icon name="exclamation triangle" className="thinMessageIcon"/>
                };
            }
            case EState.ERROR: {
                return {
                    content: 'Error saving changes!',
                    warning: true,
                    icon: <Icon name="exclamation triangle" className="thinMessageIcon"/>
                };
            }

            case EState.HAS_BEEN_SAVED: {
                return {
                    content: 'Changes saved!',
                    positive: true,
                    icon: <Icon name="check circle" className="thinMessageIcon"/>
                };
            }
            default:
                return null;

        }
    };

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

        if (!!props.onToggleAutoSave) {
            children.push(
                <Popup
                    key="autoSave"
                    content="Toggle Auto Save"
                    position="top right"
                    trigger={
                        <Button
                            icon="clock"
                            positive={!props.disableAutoSave}
                            onClick={props.onToggleAutoSave}
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
                    {message &&
                    <Transition duration={{hide: fadingTime, show: 0}} visible={isVisible}>
                        <Message
                            icon={true}
                            positive={message.positive || false}
                            warning={message.warning || false}
                            className="thinMessage"
                        >
                            {message.content}
                        </Message>
                    </Transition>
                    }
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

export default ContentToolBar;
