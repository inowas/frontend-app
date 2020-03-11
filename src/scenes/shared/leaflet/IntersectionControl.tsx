import React from 'react';
import Control from 'react-leaflet-control';
import {pure} from 'recompose';
import {Button} from 'semantic-ui-react';

const styles = {
    leafletButton: {
        cursor: 'pointer',
        marginRight: '-1px',
        padding: '0px 0px 0px 0px',
        height: '34px',
        width: '34px'
    },
    leafletButtonGroup: {
        border: '2px solid rgba(0,0,0,0.2)',
        borderRadius: '4px'
    }
};

interface IProps {
    intersection: number;
    onClick: (intersection: number) => any;
}

const intersectionControl = (props: IProps) => {

    const handleClick = (i: number) => () => {
        props.onClick(i);
    };

    return (
        <Control position="topright">
            <Button.Group
                style={styles.leafletButtonGroup}
            >
                <Button
                    onClick={handleClick(0)}
                    primary={props.intersection === 0}
                    style={styles.leafletButton}
                >
                    0
                </Button>
                <Button
                    style={{
                        ...styles.leafletButton,
                        borderLeft: '2px solid rgba(0,0,0,0.2)',
                        borderRight: '2px solid rgba(0,0,0,0.2)',
                        width: '36px'
                    }}
                    onClick={handleClick(50)}
                    primary={props.intersection === 50}
                >
                    50
                </Button>
                <Button
                    style={styles.leafletButton}
                    onClick={handleClick(99)}
                    primary={props.intersection === 99}
                >
                    100
                </Button>
            </Button.Group>
        </Control>
    );
};

export default pure(intersectionControl);
