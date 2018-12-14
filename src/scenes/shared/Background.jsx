import React from 'react';
import {pure} from 'recompose';
import {Container, Header, Image} from 'semantic-ui-react';

export default pure(({title, image}) => {
    return (
        <div>
            <Header as='h2' size ='medium' textAlign='center'>{title.toUpperCase()}</Header>
            <Container textAlign='center'>
                <Image src={image} fluid />
            </Container>
        </div>
    );
});
