import React from 'react';
import PropTypes from 'prop-types';
import {calcDQ} from '../calculations/calculationT14A';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Grid, Header} from 'semantic-ui-react';

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters}) => {
    const {Qw, d, S, T, t} = getParameterValues(parameters);
    const DQ = calcDQ(Qw, d, S, T, t);
    return (
        <Grid>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row centered>
                <p style={style.text}>
                    The calculated river drawdown is <strong>{DQ.toFixed(1)} m³/d</strong>.
                </p>
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Info;
