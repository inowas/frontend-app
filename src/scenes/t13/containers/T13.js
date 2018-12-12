import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';

import {AppContainer} from '../../shared';

import image13A from '../images/T13A.png';
import image13B from '../images/T13B.png';
import image13C from '../images/T13C.png';
import image13D from '../images/T13D.png';
import image13E from '../images/T13E.png';

export const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t13-travel-time-through-unconfined-aquifer/',
    icon: <Icon name="file"/>
}];

const items = [
    {
        tool: 'T13A',
        description: 'Aquifer system with one no-flow boundary and one fixed head boundary condition and constant groundwater recharge',
        image: image13A
    },
    {
        tool: 'T13B',
        description: 'Aquifer system with two fixed head boundary conditions, a flow divide within the system and constant groundwater recharge',
        image: image13B
    },
    {
        tool: 'T13C',
        description: 'Aquifer system with two fixed head boundary conditions, a flow divide outside of the system and constant groundwater recharge',
        image: image13C
    },
    {
        tool: 'T13D',
        description: 'Aquifer system with two fixed head boundary conditions, constant groundwater recharge but user is not sure whether the flow divide lies within the system',
        image: image13D
    },
    {
        tool: 'T13E',
        description: 'Aquifer system with one pumping well at constant rate, no groundwater recharge',
        image: image13E
    }
];

class T13 extends React.Component {

    redirectTo = (tool) => {
        return this.props.history.push(`/tools/${tool}`)
    };

    render() {
        const columns = items.map(i => (
            <Grid.Column key={i.tool} onClick={() => this.redirectTo(i.tool)}>
                <Segment color={'grey'} style={{cursor: 'pointer'}}>
                    <Header as={'h2'} textAlign={'center'}>{i.tool}</Header>
                    <p align={'center'}>
                        {i.description}
                    </p>
                    <Image src={i.image} bordered/>
                </Segment>
            </Grid.Column>
        ));

        return (
            <AppContainer navBarItems={navigation}>
                <Header as={'h2'}>
                    Please select the set of boundary conditions that apply to your problem:
                </Header>
                <Grid columns={5} padded>
                    {columns}
                </Grid>
            </AppContainer>
        );
    }
}

T13.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(T13);
