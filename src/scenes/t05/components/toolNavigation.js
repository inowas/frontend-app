import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Icon, Menu, Popup, Segment} from 'semantic-ui-react';

class ToolNavigation extends React.Component {

    handleItemClick = (e, {route}) => {
        this.props.history.push(route)
    };

    render() {
        const {id} = this.props.match.params;
        const {property, type} = this.props.match.params || '';
        const path = this.props.match.path;
        const basePath = path.split(':')[0];
        const {navigationItems} = this.props;

        const menuItems = navigationItems.map((i, idx) => (
            <Menu.Item
                disabled={i.status === 'warning'}
                key={idx}
                active={property === i.property}
                route={basePath + id + '/' + i.property}
                onClick={property !== i.property ? this.handleItemClick : null}
            >
                {i.status === 'success' &&
                <Icon name='check circle' color='green'/>
                }
                {i.msg && i.status === 'warning' &&
                <Popup
                    trigger={<Icon name='exclamation circle' color='yellow'/>}
                    content='At least two criteria are needed for weight assignment.'
                />
                }
                {i.name}
                {i.subItems && i.subItems.length > 0 && property === i.property &&
                <Menu.Menu>
                    {i.subItems.map((s, sdx) =>
                        <Menu.Item
                            disabled={!id}
                            key={sdx}
                            name={s.name}
                            active={type === s.type || (!type && sdx === 0)}
                            route={basePath + id + '/' + i.property + '/' + s.type}
                            onClick={this.handleItemClick}
                        />
                    )}
                </Menu.Menu>
                }
            </Menu.Item>
        ));

        return (
            <Segment color={'blue'} style={this.props.style}>
                <Menu secondary vertical style={{width: '100%'}}>
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
