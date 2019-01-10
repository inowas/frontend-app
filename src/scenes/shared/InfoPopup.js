import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';
import {Icon, Popup} from 'semantic-ui-react';

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

class InfoPopup extends React.Component {
    render() {
        const {description, title, position, iconOutside} = this.props;

        return (
            <Popup
                trigger={
                    <Icon
                        name='question'
                        style={iconOutside ? styles.iconOutside : styles.iconFix}
                        circular link
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
    }
};

InfoPopup.propTypes = {
    description: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    position: PropTypes.string,
    iconOutside: PropTypes.bool
};

export default pure(InfoPopup);