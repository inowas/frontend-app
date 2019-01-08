import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Icon, Message} from 'semantic-ui-react';
import {calculateTravelTimeT13E} from '../calculations';

const Info = ({parameters}) => {
    const {Qw, ne, hL, h0, xi, x} = getParameterValues(parameters);
    const tMax = calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw);

    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    The travel time between initial position and arrival location
                    is <strong>{tMax.toFixed(1)} days</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
