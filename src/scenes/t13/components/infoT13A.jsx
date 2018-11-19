import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {calculateTravelTimeT13A} from '../calculations/calculationT13A';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Grid, Header} from 'semantic-ui-react';

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters}) => {
    const {W, K, ne, L, hL, xi, xe} = getParameterValues(parameters);
    const t = calculateTravelTimeT13A(xe, W, K, ne, L, hL, xi);
    return (
        <Grid>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row centered>
                <p style={style.text}>
                    The travel time between initial position and arrival location
                    is <strong>{t.toFixed(1)} days</strong>.
                </p>
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
