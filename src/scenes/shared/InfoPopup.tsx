import React from 'react';
import {Icon, Popup, PopupProps} from 'semantic-ui-react';

const styles = {
    iconFix: {
        width: '5px',
        height: '5px',
    },
    iconOutside: {
        marginTop: '4px',
        marginLeft: '-4px',
        width: '5px',
        height: '5px'
    },
    popupFix: {
        maxWidth: '350px'
    },
    contentFix: {
        width: 'auto',
        maxWidth: '350px'
    }
};

interface IProps {
    description: string | JSX.Element;
    title: string;
    position?: PopupProps['position'];
    iconOutside?: boolean;
}

const infoPopup = (props: IProps) => {
    const {description, title, position, iconOutside} = props;

    return (
        <Popup
            trigger={
                <Icon
                    name="info"
                    style={iconOutside ? styles.iconOutside : styles.iconFix}
                    circular={true}
                    link={true}
                />
            }
            style={styles.popupFix}
            data-html="true"
            position={position}
        >
            <Popup.Header>{title}</Popup.Header>
            <Popup.Content>{description}</Popup.Content>
        </Popup>
    );
};

export default infoPopup;
