import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {mounding} from 'gwflowjs';
import {Form, Grid, Header, Radio} from "semantic-ui-react";

const fetchParameters = (array) => {
    const parameters = {};

    array.forEach(item => {
        parameters[item.id] = item.value
    });

    return parameters;
};

const Settings = ({settings, onChange, parameters}) => {
    const {L, W, w, hi, Sy, K, t} = fetchParameters(parameters);
    const hhi = mounding.calculateHi(0, 0, w, L, W, hi, Sy, K, t);
    const hMax = (hhi + hi);

    const handleChange = (e, {name, value}) => {
        onChange({[name]: value});
    };

    return (
        <Grid>
            <Grid.Row centered>
                <Header as='h2'>Settings</Header>
            </Grid.Row>
            <Grid.Row centered>
                <Header as='h4'>Please select the axis for the calculation of groundwater
                    mounding:</Header>
            </Grid.Row>
            <Grid.Row centered>
                <Form>
                    <Form.Field>
                        <Radio label='x' value='x' name='variable' checked={settings.variable === 'x'}
                               onChange={handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <Radio label='y' value='y' name='variable' checked={settings.variable === 'y'}
                               onChange={handleChange}/>
                    </Form.Field>
                </Form>
            </Grid.Row>
            <Grid.Row centered>
                The resulting groundwater mound is&nbsp;<strong>{hhi.toFixed(2)}m </strong>
                and the groundwater level will rise up to&nbsp;<strong>{hMax.toFixed(2)}m</strong>.
            </Grid.Row>
        </Grid>
    );
};

Settings.propTypes = {
    onChange: PropTypes.func,
    settings: PropTypes.object,
    parameters: PropTypes.array.isRequired
};

export default pure(Settings);
