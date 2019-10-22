import React, {MouseEvent} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Icon, Menu, MenuItemProps, Popup, Segment} from 'semantic-ui-react';
import {IMenuItem} from '../defaults/menuItems';

interface IProps extends RouteComponentProps<any> {
    navigationItems: IMenuItem[];
}

const toolNavigation = (props: IProps) => {
    const handleItemClick = (e: MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        props.history.push(data.route);
    };

    const {id} = props.match.params;
    const {property} = props.match.params || '';

    const path = props.match.path;
    const basePath = path.split(':')[0];
    const {navigationItems} = props;

    const menuItems = navigationItems.map((i, idx) => (
        <Menu.Item
            disabled={i.status !== null && i.status.val === 'warning'}
            key={idx}
            active={property === i.property}
            route={basePath + id + '/' + i.property}
            onClick={property !== i.property ? handleItemClick : undefined}
        >
            {i.status && i.status.val === 'locked' &&
            <Icon name="lock" color="green"/>
            }
            {i.status && i.status.val === 'success' &&
            <Icon name="check circle" color="green"/>
            }
            {i.status && i.status.msg && i.status.val === 'warning' &&
            <Popup
                trigger={<Icon name="exclamation circle" color="yellow"/>}
                content={i.status.msg}
            />
            }
            {i.name}
        </Menu.Item>
    ));

    return (
        <Segment color={'blue'}>
            <Menu secondary={true} vertical={true} style={{width: '100%'}}>
                {menuItems}
            </Menu>
        </Segment>
    );
};

export default withRouter(toolNavigation);
