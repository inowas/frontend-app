import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Grid, Header} from "semantic-ui-react";

export function calculateXT(i, b, rho_f, rho_s) {
    const frac1 = (i * b * rho_f) / (rho_s - rho_f);
    return ((b * b - frac1 * frac1) * (rho_s - rho_f)) / (2 * i * b);
}

const fetchParameters = (array) => {
    const parameters = {};

    array.forEach(item => {
        parameters[item.id] = item.value
    });

    return parameters;
};

const Info = ({parameters}) => {
    const {b, i, df, ds} = fetchParameters(parameters);
    const xT = calculateXT(i, b, df, ds);
    return (
        <Grid>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row centered>
                <p>
                    Inland extent of the toe of the saltwater interface at the base of the aquifer
                    is <strong>{xT.toFixed(2)} m </strong>.
                </p>
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
