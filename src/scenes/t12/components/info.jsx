import React from 'react';
import PropTypes from 'prop-types';

import {
    calcMFI,
    calculateMFIcor1,
    calculateMFIcor2,
    calculateR2,
    calculateDiagramData
} from '../calculations/calculationT12';

import {getParameterValues} from '../../shared/simpleTools/helpers';
import {Icon, Message} from 'semantic-ui-react';

const renderText = (rSquared, MFIcor2, MFI) => {
    if (rSquared > 0.90) {
        return (
            <Message icon info>
                <Icon name='info circle' color='blue' size='large' />
                <Message.Content>
                    <p>MFI parameter: <strong>{MFI.toFixed(2)} s/l<sup>2</sup></strong></p>
                    <p>The first x points were used for calculating MFI, because a linear trend line
                        with a coefficient of determination R<sup>2</sup> &gt; 0.90 can describe the determined points.
                        The other points were excluded from the calculation, because the resulting trend line including these
                    points has a coefficient of determination R<sup>2</sup>&nbsp;(0.90).</p>
                </Message.Content>
            </Message>
        );
    }
    return (
            <Message icon warning>
                <Icon name='exclamation triangle' color='orange' />
                <Message.Content>
                    <p>
                        You have to control your data input or repeat the measurement,
                        due to low coefficient of determination R<sup>2</sup>&nbsp;({rSquared.toFixed(2)}).
                    </p>
                </Message.Content>
            </Message>
    );

};

const Info = ({corrections, mfiData, parameters}) => {
    const {K} = getParameterValues(parameters);
    const {P, Af, T, D} = getParameterValues(corrections);

    const {MFI, a} = calcMFI(mfiData);
    const diagramData = calculateDiagramData(mfiData, MFI, a);
    const rSquared = calculateR2(diagramData);
    const MFIcor1 = calculateMFIcor1(T, MFI, P, Af);
    const MFIcor2 = calculateMFIcor2(MFIcor1, D, K);

    return (
        renderText(rSquared, MFIcor2, MFI)
    );
};

Info.propTypes = {
    corrections: PropTypes.array.isRequired,
    mfiData: PropTypes.array.isRequired,
    parameters: PropTypes.array.isRequired
};

export default Info;
