import React from 'react';
import PropTypes from 'prop-types';
import {getParameterValues} from "../../shared/simpleTools/helpers";
import {Grid, Header} from 'semantic-ui-react';
import {pure} from 'recompose';
import {calculateTravelTimeT13C, calculateXwd} from '../calculations';

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters}) => {
    const {W, K, L, hL, h0, ne, xi, xe} = getParameterValues(parameters);

    const xwd = calculateXwd(L, K, W, hL, h0);
    const t = calculateTravelTimeT13C(xe, W, K, ne, L + Math.abs(xwd), hL, xi);

    return (
        <Grid padded>
            <Grid.Row centered>
                <Header as='h2'>INFO</Header>
            </Grid.Row>
            <Grid.Row>
                <p style={style.text}>
                    The regional system is divided into the two subdomains on either side of the water divide.<br/>
                    The water divide is located at <strong>{xwd.toFixed(1)} m</strong>.<br/>
                    Note that for this case the departure point x<sub>i</sub> is between |x<sub>wd</sub>| and
                    L+|x<sub>wd</sub>|.
                </p>
            </Grid.Row>
            <Grid.Row>
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
