import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Menu, Segment} from 'semantic-ui-react';

class SubMenuWithContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: props.menuItems[0].id
        }
    }

    render() {
        const {menuItems} = this.props;
        const {selected} = this.state;
        return (
            <Segment color={'grey'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Menu fluid vertical tabular>
                                <Menu.Item>&nbsp;</Menu.Item>
                                {menuItems.map(i =>
                                    <Menu.Item
                                        key={i.id}
                                        active={i.id === selected}
                                        onClick={() => this.setState({selected: i.id})}
                                    >{i.name}</Menu.Item>
                                )}
                                <Menu.Item>&nbsp;</Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {menuItems.filter(i => i.id === selected)[0].component}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

        )
    }
}

SubMenuWithContent.propTypes = {
    menuItems: PropTypes.array.isRequired
};

export default SubMenuWithContent;
