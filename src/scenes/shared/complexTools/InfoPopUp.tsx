import React from 'react';
import {Icon, Popup} from 'semantic-ui-react';

type positionType =
    'top left'
    | 'top right'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center'
    | 'bottom center'
    | 'top center'
    | undefined;

const renderInfoPopup = (description: JSX.Element, title: string, position: positionType = 'top left',
                         iconOutside = false) => {
    return (
        <Popup
            className="popupFix"
            trigger={
                <Icon
                    className={iconOutside ? 'iconOutside' : 'iconFix'}
                    name="info"
                    circular={true}
                    link={true}
                />
            }
            data-html="true"
            position={position}
        >
            <Popup.Header>
                {title}
            </Popup.Header>
            <Popup.Content className="contentFix">
                {description}
            </Popup.Content>
        </Popup>
    );
};

export default renderInfoPopup;
