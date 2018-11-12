import React from 'react';
import PropTypes from 'prop-types';
import * as calc from '../calculations/calculationT09F';
import {getParameterValues} from "../../shared/simpleTools/helpers";
import {Grid, Header} from 'semantic-ui-react';
import {pure} from 'recompose';

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters}) => {
    const {dz, k, z0, l, w, theta, x, df, ds} = getParameterValues(parameters);

    const newXt = calc.calcNewXt({dz, k, z0, l, w, theta, x, df, ds});
    const xt = calc.calcXt({dz, k, z0, l, w, theta, x, df, ds});
    const dxt = calc.calcDeltaXt({dz, k, z0, l, w, theta, x, df, ds});
    const h = calc.calcH({k, l, w, x, df, ds});
    const I = calc.calcI({dz, k, z0, l, w, theta, x, df, ds});

    return (
        <Grid padded>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row>
                <p style={style.text}>
                    The initial toe of the saltwater freshwater interface is
                    located <strong>{xt.toFixed(1)} m</strong> from the inland boundary
                    or <strong>{(l - xt).toFixed(1)} m</strong> from the coast.<br/><br/>
                    Due to sea level rise of <strong>{dz} m</strong>, the toe of the interface will
                    move <strong>{dxt.toFixed(1)} m</strong> inland. The new position of the toe of the interface is
                    thus <strong>{(newXt).toFixed(1)} m</strong> from the inland boundary.<br/><br/>
                    At a distance of <strong>{x} m</strong> from the inland boundary, the initial water table head
                    is <strong>{h.toFixed(1)} m</strong> above sea level and due to sea level rise
                    of <strong>{dz} m</strong>, the water table will rise about <strong>{I.toFixed(2)} m</strong> at
                    that position.
                </p>
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
