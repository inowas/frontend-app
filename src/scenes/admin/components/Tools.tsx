import {Header, Segment} from 'semantic-ui-react';
import React, {useState} from 'react';

const Tools = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <Segment color={'grey'} loading={isLoading}>
            <Header as={'h2'}>Tools</Header>
        </Segment>
    );
};

export default Tools;
