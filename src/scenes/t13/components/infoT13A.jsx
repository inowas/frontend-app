import {Icon, Message} from 'semantic-ui-react';
import {calculateTravelTimeT13A} from '../calculations';
import {getParameterValues} from '../../shared/simpleTools/helpers';

import PropTypes from 'prop-types';
import React from 'react';

const Info = ({parameters}) => {
    const {W, K, ne, L, hL, xi, xe} = getParameterValues(parameters);
    const t = calculateTravelTimeT13A(xe, W, K, ne, L, hL, xi);
    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <p>
                The travel time between initial position and arrival location
                is <strong>{t.toFixed(1)} days</strong>.
            </p>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Info;
