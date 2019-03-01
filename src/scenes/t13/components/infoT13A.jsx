import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {calculateTravelTimeT13A} from '../calculations';

const Info = ({parameters, settings}) => {
    const {W, K, L, hL, ne, xi, xe} = getParameterValues(parameters);
    const t = calculateTravelTimeT13A(xe, W, K, ne, L, hL, xi);

    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    The travel time between initial position and arrival location is <strong>{t.toFixed(1)} days</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired,
};

export default pure(Info);
