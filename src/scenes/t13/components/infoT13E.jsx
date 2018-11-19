import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {getParameterValues} from "../../shared/simpleTools/helpers";
import {Grid, Header} from 'semantic-ui-react';
import {calculateTravelTimeT13E} from '../calculations';

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters}) => {
    const {Qw, ne, hL, h0, xi, x} = getParameterValues(parameters);
    const tMax = calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw);

    return (
        <Grid padded>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row>
                <p style={style.text}>
                    The travel time between initial position and arrival location
                    is <strong>{tMax.toFixed(1)} days</strong>.
                </p>
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
