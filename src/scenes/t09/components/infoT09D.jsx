import React from 'react';
import PropTypes from 'prop-types';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Icon, Message} from 'semantic-ui-react';
import {calcLambda, calcMu, calculateQCrit, calcXt} from '../calculations/calculationT09D';
import {pure} from 'recompose';

const Info = ({parameters, settings}) => {
    const {k, b, q, Q, xw, rhof, rhos} = getParameterValues(parameters);
    const {AqType} = settings;

    const lambda = calcLambda(k, b, q, xw, rhof, rhos, AqType);
    const mu = calcMu(lambda);
    const qCrit = calculateQCrit(q, mu, xw);
    const xT = calcXt(k, b, q, Q, xw, rhof, rhos);

    if (Q >= qCrit) {
        return (
            <Message icon>
                <Icon name='exclamation triangle' color='orange' />
                <Message.Content>
                    <p>
                        With the chosen pumping rate of <strong>{Q.toFixed(0)} m³/d</strong>, seawater will intrude
                        about <strong>{xT.toFixed(1)}</strong> m inland, which is
                        higher than the distance from the well to the coast line.<br/>
                        Seawater will most likely intrude the well.<br/>
                        The critical well discharge is <strong>{qCrit.toFixed(0)}</strong> m³/d.<br/>
                        The pumping rate needs to be kept below that threshold so that seawater will not intrude the
                        well.
                    </p>
                </Message.Content>
            </Message>
        );
    }

    return (
        <Message icon>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    With the chosen pumping rate of <strong>{Q.toFixed(0)}</strong> m³/d, seawater will intrude
                    about <strong>{xT.toFixed(1)}</strong> m inland, which is lower than
                    the distance from the well to the coast line and hence no seawater will intrude the well.<br/>
                    The critical well discharge is <strong>{qCrit.toFixed(0)}</strong> m³/d.<br/>
                    The pumping rate needs to be kept below that threshold so that seawater will not intrude the well.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
