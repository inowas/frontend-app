import React from 'react';
import {Button} from 'semantic-ui-react';

interface IProps {
    visible: boolean;
    disabled: boolean;
    loading: boolean;
    onClick: () => any;
}

const calculationButton = (props: IProps) => {

    if (!props.visible) {
        return null;
    }

    return (
        <Button
            positive={true}
            fluid={true}
            onClick={props.onClick}
            disabled={props.disabled}
            loading={props.loading}
        >
            Calculate
        </Button>
    );
};

export default calculationButton;
