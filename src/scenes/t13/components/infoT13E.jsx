import {Icon, Message} from 'semantic-ui-react';
import {calculateTravelTimeT13E} from '../calculations';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

const Info = ({parameters}) => {
    const {Qw, ne, hL, h0, xi, x} = getParameterValues(parameters);
    const tMax = calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw);

    if (x >= xi) {
        return (
        <Message icon warning>
            <Icon name='exclamation triangle' color='orange'/>
            <Message.Content>
                <p>Please be aware of the assigned coordinate system. Initial position <strong>x<sub>i</sub></strong> can not be smaller than location of well <strong>x</strong>.</p>
            </Message.Content>
        </Message>
        );
    }

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
