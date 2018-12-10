import React from 'react';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import StressperiodsEditor from './stressperiodsEditor';
import GridEditor from './gridEditor';

const menuItems = [
    {id: 'grid', name: 'Spatial discretization'},
    {id: 'stressperiods', name: 'Time discretization'},
];

class Discretization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: menuItems[0].id,
        }
    }

    handleMenuClick = (selected) => {
        this.setState({selected});
    };

    render() {
        const {selected} = this.state;

        return (
            <Segment color={'grey'}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Menu fluid vertical tabular>
                                <Menu.Item>&nbsp;</Menu.Item>
                                {menuItems.map(i => (
                                    <Menu.Item
                                        name={i.name}
                                        key={i.id}
                                        active={i.id === this.state.selected}
                                        onClick={() => this.handleMenuClick(i.id)}
                                    />
                                ))}
                                <Menu.Item>&nbsp;</Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {selected === 'grid' && <GridEditor/>}
                            {selected === 'stressperiods' && <StressperiodsEditor/>}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

        )
    }
}

export default Discretization;
