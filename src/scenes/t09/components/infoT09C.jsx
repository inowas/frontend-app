import React from 'react';
import PropTypes from 'prop-types';
import {getParameterValues} from "../../shared/simpleTools/helpers";
import {Grid, Header} from "semantic-ui-react";
import {pure} from 'recompose';

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

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters}) => {
    const {q, k, d, df, ds} = getParameterValues(parameters);
    const z = calculateZ(q, k, d, df, ds);
    const qmax = calculateQ(k, d, df, ds);
    const zCrit = calculateZCrit(d);

    if (Number(z) > Number(zCrit)) {
        return (
            <Grid padded>
                <Grid.Row centered>
                    <Header as='h2'>Warning</Header>
                </Grid.Row>
                <Grid.Row centered>
                    <p style={style.text}>
                        The calculated upconing level of <strong>{z.toFixed(2)} m </strong>
                        is higher than the critical elevation of <strong>{zCrit.toFixed(1)} m</strong>.
                        At the current pumping rate, saltwater might enter the well.
                        We recommend a maximum pumping rate of <strong>{qmax.toFixed(2)} m<sup>3</sup>/d</strong>.
                    </p>
                </Grid.Row>
            </Grid>
        );
    }

    return (
        <Grid padded>
            <Grid.Row centered>
                <Header as='h2'>OK</Header>
            </Grid.Row>
            <Grid.Row>
                <p style={style.text}>
                    The calculated upconing level of <strong>{z.toFixed(2)} m </strong>
                    is lower than the critical elevation of <strong>{zCrit.toFixed(1)} m </strong>
                    so saltwater shouldn't enter the well. However, we recommend a maximum
                    pumping rate of <strong>{qmax.toFixed(2)} m<sup>3</sup>/d</strong>.
                </p>
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
