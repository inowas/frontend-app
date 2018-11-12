import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {mounding} from 'gwflowjs';
import {Grid, Header} from "semantic-ui-react";
import {getParameterValues} from "../../shared/simpleTools/helpers";

const Info = ({parameters}) => {
    const {L, W, w, hi, Sy, K, t} = getParameterValues(parameters);
    const hhi = mounding.calculateHi(0, 0, w, L, W, hi, Sy, K, t);
    const hMax = (hhi + hi);

    return (
        <Grid>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row centered>
                The resulting groundwater mound is&nbsp;<strong>{hhi.toFixed(2)}m </strong>
                and the groundwater level will rise up to&nbsp;<strong>{hMax.toFixed(2)}m</strong>.
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
