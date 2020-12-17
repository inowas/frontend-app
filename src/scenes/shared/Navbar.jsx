/* eslint-disable */
import {Container, Dropdown, Icon, Menu} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

class NavBar extends React.Component {

    historyPushTo = route => {
        this.props.history.push(route);
    };

    renderLinks(links, recursionDepth = 0) {
        return links.filter(l => l).map((l, index) => {
            let active = false;
            const currentPath = this.props.location.pathname;

            if (currentPath && l.path) {
                active = true;
                const currentPathFragments = currentPath.trimLeft('/').split('/');
                const linkPathFragments = l.path.trimLeft('/').split('/');
                for (let i = recursionDepth; i < Math.max(currentPathFragments.length, linkPathFragments.length); i++) {
                    if (currentPathFragments[i] !== linkPathFragments[i]) {
                        active = false;
                        break;
                    }
                }

                if (l.path.trimLeft('/') === 'tools') {
                    active = l.path.trimLeft('/') === currentPath.trimLeft('/');
                }
            }

            let navElement = (
                <Menu.Item
                    key={index}
                    active={active}
                >
                    {l.icon}{l.name}
                </Menu.Item>
            );

            if (l.path) {
                navElement = (
                    <Link className="item" to={l.path} data-active={active} key={index}
                          onClick={() => this.historyPushTo(l.path)}>
                        {l.icon}{l.name.toUpperCase()}
                    </Link>
                );

                if (l.path.includes('http')) {
                    navElement = (
                        <a className="item" href={l.path} target="_blank" rel="noopener noreferrer" data-active={active}
                           key={index}>
                            {l.icon}{l.name.toUpperCase()}
                        </a>
                    );
                }
            }

            return (
                //<li key={index} className="nav-item">
                <div key={index}>
                    {navElement}
                    {l.sub && <ul className="nav-list">{this.renderLinks(l.sub, recursionDepth + 1)}</ul>}
                </div>
                //</li>
            );
        });
    }

    renderInfo = (info) => <li style={{margin: 5}}><span dangerouslySetInnerHTML={{__html: info}}/></li>;

    renderRoleSpecificItems = roles => {
        if (roles.includes('ROLE_ADMIN')) {
            return (
                <Dropdown.Item onClick={() => this.historyPushTo('/admin')}>
                    Admin
                </Dropdown.Item>
            );
        }

        return null;
    };

    renderUserNavigation(userIsLoggedIn) {
        const {roles, name} = this.props.user;
        if (userIsLoggedIn) {
            return (
                <Dropdown item text={name}>
                    <Dropdown.Menu>
                        {this.renderRoleSpecificItems(roles)}
                        <Dropdown.Item onClick={() => this.historyPushTo('/credentials')}>
                            Change password
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.historyPushTo('/profile')}>
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.historyPushTo('/logout')}>
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            );
        }

        return (
            <Menu.Item onClick={() => this.historyPushTo('/login')}>
                <Icon name="user"/> Login
            </Menu.Item>
        );
    }

    render() {
        const standardLinks = [];
        const standardLinksAuthenticationRequired = [
            {
                name: 'Dashboard',
                path: '/tools',
                icon: <Icon name="settings"/>
            }
        ];

        const userIsLoggedIn = this.props.session.token;

        return (

            <Menu fixed='top' inverted color='grey' style={{zIndex: 9999}}>
                <Container style={{minWidth: '1280px', padding: '0 1em'}}>
                    {this.renderLinks(standardLinks)}
                    {userIsLoggedIn && this.renderLinks(standardLinksAuthenticationRequired.concat(this.props.links))}
                    {!userIsLoggedIn && this.props.info && this.renderInfo(this.props.info)}
                    <Menu.Menu position='right'>
                        {this.renderUserNavigation(userIsLoggedIn)}
                    </Menu.Menu>
                </Container>
            </Menu>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user,
        session: state.session,
        routing: state.routing,
        ...ownProps
    };
};

NavBar.propTypes = {
    history: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    info: PropTypes.string,
    links: PropTypes.array
};

export default withRouter(connect(mapStateToProps)(NavBar));
