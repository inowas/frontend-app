import {Container, Image} from 'semantic-ui-react';
import React from 'react';

interface IProps {
    title?: string;
    image: string;
}

const background = (props: IProps) => {
    return (
        <Container textAlign={'center'}>
            <Image src={props.image} fluid={true}/>
        </Container>
    );
};

export default background;
