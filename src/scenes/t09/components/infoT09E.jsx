import React from 'react';
import PropTypes from 'prop-types';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Icon, Message} from 'semantic-ui-react';
import {calcXtQ0Flux, calcXtQ0Head, dRho, calculateDiagramData} from '../calculations/calculationT09E';
import {pure} from 'recompose';

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
            <Message icon info>
                <Icon name='info circle' color='blue' />
                <Message.Content>
                    <p>
                        With a hydraulic gradient i of <strong>{-i.toFixed(3)} m/m</strong>, the calculated distance of the toe of
                        interface prior sea level rise is <strong>{Math.abs(data[1].xt).toFixed(1)} m</strong>. The distance of the toe
                        of the interface after sea level rise is <strong>{Math.abs(data[2].xt).toFixed(1)} m</strong>.
                        Therefore, the toe of the freshwater-saltwater interface will move <strong>{(Math.abs(data[2].xt)
                        - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m</strong> inland caused by sea level rise.
                    </p>
                </Message.Content>
            </Message>
        );
    }

    if (method === 'constFlux') {
        const [xt, xtSlr] = calcXtQ0Flux(k, z0, dz, l, w, i, alpha);
        data = calculateDiagramData(xt, z0, xtSlr, z0 + dz, isValid);

        return (
            <Message icon info>
                <Icon name='info circle' color='blue' />
                <Message.Content>
                    <p>
                        With a hydraulic gradient i of <strong>{-i.toFixed(3)} m/m</strong>, the calculated distance of the toe of
                        interface prior sea level rise is <strong>{Math.abs(data[1].xt).toFixed(1)} m</strong>. The distance of the
                        toe of the interface after sea level rise is <strong>{Math.abs(data[2].xt).toFixed(1)} m</strong>.
                        Therefore, the toe of the freshwater-saltwater interface will move <strong>{(Math.abs(data[2].xt)
                        - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m</strong>
                        inland caused by sea level
                        rise.
                    </p>
                </Message.Content>
            </Message>
        )
    }

    return null;
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Info);
