import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Grid, Header, Icon, Image, Segment} from "semantic-ui-react";

import image14A from '../images/T14A.png';
import image14B from '../images/T14B.png';
import image14C from '../images/T14C.png';
import image14D from '../images/T14D.png';

import AppContainer from "../../shared/AppContainer";

export const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t14-pumping-induced-river-drawdown/',
    icon: <Icon name="file"/>
}];

const items = [
    {
        tool: 'T14A',
        description: 'Depth of saltwater interface (Ghyben-Herzberg relation)',
        image: image14A
    },
    {
        tool: 'T14B',
        description: 'Freshwater-Saltwater interface (Glover equation)',
        image: image14B
    },
    {
        tool: 'T14C',
        description: 'Saltwater intrusion // Upcoming',
        image: image14C
    },
    {
        tool: 'T14D',
        description: 'Critical well discharge',
        image: image14D
    }
];

class T14 extends React.Component {

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
                <Grid columns={items.length} padded>
                    {columns}
                </Grid>
            </AppContainer>
        );
    }
}

T14.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(T14);
