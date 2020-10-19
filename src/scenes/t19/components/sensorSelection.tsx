import React from 'react';
import {Segment} from "semantic-ui-react";

interface IProps {
    onChange: () => void;
}

const SensorSelection = (props: IProps) => {

    return (
        <Segment color={'grey'}>
            <h3>Select Sensors</h3>
        </Segment>
    );
};

export default SensorSelection;
