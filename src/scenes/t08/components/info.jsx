import React from 'react';
import PropTypes from 'prop-types';
import {Message, Icon} from 'semantic-ui-react';
import {calcC, calcCTau, calculateDL, calculateR, calculateVx} from '../calculations/calculationT08';
import {SETTINGS_CASE_FIXED_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../defaults';
import {getParameterValues} from '../../shared/simpleTools/helpers';

const renderContent = (settings, t, c, x) => {
    if (settings.case === SETTINGS_CASE_FIXED_TIME) {
        return (
            <p>
                After fixed <strong>{t} days</strong> since introduction of constant point source the
                concentration is <strong>{c.toFixed(2)} mg/l</strong> at a distance of <strong>{x} m</strong> from
                constant point
                source.
            </p>
        );
    }

    return (
        <p>
            At a fixed distance of <strong>{x} m</strong> from constant point source the
            concentration is <strong>{c.toFixed(2)} mg/l</strong> after <strong>{t} days</strong> since introduction of
            constant point source.
        </p>
    );
};

const Info = ({parameters, settings}) => {
    const {x, t, C0, tau, K, ne, I, alphaL, Kd} = getParameterValues(parameters);
    const vx = calculateVx(K, ne, I);
    const DL = calculateDL(alphaL, vx);
    const R = calculateR(ne, Kd);
    const C = (settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME && t > tau) ? calcCTau(t, x, vx, R, DL, tau) : calcC(t, x, vx, R, DL);
    const c = C0 * C;

    return (
            <Message icon info>
                <Icon name='info circle' color='blue' />
                    <Message.Content>
                        {renderContent(settings, t, c, x)}
                    </Message.Content>
            </Message>

    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Info;
