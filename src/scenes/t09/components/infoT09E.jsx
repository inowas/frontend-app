import React from 'react';
import {getParameterValues} from "../../shared/simpleTools/helpers";
import {Grid, Header} from "semantic-ui-react";
import {calcXtQ0Flux, calcXtQ0Head, dRho, calculateDiagramData} from '../calculations/calculationT09E';
import {pure} from "recompose/index";

const style = {
    text: {
        padding: '0 20px'
    }
};

const Info = ({parameters, settings}) => {
    const {k, z0, l, w, dz, hi, i, df, ds} = getParameterValues(parameters);
    const {method} = settings;

    let data;
    let isValid = true;
    const alpha = dRho(df, ds);

    if (method === 'constHead') {
        const xtQ0Head1 = calcXtQ0Head(k, z0, 0, l, w, hi, alpha);
        const xt = xtQ0Head1[0];
        isValid = xtQ0Head1[3];

        const xtQ0Head2 = calcXtQ0Head(k, z0, dz, l, w, hi - dz, alpha);
        const xtSlr = xtQ0Head2[0]; // slr: after sea level rise

        if (isValid) {
            isValid = xtQ0Head2[3];
        }

        data = calculateDiagramData(xt, z0, xtSlr, z0 + dz, isValid);

        return (
            <Grid padded>
                <Grid.Row centered>
                    <Header as='h2'>Info</Header>
                </Grid.Row>
                <Grid.Row>
                    <p style={style.text}>
                        With a hydraulic gradient i of {-i.toFixed(3)} m/m, the calculated distance of the toe of
                        interface prior sea level rise is {Math.abs(data[1].xt).toFixed(1)} m. The distance of the toe
                        of the interface after sea level rise is {Math.abs(data[2].xt).toFixed(1)} m.
                        Therefore, the toe of the freshwater-saltwater interface will move {(Math.abs(data[2].xt)
                        - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m inland caused by sea level rise.
                    </p>
                </Grid.Row>
            </Grid>
        );
    }

    if (method === 'constFlux') {
        const [xt, xtSlr] = calcXtQ0Flux(k, z0, dz, l, w, i, alpha);
        data = calculateDiagramData(xt, z0, xtSlr, z0 + dz, isValid);

        return (
            <Grid padded>
                <Grid.Row centered>
                    <Header as='h2'>Info</Header>
                </Grid.Row>
                <Grid.Row>
                    <p style={style.text}>
                        With a hydraulic gradient i of {-i.toFixed(3)} m/m, the calculated distance of the toe of
                        interface prior sea level rise is {Math.abs(data[1].xt).toFixed(1)} m. The distance of the
                        toe of the interface after sea level rise is {Math.abs(data[2].xt).toFixed(1)} m.
                        Therefore, the toe of the freshwater-saltwater interface will move {(Math.abs(data[2].xt)
                        - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m
                        inland caused by sea level
                        rise.
                    </p>
                </Grid.Row>
            </Grid>
        )
    }

    return null;
};

export default pure(Info);
