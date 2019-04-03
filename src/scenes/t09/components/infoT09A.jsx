import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Message} from 'semantic-ui-react';
import {pure} from 'recompose';
import {getParameterValues} from '../../shared/simpleTools/helpers';

const Info = ({parameters}) => {
    const calculateZ = (h, df, ds) => {
        return (df * h) / (ds - df);
    };
    const {h, df, ds} = getParameterValues(parameters);
    const z = calculateZ(h, df, ds);

    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    Thickness of freshwater below sea level z is <strong>{z.toFixed(1)} m</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);