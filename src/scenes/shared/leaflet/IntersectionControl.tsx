import React from 'react';
// @ts-ignore
import Control from 'react-leaflet-control';
import {pure} from 'recompose';
import {Button, Popup} from 'semantic-ui-react';

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
            <Popup
                content="Percentage of cell covered by model area to become active"
                position="left center"
                trigger={
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
                                borderLeft: '1px solid rgba(0,0,0,0.2)',
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
                            onClick={handleClick(90)}
                            primary={props.intersection === 90}
                        >
                            90
                        </Button>
                    </Button.Group>
                }
            />
        </Control>
    );
};

export default pure(intersectionControl);
