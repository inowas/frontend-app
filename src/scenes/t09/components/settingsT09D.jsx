import PropTypes from 'prop-types';
import React from 'react';
import {pure} from "recompose";
import {Form, Grid, Header, Radio} from "semantic-ui-react";

const Settings = ({settings, onChange}) => {

    const handleChange = (e, {name, value}) => {
        onChange({...settings, [name]: value});
    };

    return (
        <Grid padded>
            <Grid.Row centered>
                <Header as='h2'>Settings</Header>
            </Grid.Row>
            <Grid.Row centered>
                <Header as='h3'>Please choose the aquifer type:</Header>
            </Grid.Row>
            <Grid.Row centered>
                <Form>
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
                </Form>
            </Grid.Row>
        </Grid>
    );
};

Settings.propTypes = {
    onChange: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
};

export default pure(Settings);
