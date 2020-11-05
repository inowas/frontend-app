import React from 'react';
import {Grid, Segment, Form} from "semantic-ui-react";

const RTModellingSetup = () => {

    return (
        <Segment color={'grey'}>
            <Form>
                <Grid>
                    <Grid.Row>
                        <Form.Group>
                            <label>Model</label>
                        </Form.Group>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
    );
};

export default RTModellingSetup;
