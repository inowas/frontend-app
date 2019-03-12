import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Menu, Segment} from 'semantic-ui-react';

const styles = {
    customMenuContainer: {
        paddingTop: '0.5em',
        paddingBottom: '0.5em'
    },
    customVertMenu: {
        boxShadow: 'none'
    },
    menuItemGroup: {
        paddingLeft: '0.5em',
        fontSize: '1.07145em'
    },
    menuItemHeader: {
        textTransform: 'uppercase'
    }
};

class ToolNavigation extends React.Component {

    handleItemClick = (e, {route}) => {
        this.props.history.push(route)
    };

    render() {
        const {id} = this.props.match.params;
        const property = this.props.match.params.property || '';
        const path = this.props.match.path;
        const basePath = path.split(':')[0];
        const {navigationItems} = this.props;

        const menuItems = navigationItems.map((itemGroup, itemGroupIdx) => (

                <Menu.Item key={itemGroupIdx} style={styles.menuItemGroup}>
                    <Menu.Header as='h4' style={styles.menuItemHeader}>{itemGroup.header}</Menu.Header>
                    <Menu.Menu>
                        {itemGroup.items.map((i, idx) => (
                            <Menu.Item
                                disabled={!id || i.disabled}
                                key={idx}
                                name={i.name}
                                active={property === i.property}
                                route={basePath + id + '/' + i.property}
                                onClick={this.handleItemClick}
                            >
                                {i.icon}{i.name}
                            </Menu.Item>
                        ))}
                    </Menu.Menu>
                </Menu.Item>
            ));


        return (
            <Segment color={'blue'} style={styles.customMenuContainer}>
                <Menu vertical fluid style={styles.customVertMenu}>
                        {menuItems}
                </Menu>
            </Segment>
        )
    }
}

ToolNavigation.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    navigationItems: PropTypes.array.isRequired
};

export default withRouter(ToolNavigation);
