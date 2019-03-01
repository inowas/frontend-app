import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Form, Grid, Radio, Header, Segment} from 'semantic-ui-react';

const Settings = ({settings, onChange}) => {

    const handleChange = (e, {name, value}) => {
        onChange({[name]: value});
    };

    return (
        <Grid padded>
            <Grid.Row centered>
                <Form>
                    <Header as={'h4'}>Select the axis:</Header>
                    <Segment>
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
