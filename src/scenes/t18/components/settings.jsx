import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import {SETTINGS_INFILTRATION_TYPE_BASIN, SETTINGS_INFILTRATION_TYPE_CYLINDER} from '../defaults/T18';

const Settings = ({settings, onChange}) => {

    const handleChange = (e, {name, value}) => {
        onChange({...settings, [name]: value});
    };

    return (
        <Grid padded>
            <Grid.Row centered>
                <Form style={{textAlign:'left'}}>
                    <Header as='h4'>The infiltration rate was estimated using:</Header>
                    <Segment>
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
                            label='Cylinder infiltrometer or air entry permeameter'
                            value={SETTINGS_INFILTRATION_TYPE_CYLINDER}
                            name='AF'
                            checked={settings.AF === SETTINGS_INFILTRATION_TYPE_CYLINDER}
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

export default pure(Settings);
