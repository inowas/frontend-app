import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Container, Dimmer, Loader, Segment} from "semantic-ui-react";
import NavBar from "./Navbar";
import Footer from "./Footer";

const styles = {
    wrapper: {
        minWidth: '1280px',
        maxWidth: '1280px',
        paddingTop: '50px',
        minHeight: 'calc(100vh - 190px)'
    },
    content: {
        width: '100%'
    },
    navbar: {
        padding: '0 calc((100% - 1280px) / 2) 0 calc((100% - 1280px) / 2)'
    },
    footer: {
        marginTop: '20px',
        width: '100%',
    },
    content_loading: {
        width: '100%',
        height: '100%'
    }
};

class AppContainer extends Component {
    render() {
        if (this.props.loading) {
            return (
                <div>
                    <Container style={styles.wrapper}>
                        <NavBar links={this.props.navbarItems || []} styles={styles.navbar}/>
                        <Segment>
                            <Dimmer active inverted>
                                <Loader size='large'>Loading</Loader>
                            </Dimmer>
                        </Segment>
                    </Container>
                    <Footer style={styles.footer} width={1280}/>
                </div>
            )
        }

        return (
            <div>
                <Container style={styles.wrapper}>
                    <NavBar links={this.props.navbarItems || []} styles={styles.navbar}/>
                    <Container style={styles.content}>
                        {this.props.children}
                    </Container>
                </Container>
                <Footer style={styles.footer} width={1280}/>
            </div>
        );
    }
}

AppContainer.proptypes = {
    loading: PropTypes.bool,
    navbarItems: PropTypes.array.isRequired
};

export default AppContainer;
