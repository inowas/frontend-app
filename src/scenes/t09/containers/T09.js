import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';

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
        description: 'Depth of saltwater interface (Ghyben-Herzberg relation)',
        image: image9A
    },
    {
        tool: 'T09B',
        description: 'Freshwater-Saltwater interface (Glover equation)',
        image: image9B
    },
    {
        tool: 'T09C',
        description: 'Saltwater intrusion // Upcoming',
        image: image9C
    },
    {
        tool: 'T09D',
        description: 'Critical well discharge',
        image: image9D
    },
    {
        tool: 'T09E',
        description: 'Sea level rise (vertical cliff)',
        image: image9E
    },
    {
        tool: 'T09F',
        description: 'Sea level rise (inclined coast)',
        image: image9F
    }
];

class T09 extends React.Component {

    redirectTo = (tool) => {
        return this.props.history.push(`/tools/${tool}`)
    };

    render() {
        const columns = items.map(i => (
            <Grid.Column key={i.tool}>
                <Segment color='blue' style={{cursor:'pointer', marginBottom:'1em'}} onClick={() => this.redirectTo(i.tool)} padded>
                    <Header as={'a'} color='blue'>{i.tool}</Header>
                    <p>{i.description}</p>
                    <Image size='medium' src={i.image} />
                </Segment>
            </Grid.Column>
        ));

        return (
            <AppContainer navBarItems={navigation}>
                <Grid columns={2} stretched>
                    <Grid.Row>
                        <Header as={'h3'}>
                            Please select the set of boundary conditions that apply to your problem:
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                            {columns}
                    </Grid.Row>
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
