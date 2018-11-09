import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {mounding} from 'gwflowjs';
import {Form, Grid, Header, Radio} from "semantic-ui-react";

const Settings = ({settings, onChange, w, L, W, hi, Sy, K, t}) => {
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
    w: PropTypes.number.isRequired,
    L: PropTypes.number.isRequired,
    W: PropTypes.number.isRequired,
    hi: PropTypes.number.isRequired,
    Sy: PropTypes.number.isRequired,
    K: PropTypes.number.isRequired,
    t: PropTypes.number.isRequired,
};

export default pure(Settings);
