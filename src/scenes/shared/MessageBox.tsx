import {EMessageState, IMessage} from '../../core/model/messages/Message.type';
import {Header, Icon, List, Segment} from 'semantic-ui-react';
import {IRootReducer} from '../../reducers';
import {removeMessage} from '../t03/actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import MessagesCollection from '../../core/model/messages/MessagesCollection';
import React from 'react';
import getConfig from '../../config.default';
import moment from 'moment';

// tslint:disable-next-line:variable-name
const MessageBox = () => {
    const debugging = getConfig().VERSION === 'dev';

    const dispatch = useDispatch();
    const T03 = useSelector((state: IRootReducer) => state.T03);
    const messages = debugging ?
        MessagesCollection.fromObject(T03.messages) :
        MessagesCollection.fromObject(T03.messages.filter((m) => m.name === 'error'));

    const renderError = (e: IMessage) => {
        const timeStamp = e.timestamp ? moment.unix(e.timestamp).format('YYYY/MM/DD hh:mm:ss') : 'Unknown';
        const text = e.text ? e.text : `[${e.name}, ${e.state}]`;
        return `${timeStamp} at ${e.origin}: ${text}`;
    };

    const handleClickRemove = (msg: IMessage) => () => {
        dispatch(removeMessage(msg));
    };

    if (messages.length === 0) {
        return null;
    }

    return (
        <Segment color={'red'}>
            <Header>Messages</Header>
            <List>
                {messages.all.map((m, key) => (
                    <List.Item key={key}>
                        {m.state === EMessageState.ERROR &&
                        <List.Content floated="right">
                            <Icon name="trash" style={{cursor: 'pointer'}} onClick={handleClickRemove(m)}/>
                        </List.Content>
                        }
                        {renderError(m)}
                    </List.Item>
                ))}
            </List>
        </Segment>
    );
};

export default MessageBox;
