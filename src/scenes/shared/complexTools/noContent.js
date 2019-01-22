import React from 'react';
import {Message} from 'semantic-ui-react';

const NoContent = ({message}) => (
    <Message>
        <p>{message}</p>
    </Message>
);

export default NoContent;
