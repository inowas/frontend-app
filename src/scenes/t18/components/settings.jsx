import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Form, Grid, Header, Radio} from 'semantic-ui-react';
import {SETTINGS_INFILTRATION_TYPE_BASIN, SETTINGS_INFILTRATION_TYPE_CYLINDER} from '../defaults/T18';

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
                <p>The infiltration rate was estimated using:</p>
                <Form style={{textAlign:'left'}}>
                    <Form.Field>
                        <Radio
                            label='Basin infiltration test'
                            value={SETTINGS_INFILTRATION_TYPE_BASIN}
                            name='AF'
                            checked={settings.AF === SETTINGS_INFILTRATION_TYPE_BASIN}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Fixed time (T), Variable length (x)'
                            value={SETTINGS_INFILTRATION_TYPE_CYLINDER}
                            name='AF'
                            checked={settings.AF === SETTINGS_INFILTRATION_TYPE_CYLINDER}
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
