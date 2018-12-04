import React from 'react';
import PropTypes from 'prop-types';
import {
    calcAN,
    calcAH,
    calcAO,
    isCtoHigh
} from '../calculations/calculationT18';

import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Grid, Header} from 'semantic-ui-react';


const renderCoWarning = (CoToHigh) => {
    if (CoToHigh) {
        return (
            <p>
                <i className="glyphicon glyphicon-warning-sign pull-right"/>
                C<sub>o</sub> is too high and a better pre-treatment is necessary.
            </p>
        );
    }

    return (
        <p>
            <i className="glyphicon glyphicon-warning-sign pull-right"/>
            C<sub>o</sub> is within acceptable loading.
        </p>
    );
};
const renderCnWarning = (CnToHigh) => {
    if (CnToHigh) {
        return (
            <p>
                <i className="glyphicon glyphicon-warning-sign pull-right"/>
                C<sub>n</sub> is too high and a better pre-treatment is necessary.
            </p>
        );
    }

    return (
        <p>
            <i className="glyphicon glyphicon-warning-sign pull-right"/>
            C<sub>n</sub> is within acceptable loading.
        </p>
    );
};
const renderText = (AH, AN, AO) => {
    const maxA = Math.max(AH, AN, AO);

    if (maxA === AH) {
        return (
            <p>
                <b>Infiltration rate</b> is defining the estimated field area. <br/>
                The area can be reduced by lowering the flow rate (Q).
            </p>
        );
    }

    if (maxA === AN) {
        return (
            <p>
                <b>Nitrogen loading</b> is defining the estimated field area. <br/>
                The area can be reduced by lowering the flow rate (Q) or by the pre-treatment of infiltration water for the reduction of nitrogen concentration.
            </p>
        );
    }


    return (
        <p>
            <b>BOD loading</b> is defining the estimated field area. <br/>
            The area can be reduced by lowering the flow rate
            (Q) or by the pre-treatment of infiltration water for the reduction of organic matter concentration.
        </p>
    );
};

const Info = ({parameters, settings}) => {
    const {LLRN, LLRO, Q, IR, OD, Cn, Co} = getParameterValues(parameters);
    const {AF} = settings;

    const CoToHigh = isCtoHigh(Co, IR, AF, OD, LLRO);
    const AH = calcAH(Q, IR, AF);
    const AN = calcAN(Cn, IR, AF, OD, LLRN, Q);
    const AO = calcAO(Co, IR, AF, OD, LLRO, Q);

    return (
        <Grid>
            <Grid.Row centered>
                <Header as='h2'>Info</Header>
            </Grid.Row>
            <Grid.Row centered>
                {renderCoWarning(CoToHigh)}
                {renderCnWarning()}
            </Grid.Row>
            <Grid.Row centered>
                <p>The required area calculated based on: </p>
            </Grid.Row>
            <Grid.Row centered>
                <p>
                    Infiltration rate = {AH.toFixed(2)} m<sup>2</sup><br/>
                    BOD loading = {AO.toFixed(2)} m<sup>2</sup><br/>
                    Nitrogen loading = {AN.toFixed(2)} m<sup>2</sup>
                </p>
            </Grid.Row>
            <Grid.Row centered>
                {renderText(AH, AN, AO)}
            </Grid.Row>
        </Grid>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired
};

export default Info;
