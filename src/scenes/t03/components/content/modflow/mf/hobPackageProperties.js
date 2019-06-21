import React from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import AbstractPackageProperties from './AbstractPackageProperties';

class HobPackageProperties extends AbstractPackageProperties {
    render() {
        return (
            <Form>
                <Grid divided={'vertically'}>
                    <Header as={'h2'}>Head Observation Package</Header>
                </Grid>
            </Form>
        );
    }
}

export default HobPackageProperties;
