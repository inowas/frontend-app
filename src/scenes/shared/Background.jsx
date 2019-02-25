import React from 'react';
import {pure} from 'recompose';
import {Container, Image} from 'semantic-ui-react';

export default pure(({title, image}) => {
    return (
        <div>
            <Container textAlign='center'>
                <Image src={image} fluid />
            </Container>
        </div>
    );
});
