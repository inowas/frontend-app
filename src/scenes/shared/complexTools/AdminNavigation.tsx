import {IMenuItem} from '../../t03/defaults/menuItems';
import {Menu, MenuItemProps, Segment} from 'semantic-ui-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import React, {MouseEvent} from 'react';

interface IMenuSection {
    header: string;
    items: IMenuItem[];
}

interface IProps extends RouteComponentProps<any> {
    navigationItems: IMenuSection[];
}

const AdminNavigation = (props: IProps) => {
    const handleItemClick = (e: MouseEvent<HTMLAnchorElement>, {route}: MenuItemProps) => props.history.push(route);

    const property = props.match.params.property || '';
    const path = props.match.path;
    const basePath = path.split(':')[0];
    const {navigationItems} = props;

    const menuItems = navigationItems.map((itemGroup, itemGroupIdx) => (
        <Menu.Item key={itemGroupIdx} className="menuItemGroup">
            <Menu.Header as="h4" className="menuItemHeader">{itemGroup.header}</Menu.Header>
            <Menu.Menu>
                {itemGroup.items.map((i, idx) => (
                    <Menu.Item
                        key={idx}
                        name={i.name}
                        active={property === i.property}
                        route={basePath + i.property}
                        onClick={handleItemClick}
                    />
                ))}
            </Menu.Menu>
        </Menu.Item>
    ));

    return (
        <Segment color={'blue'} className="customMenuContainer">
            <Menu vertical={true} fluid={true} className="customVertMenu">
                {menuItems}
            </Menu>
        </Segment>
    );
};

export default withRouter(AdminNavigation);
