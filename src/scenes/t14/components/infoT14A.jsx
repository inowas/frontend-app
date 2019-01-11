import React from 'react';
import PropTypes from 'prop-types';
import {calcDQ} from '../calculations/calculationT14A';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Icon, Message} from 'semantic-ui-react';

const Info = ({parameters}) => {
    const {Qw, d, S, T, t} = getParameterValues(parameters);
    const DQ = calcDQ(Qw, d, S, T, t);
    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    The calculated river drawdown is <strong>{DQ.toFixed(1)} m³/d</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Info;
