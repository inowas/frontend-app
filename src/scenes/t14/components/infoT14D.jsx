import {Icon, Message} from 'semantic-ui-react';
import {calcDQ} from '../calculations/calculationT14D';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import PropTypes from 'prop-types';
import React from 'react';

const Info = ({parameters}) => {
    const {Qw, t, S, T, d, W, Kdash, Bdashdash, Sigma, bdash} = getParameterValues(parameters);
    const lambda = Kdash * W / Bdashdash;
    const deps = S / Sigma;
    const dlam = lambda * d / T;
    const dk = ((Kdash / bdash) * d * d) / T;
    const dQ = calcDQ(d, S, T, t, lambda, Kdash, Bdashdash, Qw, deps, dlam, dk);

    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    The calculated river drawdown is <strong>{dQ.toFixed(1)} m³/d</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Info;
