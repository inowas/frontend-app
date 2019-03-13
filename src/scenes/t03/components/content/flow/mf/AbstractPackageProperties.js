import PropTypes from 'prop-types';
import React from 'react';

import {Icon, Popup} from 'semantic-ui-react';
import {Mt3dPackageFactory} from 'core/model/flopy/packages/mt';
import {FlopyModflowPackage} from 'core/model/flopy/packages/mf';

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

class AbstractPackageProperties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mfPackage: props.mfPackage.toObject(),
            activeIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mfPackage: nextProps.mfPackage.toObject()
        });
    }

    handleClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({
            activeIndex: newIndex
        });
    };

    handleOnChange = (e) => {
        const {name, value} = e.target;

        return this.setState({
            mfPackage: {
                ...this.state.mfPackage,
                [name]: value
            }
        });
    };

    handleOnSelect = (e, {name, value}) => {
        const mfPackage = {...this.state.mfPackage, [name]: value};
        this.props.onChange(Mt3dPackageFactory.fromData(mfPackage));
    };

    handleOnBlur = (cast) => (e) => {
        const {name} = e.target;
        let value;

        (typeof cast === 'function') ? value = cast(e.target.value) : value = e.target.value;
        const mfPackage = {...this.state.mfPackage, [name]: value};
        this.setState({mfPackage});
        this.props.onChange(Mt3dPackageFactory.fromData(mfPackage));
    };

    renderInfoPopup = (description, title, position = 'top left', iconOutside = false) => {
        return (
            <Popup
                trigger={
                    <Icon
                        name='info'
                        style={ iconOutside ? styles.iconOutside : styles.iconFix }
                        circular link
                    />
                }
                style={styles.popupFix}
                data-html="true"
                position={position}
            >
                <Popup.Header>
                    {title}
                </Popup.Header>
                <Popup.Content style={styles.contentFix}>
                    {description}
                </Popup.Content>
            </Popup>
        );
    };
}

AbstractPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowPackage),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};

export default AbstractPackageProperties;
