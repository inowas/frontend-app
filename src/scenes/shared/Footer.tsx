import React from 'react';

import {Link} from 'react-router-dom';

import {Container, Grid, Header, List, Segment} from 'semantic-ui-react';
import getConfig from '../../config.default';
import logoBmbf from '../../images/logo-bmbf.svg';
import logoInowas from '../../images/logo-inowas.svg';
import logoTUD from '../../images/logo-tud.svg';

interface IProps {
    width?: number;
    style?: any;
}

const footer = (props: IProps) => {
    const width = props.width || 1280;
    const styleContent = {
        padding: '0 calc((100% - ' + width + 'px) / 2) 0 calc((100% - ' + width + 'px) / 2)'
    };

    return (
        <Container style={props.style} textAlign={'center'}>
            <Segment color={'grey'} inverted={true} style={styleContent}>
                <Grid padded={true} stackable={true}>
                    <Grid.Row columns={4}>
                        <Grid.Column textAlign="left" style={{padding: '0em 2em'}}>
                            <List link={true} inverted={true}>
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
                            <Header inverted={true} as="h3" content="Developed by"/>
                            <a
                                href="https://tu-dresden.de/bu/umwelt/hydro/inowas"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={logoInowas} alt="INOWAS logo"/>
                            </a>
                        </Grid.Column>
                        <Grid.Column>
                            <Header inverted={true} as="h3" content="Supported by"/>
                            <a href="https://tu-dresden.de/" target="_blank" rel="noopener noreferrer">
                                <img src={logoTUD} alt="TUD logo"/>
                            </a>
                        </Grid.Column>
                        <Grid.Column>
                            <Header inverted={true} as="h3" content="Funded by"/>
                            <a href="https://www.bmbf.de/en/index.html" target="_blank" rel="noopener noreferrer">
                                <img src={logoBmbf} alt="Federal Ministry of Education and Research logo"/>
                            </a>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </Container>
    );
};

export default footer;
