import React from 'react';
import {Grid, Header} from 'semantic-ui-react';
import AppContainer from '../shared/AppContainer';

const imprint = () => {
    return (
        <AppContainer navbarItems={[]}>
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column textAlign={'center'}>
                        <Header as={'h1'}>Impressum</Header>
                        <p className="description">
                            Es gilt das
                            <a href="https://tu-dresden.de/impressum" target="_blank" rel="noopener noreferrer">
                                &nbsp;Impressum der TU Dresden&nbsp;
                            </a>
                            mit folgenden Abweichungen:
                        </p>

                        <p className="description">
                            <b>Inhaltlich verantwortlich:</b><br/>
                            Dr. Catalin Stefan<br/>
                            Technische Universität Dresden<br/>
                            Junior Research Group INOWAS<br/>
                            01062 Dresden<br/>
                            Tel.: +49 351 46344144<br/>
                            Fax: +49 351 46344122<br/>
                            Email: catalin.stefan@tu-dresden.de<br/>
                        </p>

                        <p className="description">
                            <b>Technischer Betrieb:</b><br/>
                            Dipl.-Ing. Ralf Junghanns<br/>
                            Technische Universität Dresden<br/>
                            Junior Research Group INOWAS<br/>
                            01062 Dresden<br/>
                            Tel.: +49 351 46342691<br/>
                            Email: ralf.junghanns@tu-dresden.de<br/>
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default imprint;
