import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {IT02Data} from '../defaults';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../shared/simpleTools/helpers';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {mounding} from 'gwflowjs/lib/library';

interface IProps {
    parameters: IT02Data['parameters'];
}

const Info = (props: IProps) => {
    const {L, W, w, hi, Sy, K, t} = getParameterValues(props.parameters);
    const hhi = mounding.calculateHi(0, 0, w, L, W, hi, Sy, K, t);
    const hMax = (hhi + hi);

    return (
        <Message icon info>
            <Icon name='info circle' color='blue'/>
            <Message.Content>
                <p>
                    The resulting groundwater mound is&nbsp;<strong>{hhi.toFixed(2)}&nbsp;m </strong>
                    and the groundwater level will rise up to&nbsp;<strong>{hMax.toFixed(2)}&nbsp;m</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

export default Info;
