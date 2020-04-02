import moment from 'moment';
import React from 'react';
import {useSelector} from 'react-redux';
import {Header, List, Segment} from 'semantic-ui-react';
import getConfig from '../../config.default';
import {IMessage} from '../../core/model/messages/Message.type';
import MessagesCollection from '../../core/model/messages/MessagesCollection';
import {IRootReducer} from '../../reducers';

const messageBox = () => {
    const debugging = getConfig().VERSION === 'dev';

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const messages = debugging ?
        MessagesCollection.fromObject(T03.messages) :
        MessagesCollection.fromObject(T03.messages.filter((m) => m.name === 'error'));

    const renderError = (e: IMessage) => {
        const timeStamp = e.timestamp ? moment.unix(e.timestamp).format('YYYY/MM/DD hh:mm:ss') : 'Unknown';
        const text = e.text ? e.text : `[${e.name}, ${e.state}]`;
        return `${timeStamp} at ${e.origin}: ${text}`;
    };

    if (messages.length === 0) {
        return null;
    }

    return (
        <Segment color={'red'}>
            <Header>Messages</Header>
            <List>
                {messages.all.map((e, key) => (
                    <List.Item key={key}>
                        {renderError(e)}
                    </List.Item>
                ))}
            </List>
        </Segment>
    );
};

export default messageBox;
