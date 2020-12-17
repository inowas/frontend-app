import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

export function calculateQ(k, d, df, ds) {
    return (0.6 * Math.PI * d * d * k * dRo(df, ds));
}

export function calculateZCrit(d) {
    return 0.3 * d;
}

export function calculateZ(q, k, d, df, ds) {
    return (q / (2 * Math.PI * d * k * dRo(df, ds)));
}

export function dRo(df, ds) {
    return ((ds - df) / df);
}

const Info = ({parameters}) => {
    const {q, k, d, df, ds} = getParameterValues(parameters);
    const z = calculateZ(q, k, d, df, ds);
    const qmax = calculateQ(k, d, df, ds);
    const zCrit = calculateZCrit(d);

    if (Number(z) > Number(zCrit)) {
        return (
            <Message icon warning>
                <Icon name='exclamation triangle' color='orange'/>
                <Message.Content>
                    <p>The calculated upconing level of <strong>{z.toFixed(2)} m </strong>
                        is higher than the critical elevation of <strong>{zCrit.toFixed(1)} m</strong>.
                        At the current pumping rate, saltwater might enter the well.
                        We recommend a maximum pumping rate of <strong>{qmax.toFixed(2)} m<sup>3</sup>/d</strong>.
                    </p>
                </Message.Content>
            </Message>
        );
    }

    if (df >= ds) {
        return null;
    }

    return (
        <Message icon info>
            <Icon name='info circle' color='blue'/>
            <Message.Content>
                <p>
                    The calculated upconing level of <strong>{z.toFixed(2)} m </strong>
                    is lower than the critical elevation of <strong>{zCrit.toFixed(1)} m </strong>
                    so saltwater shouldn&apos;t enter the well. However, we recommend a maximum
                    pumping rate of <strong>{qmax.toFixed(2)} m<sup>3</sup>/d</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
