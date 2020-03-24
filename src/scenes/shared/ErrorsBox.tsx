import moment from 'moment';
import React from 'react';
import {useSelector} from 'react-redux';
import {Header, List, Segment} from 'semantic-ui-react';
import {IMessage} from '../../core/model/messages/Message.type';
import MessagesCollection from '../../core/model/messages/MessagesCollection';
import {IRootReducer} from '../../reducers';

const errorsBox = () => {
    const T03 = useSelector((state: IRootReducer) => state.T03);
    const errors = MessagesCollection.fromObject(T03.messages.filter((m) => m.name === 'error'));

    const renderError = (e: IMessage) => {
        const timeStamp = e.timestamp ? moment.unix(e.timestamp).format('YYYY/MM/DD hh:mm:ss') : 'Unknown';
        return `${timeStamp} at ${e.origin}: ${e.text}`;
    };

    if (errors.length === 0) {
        return null;
    }

    return (
        <Segment color={'red'}>
            <Header>Errors</Header>
            <List>
                {errors.all.map((e, key) => (
                    <List.Item key={key}>
                        {renderError(e)}
                    </List.Item>
                ))}
            </List>
        </Segment>
    );
};

export default errorsBox;
