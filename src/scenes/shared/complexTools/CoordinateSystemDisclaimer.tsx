import {Divider, Grid, Header} from 'semantic-ui-react';
import React from 'react';

const coordinateSystemDisclaimer = () => (
    <div>
        <Grid columns={1} stackable={true} textAlign="center">
            <Grid.Row>
                <Grid.Column>
                    <Header as={'h2'}>Geometry format</Header>
                    The platform is using the GEOJSON Format described in&nbsp;
                    <a rel="noopener noreferrer" target='_blank'
                       href={'https://tools.ietf.org/html/rfc7946'}>RFC7946</a>.
                    <br/>
                    GEOJSON uses the geographic coordinate reference system: <br/>
                    <br/>
                    <strong>WGS84 with units of decimal degrees</strong>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <Divider/>
    </div>
);

export default coordinateSystemDisclaimer;
