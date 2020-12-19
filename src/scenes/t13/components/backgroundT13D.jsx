import {calculateXwd} from '../calculations';
import {getParameterValues} from '../../shared/simpleTools/helpers';

import Background from '../../../scenes/shared/Background';
import PropTypes from 'prop-types';
import React from 'react';

import {Container, Header} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import image13B from '../images/T13B.png';
import image13C from '../images/T13C.png';

const tool = (xwd) => {
    if (xwd >= 0) {
        return {
            name: 'Tool 13B',
            image: image13B,
            href: 'T13B'
        };
    }

    return {
        name: 'Tool 13C',
        image: image13C,
        href: 'T13C'
    };
};

const BackgroundT13D = ({parameters, history}) => {

    const {W, K, L, hL, h0} = getParameterValues(parameters);
    const xwd = calculateXwd(L, K, W, hL, h0).toFixed(1);

    return (
        <Container style={{textAlign: 'center'}}>
            <Background
                image={tool(xwd).image}
                title={'T09D. Saltwater intrusion // Critical well discharge'}
                onClick={() => history.push('/tools/' + tool(xwd).href)}
            />
            <Header as={'h4'}>
                The water divide is located at {xwd}m. <br/>
                Proceed with:
                <strong
                    style={{color: '#1EB1ED', cursor: 'pointer', paddingLeft: '0.5em'}}
                    onClick={() => history.push('/tools/' + tool(xwd).href)}
                >
                    {tool(xwd).name}
                </strong>
            </Header>
        </Container>
    )
};

BackgroundT13D.propTypes = {
    history: PropTypes.object.isRequired,
    parameters: PropTypes.array.isRequired,
};

export default withRouter(BackgroundT13D);
