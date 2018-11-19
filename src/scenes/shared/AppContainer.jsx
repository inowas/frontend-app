import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Container} from "semantic-ui-react";
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
        // borderRadius: 0,
        marginTop: '20px',
        //textAlign: 'center',
        width: '100%',
    }
};

class AppContainer extends Component {
    render() {
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
    navbarItems: PropTypes.array
};

export default AppContainer;
