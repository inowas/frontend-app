import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import logoInowas from '../../images/logo-inowas.svg';
import logoTUD from '../../images/logo-tud.svg';
import logoBmbf from '../../images/logo-bmbf.svg';
import {Container, Grid, List, Segment, Header} from 'semantic-ui-react';
import getConfig from '../../config.default';

class Footer extends React.Component {
    render() {
        const width = this.props.width || 1280;
        const styleContent = {
            padding: '0 calc((100% - ' + width + 'px) / 2) 0 calc((100% - ' + width + 'px) / 2)'
        };

        return (
            <Container style={this.props.style} textAlign='center'>
                <Segment color={'grey'} inverted style={styleContent}>
                    <Grid padded stackable>
                        <Grid.Row columns={4}>
                            <Grid.Column textAlign='left' style={{padding: '0em 2em'}}>
                                <List link inverted>
                                    <List.Item>
                                        <Link to={'/imprint'}>Imprint</Link>
                                    </List.Item>
                                    <List.Item>
                                        <Link to={'https://tu-dresden.de/bu/umwelt/hydro/inowas/project/kontakt'}>
                                            Contact
                                        </Link>
                                    </List.Item>
                                    <List.Item>
                                        Release: {getConfig().VERSION}
                                    </List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column>
                                <Header inverted as='h3' content='Developed by'/>
                                <a href="https://tu-dresden.de/bu/umwelt/hydro/inowas" target="_blank"
                                   rel="noopener noreferrer">
                                    <img src={logoInowas} alt="INOWAS logo"/>
                                </a>
                            </Grid.Column>
                            <Grid.Column>
                                <Header inverted as='h3' content='Supported by'/>
                                <a href="https://tu-dresden.de/" target="_blank" rel="noopener noreferrer">
                                    <img src={logoTUD} alt="TUD logo"/>
                                </a>
                            </Grid.Column>
                            <Grid.Column>
                                <Header inverted as='h3' content='Funded by'/>
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

Footer.propTypes = {
    width: PropTypes.number.isRequired,
    style: PropTypes.object
};

export default Footer;
