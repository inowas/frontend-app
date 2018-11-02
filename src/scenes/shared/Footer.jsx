import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import logoInowas from '../../images/logo-inowas.svg';
import logoTUD from '../../images/logo-tud.svg';
import logoBmbf from '../../images/logo-bmbf.svg';
import {Container, Grid, List, Segment} from "semantic-ui-react";

class Footer extends React.Component {
    render() {
        const width = this.props.width || 1280;
        const styleContent = {
            padding: '0 calc((100% - ' + width + 'px) / 2) 0 calc((100% - ' + width + 'px) / 2)'
        };

        return (
            <Container style={this.props.style}>
                <Segment color={'grey'} inverted style={styleContent}>
                    <Grid padded>
                        <Grid.Row columns={4}>
                            <Grid.Column>
                                <List link>
                                    <List.Item>
                                        <Link to={'/impressum'}>Impressum</Link>
                                    </List.Item>
                                    <List.Item>
                                        <Link to={"https://tu-dresden.de/bu/umwelt/hydro/inowas/project/kontakt"}>
                                            Contact
                                        </Link>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column>
                                <h3>Developed by</h3>
                                <a href="https://tu-dresden.de/bu/umwelt/hydro/inowas" target="_blank"
                                   rel="noopener noreferrer">
                                    <img src={logoInowas} alt="INOWAS logo"/>
                                </a>
                            </Grid.Column>
                            <Grid.Column>
                                <h3>Supported by</h3>
                                <a href="https://tu-dresden.de/" target="_blank" rel="noopener noreferrer">
                                    <img src={logoTUD} alt="TUD logo"/>
                                </a>
                            </Grid.Column>
                            <Grid.Column>
                                <h3>Funded by</h3>
                                <a href="https://www.bmbf.de/en/index.html" target="_blank" rel="noopener noreferrer">
                                    <img src={logoBmbf} alt="Federal Ministry of Education and Research logo"/>
                                </a>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
        );
    }
}

Footer.proptypes = {
    width: PropTypes.number.isRequired,
    style: PropTypes.object
};

export default Footer;
