import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import {IT02} from '../defaults';
import React from 'react';

interface IProps {
    settings: IT02['data']['settings'],
    onChange: (data: any) => void
}

const Settings = (props: IProps) => {

    const handleChange = (e: any, {name, value}: any) => {
        props.onChange({[name]: value});
    };

    return (
        <Grid padded>
            <Grid.Row centered>
                <Form>
                    <Header as={'h4'}>Select the axis:</Header>
                    <Segment>
                        <Form.Group style={{marginBottom: 0}}>
                            <Form.Field>
                                <Radio
                                    label='x-axis'
                                    value='x'
                                    name='variable'
                                    checked={props.settings.variable === 'x'}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label='y-axis'
                                    value='y'
                                    name='variable'
                                    checked={props.settings.variable === 'y'}
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

export default Settings;
