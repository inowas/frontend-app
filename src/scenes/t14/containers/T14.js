import {Button, Dimmer, Grid, Header, Icon, Image, Segment} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import image14A from '../images/T14A.png';
import image14B from '../images/T14B.png';
import image14C from '../images/T14C.png';
import image14D from '../images/T14D.png';

import AppContainer from '../../shared/AppContainer';

export const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t14-pumping-induced-river-drawdown/',
    icon: <Icon name="file"/>
}];

const items = [
    {
        tool: 'T14A',
        name: 'Fully penetrating stream with no streambed resistance.',
        description: '',
        image: image14A
    },
    {
        tool: 'T14B',
        name: 'Fully penetrating stream with semipervious layer.',
        description: '',
        image: image14B
    },
    {
        tool: 'T14C',
        name: 'Partially penetrating stream with streambed resistance.',
        description: '',
        image: image14C
    },
    {
        tool: 'T14D',
        name: 'Partially penetrating stream in an aquitard overlying a pumped aquifer.',
        description: '',
        image: image14D
    }
];

class T14 extends React.Component {

    redirectTo = (tool) => {
        return this.props.history.push(`/tools/${tool}`)
    };

    state = {
        active: ''
    };

    handleShow = tool => this.setState({active: tool});
    handleHide = () => this.setState({active: ''});

    render() {
        const {active} = this.state;

        const columns = items.map(i => (
            <Grid.Column key={i.tool} onClick={() => this.redirectTo(i.tool)}>
                <Dimmer.Dimmable as={Segment} color={'blue'} style={{cursor: 'pointer', marginBottom: '1em'}} padded
                                 dimmed={active === i.tool}
                                 onMouseEnter={() => this.handleShow(i.tool)}
                                 onMouseLeave={this.handleHide}>
                    <Image src={i.image} size={'medium'} floated={'left'}/>
                    <Header as={'h2'} color={'blue'} style={{marginTop: 0}}>{i.tool}</Header>
                    <p><strong>{i.name}</strong>&nbsp;{i.description}</p>
                    <Dimmer inverted active={active === i.tool}>
                        <Button icon primary size='large' labelPosition='left'>
                            <Icon name='pin' />
                            Select {i.tool}</Button>
                    </Dimmer>
                </Dimmer.Dimmable>
            </Grid.Column>
        ));

        return (
            <AppContainer navbarItems={navigation}>
                <Grid columns={2} stretched padded>
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
