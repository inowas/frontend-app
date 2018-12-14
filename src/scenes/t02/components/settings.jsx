import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Form, Grid, Header, Radio} from "semantic-ui-react";

const Settings = ({settings, onChange}) => {

    const handleChange = (e, {name, value}) => {
        onChange({[name]: value});
    };

    return (
        <Grid padded>
            <Grid.Row centered>
                <Header as='h2'>Settings</Header>
            </Grid.Row>
            <Grid.Row centered>
                <p>Please select the axis for the calculation of groundwater
                    mounding:</p>
            </Grid.Row>
            <Grid.Row centered>
                <Form>
                    <Form.Group>
                        <Form.Field>
                            <Radio
                                label='x-axis'
                                value='x'
                                name='variable'
                                checked={settings.variable === 'x'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='y-axis'
                                value='y'
                                name='variable'
                                checked={settings.variable === 'y'}
                                onChange={handleChange}
                            />
                        </Form.Field>
                    </Form.Group>
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
