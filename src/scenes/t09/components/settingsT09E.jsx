import PropTypes from 'prop-types';
import React from 'react';

import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';

const Settings = ({settings, onChange}) => {

    const handleChange = (e, {name, value}) => {
        onChange({...settings, [name]: value});
    };

    return (
        <Grid padded>
            <Grid.Row centered>
                <Form>
                    <Header as='h4'>Choose the appropriate boundary condition:</Header>
                    <Segment style={{textAlign:'left'}}>
                        <Form.Field>
                            <Radio
                                label='Constant head'
                                value='constHead'
                                name='method'
                                checked={settings.method === 'constHead'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Constant flux'
                                value='constFlux'
                                name='method'
                                checked={settings.method === 'constFlux'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                    </Segment>
                </Form>
            </Grid.Row>
        </Grid>
    );
};

Settings.propTypes = {
    onChange: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
};

export default Settings;
