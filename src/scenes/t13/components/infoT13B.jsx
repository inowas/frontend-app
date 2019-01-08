import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {calculateTravelTimeT13B, calculateXwd} from '../calculations';
import {SETTINGS_SELECTED_H0, SETTINGS_SELECTED_HL, SETTINGS_SELECTED_NOTHING} from '../defaults/T13B';

const Info = ({parameters, settings}) => {
    const {W, K, L, hL, h0, ne, xi, xe} = getParameterValues(parameters);
    const {selected} = settings;

    if (selected === SETTINGS_SELECTED_NOTHING) {
        return null;
    }

    const xwd = calculateXwd(L, K, W, hL, h0).toFixed(1);

    let t = 0;
    if (selected === SETTINGS_SELECTED_H0) {
        t = calculateTravelTimeT13B(xe, W, K, ne, (xwd * 1), h0, xi);
    }
    if (selected === SETTINGS_SELECTED_HL) {
        t = calculateTravelTimeT13B(xe, W, K, ne, (L - xwd), hL, xi);
    }

    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    The travel time between initial position and arrival location
                    is <strong>{t.toFixed(1)} days</strong>.
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
