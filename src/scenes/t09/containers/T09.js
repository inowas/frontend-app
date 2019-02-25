import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Grid, Header, Icon, Image, Segment, Dimmer, Button} from 'semantic-ui-react';

import image9A from '../images/T09A.png';
import image9B from '../images/T09B.png';
import image9C from '../images/T09C.png';
import image9D from '../images/T09D.png';
import image9E from '../images/T09E.png';
import image9F from '../images/T09F.png';
import AppContainer from '../../shared/AppContainer';

export const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t09-simple-saltwater-intrusion-equations/',
    icon: <Icon name="file"/>
}];

const items = [
    {
        tool: 'T09A',
        name: 'Depth of saltwater interface (Ghyben-Herzberg relation)',
        description: 'With the help of the Ghyben-Herzberg relation, the location of the interface between fresh and saltwater can be approximated under static hydraulic conditions',
        image: image9A
    },
    {
        tool: 'T09B',
        name: 'Freshwater-Saltwater interface (Glover equation)',
        description: 'The Glover equation provides also an indication of the shape and extent of the interface',
        image: image9B
    },
    {
        tool: 'T09C',
        name: 'Saltwater intrusion // Upcoming',
        description: 'Upconing as a function of well pumping can be approximated by the equations developed by Schmork and Mercado, 1969 and Dagan and Bear, 1968',
        image: image9C
    },
    {
        tool: 'T09D',
        name: 'Critical well discharge',
        description: 'Critical well discharge can be calculated by the analytical equation of Strack, 1976',
        image: image9D
    },
    {
        tool: 'T09E',
        name: 'Sea level rise (vertical cliff)',
        description: 'The effects of sea level rise on the migration of saltwater inland can be estimated using Werner and Simmons, 2009, when the coast can be assumed as a vertical cliff',
        image: image9E
    },
    {
        tool: 'T09F',
        name: 'Sea level rise (inclined coast)',
        description: 'The effects of sea level rise on the migration of saltwater inland can be estimated using Chesneaux, 2015 if the coast is inclined',
        image: image9F
    }
];

class T09 extends React.Component {

    redirectTo = (tool) => {
        return this.props.history.push(`/tools/${tool}`)
    };

    state = {};

    handleShow = () => this.setState({ active: true });
    handleHide = () => this.setState({ active: false });

    render() {
        const { active } = this.state;
        const content = (
            <div>
                <Header as='h2' inverted>
                    Title
                </Header>

                <Button primary>Add</Button>
                <Button>View</Button>
            </div>
        );

        const columns = items.map(i => (
            <Grid.Column key={i.tool} onClick={() => this.redirectTo(i.tool)}>
                <Dimmer.Dimmable as={Segment} color={'blue'} style={{cursor:'pointer', marginBottom:'1em'}} padded
                                 dimmed={active}
                                 dimmer={{ active, content }}
                                 onMouseEnter={this.handleShow}
                                 onMouseLeave={this.handleHide}>
                    <Image src={i.image} size={'medium'} floated={'left'} />
                    <Header as={'h2'} color={'blue'} style={{marginTop: 0}}>{i.tool}</Header>
                    <p>{i.name}<br/>{i.description}</p>
                </Dimmer.Dimmable>
            </Grid.Column>
        ));

        return (
            <AppContainer navBarItems={navigation}>
                <Grid columns={2} stretched>
                    {columns}
                </Grid>
            </AppContainer>
        );
    }
}

T09.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(T09);
