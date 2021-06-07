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
                    <Header as='h4'>Choose the aquifer type:</Header>
                    <Segment style={{textAlign:'left'}}>
                        <Form.Field>
                            <Radio
                                label='Confined Aquifer'
                                value={'confined'}
                                name='AqType'
                                checked={settings.AqType === 'confined'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Unconfined Aquifer'
                                value={'unconfined'}
                                name='AqType'
                                checked={settings.AqType === 'unconfined'}
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
