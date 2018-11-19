import React from 'react';
import PropTypes from 'prop-types';
import {calcDQ} from '../calculations/calculationT14D';
import {getParameterValues} from "../../shared/simpleTools/helpers";
import {Grid, Header} from "semantic-ui-react";

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters}) => {
    const {Qw, t, S, T, d, W, Kdash, Bdashdash, Sigma, bdash} = getParameterValues(parameters);
    const lambda = Kdash * W / Bdashdash;
    const deps = S / Sigma;
    const dlam = lambda * d / T;
    const dk = ((Kdash / bdash) * d * d) / T;
    const dQ = calcDQ(d, S, T, t, lambda, Kdash, Bdashdash, Qw, deps, dlam, dk);

    return (
        <Grid>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row centered>
                <p style={style.text}>
                    The calculated river drawdown is <strong>{dQ.toFixed(1)} m³/d</strong>.
                </p>
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Info;
