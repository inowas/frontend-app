import React from 'react';
import Iframe from 'react-iframe';
import {Icon} from 'semantic-ui-react';

import {AppContainer} from '../../shared';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t11-mar-model-selection/',
    icon: <Icon name="file"/>
}];

const t11 = () => (
    <AppContainer navbarItems={navigation}>
        <Iframe
            url={'https://inowas.shinyapps.io/mar_model_selection/'}
            position={'inherit'}
            height={'1300px'}
            width={'100%'}
        />
    </AppContainer>
);

export default t11;
