import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Form, Grid, Header, Radio} from "semantic-ui-react";

import {
    SETTINGS_CASE_FIXED_TIME,
    SETTINGS_CASE_VARIABLE_TIME,
    SETTINGS_INFILTRATION_CONTINUOUS,
    SETTINGS_INFILTRATION_ONE_TIME
} from '../defaults';

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
                <Header as='h3'>Please select the axis for the calculation of groundwater
                    mounding:</Header>
            </Grid.Row>
            <Grid.Row centered>
                <Form>
                    <Form.Field>
                        <Radio
                            label='Variable time (T), Fixed length (x)'
                            value={SETTINGS_CASE_VARIABLE_TIME}
                            name='case'
                            checked={settings.case === SETTINGS_CASE_VARIABLE_TIME}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Fixed time (T), Variable length (x)'
                            value={SETTINGS_CASE_FIXED_TIME}
                            name='case'
                            checked={settings.case === SETTINGS_CASE_FIXED_TIME}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Header as={'h3'}>Select the type of infiltration</Header>
                    <Form.Field>
                        <Radio
                            label='Continuous infiltration'
                            value={SETTINGS_INFILTRATION_CONTINUOUS}
                            name='infiltration'
                            checked={settings.infiltration === SETTINGS_INFILTRATION_CONTINUOUS}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='One-time infiltration'
                            value={SETTINGS_INFILTRATION_ONE_TIME}
                            name='infiltration'
                            checked={settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME}
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
