import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Message} from 'semantic-ui-react';
import {pure} from 'recompose';

const Info = ({parameters}) => {

    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    No information available right now.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);