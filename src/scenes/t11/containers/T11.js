import React from 'react';
import Iframe from 'react-iframe';
import {Icon} from 'semantic-ui-react';

import {AppContainer} from '../../shared';

const styles = {
    iframe: {
        position: 'inherit',
        height: '1300px'
    }
};

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t11-mar-model-selection/',
    icon: <Icon name="file"/>
}];

export default class T11 extends React.Component {
    render() {
        return (
            <AppContainer navbarItems={navigation}>
                <Iframe styles={styles.iframe} url="https://inowas.shinyapps.io/mar_model_selection/"/>
            </AppContainer>
        );
    }
}
