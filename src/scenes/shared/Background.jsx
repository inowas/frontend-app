import React from 'react';
import {pure} from 'recompose';
import {Container, Header, Image} from "semantic-ui-react";

export default pure(({title, image}) => {
    return (
        <div>
            <Header as='h3' textAlign='center'>{title}</Header>
            <Container textAlign='center'>
                <Image src={image} fluid />
            </Container>
        </div>
    );
});
