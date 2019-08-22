import React from 'react';
import {Icon, Popup} from 'semantic-ui-react';
import {PopupPosition} from '../../types';

const renderInfoPopup = (description: JSX.Element, title: string, position: PopupPosition = PopupPosition.TOP_LEFT,
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
