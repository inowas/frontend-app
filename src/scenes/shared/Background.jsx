import React from 'react';
import {pure} from 'recompose';
import {Container, Header, Image} from "semantic-ui-react";

export default pure(({image}) => {
    return (
        <div>
            <Header as='h2' textAlign='center'>Background</Header>
            <Container textAlign='center'>
                <Image src={image}/>
            </Container>
        </div>
    );
});
