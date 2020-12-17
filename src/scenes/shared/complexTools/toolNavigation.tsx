import {EMessageState} from '../../../core/model/messages/Message.type';
import {IMenuItem} from '../../t03/defaults/menuItems';
import {Icon, Menu, MenuItemProps, Segment} from 'semantic-ui-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import React, {MouseEvent} from 'react';

interface IMenuSection {
    header: string;
    items: IMenuItem[];
}

interface IProps extends RouteComponentProps<any> {
    navigationItems: IMenuSection[];
}

const toolNavigation = (props: IProps) => {
    const handleItemClick = (e: MouseEvent<HTMLAnchorElement>, {route}: MenuItemProps) => props.history.push(route);

    const {id} = props.match.params;
    const property = props.match.params.property || '';
    const path = props.match.path;
    const basePath = path.split(':')[0];
    const {navigationItems} = props;

    const renderIcon = (item: IMenuItem) => {
        if (item.state === EMessageState.IN_PROGRESS) {
            return <Icon loading={true} color="green" name="sync"/>;
        }
        if (item.state === EMessageState.SUCCESS) {
            return <Icon color="green" name="save"/>;
        }
        return item.icon;
    };

    const menuItems = navigationItems.map((itemGroup, itemGroupIdx) => (
        <Menu.Item key={itemGroupIdx} className="menuItemGroup">
            <Menu.Header as="h4" className="menuItemHeader">{itemGroup.header}</Menu.Header>
            <Menu.Menu>
                {itemGroup.items.map((i, idx) => (
                    <Menu.Item
                        disabled={!id || i.disabled}
                        key={idx}
                        name={i.name}
                        active={property === i.property}
                        route={basePath + id + '/' + i.property + (i.type ? `/${i.type}` : '')}
                        onClick={handleItemClick}
                    >
                        {renderIcon(i)}{i.name}
                    </Menu.Item>
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

export default withRouter(toolNavigation);
