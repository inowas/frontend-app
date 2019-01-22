import React from 'react';
import PropTypes from 'prop-types';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Icon, Message} from 'semantic-ui-react';
import {pure} from 'recompose';
import {calculateTravelTimeT13C, calculateXwd} from '../calculations';

const Info = ({parameters}) => {
    const {W, K, L, hL, h0, ne, xi, xe} = getParameterValues(parameters);

    const xwd = calculateXwd(L, K, W, hL, h0);
    const t = calculateTravelTimeT13C(xe, W, K, ne, L + Math.abs(xwd), hL, xi);

    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    The regional system is divided into the two subdomains on either side of the water divide.<br/>
                    The water divide is located at <strong>{xwd.toFixed(1)} m</strong>.<br/>
                    Note that for this case the departure point x<sub>i</sub> is between |x<sub>wd</sub>| and
                    L+|x<sub>wd</sub>|.
                </p>
                <p>
                    The travel time between initial position and arrival location
                    is <strong>{t.toFixed(1)} days</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
