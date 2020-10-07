import React, {ReactNode} from 'react';

import {Container, Dimmer, Loader, Segment} from 'semantic-ui-react';
import Footer from './Footer';
import NavBar from './Navbar';

const styles = {
    wrapper: {
        minWidth: '1280px',
        maxWidth: '1280px',
        paddingTop: '50px',
        minHeight: 'calc(100vh - 170px)'
    },
    content: {
        width: '100%'
    },
    navbar: {
        margin: '0 auto'
    },
    footer: {
        marginTop: '20px',
        width: '100%',
        minHeight: '150px'
    },
    content_loading: {
        width: '100%',
        height: '100%'
    }
};

interface IProps {
    loading?: boolean;
    navbarItems: any[];
    children: ReactNode;
}

const appContainer = (props: IProps) => {

    if (props.loading) {
        return (
            <div>
                <Container style={styles.wrapper}>
                    <NavBar links={props.navbarItems || []} styles={styles.navbar}/>
                    <Segment>
                        <Dimmer active={true} inverted={true}>
                            <Loader size="large">Loading</Loader>
                        </Dimmer>
                    </Segment>
                </Container>
                <Footer style={styles.footer} width={1280}/>
            </div>
        );
    }

    return (
        <div>
            <Container style={styles.wrapper}>
                <NavBar links={props.navbarItems || []} styles={styles.navbar}/>
                <Container style={styles.content}>
                    {props.children}
                </Container>
            </Container>
            <Footer style={styles.footer} width={1280}/>
        </div>
    );
};

export default appContainer;
