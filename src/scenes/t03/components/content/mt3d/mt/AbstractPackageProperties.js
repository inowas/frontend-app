import PropTypes from 'prop-types';
import React from 'react';

import {Icon, Popup} from 'semantic-ui-react';
import FlopyMt3dPackage from 'core/model/flopy/packages/mt/FlopyMt3dPackage';

class AbstractPackageProperties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mtPackage: props.mtPackage.toObject(),
            activeIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mtPackage: nextProps.mtPackage.toObject()
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
            mtPackage: {
                ...this.state.mtPackage,
                ['_' + name]: value
            }
        });
    };

    handleOnSelect = (e, {name, value}) => {
        const mtPackage = this.props.mtPackage;
        mtPackage[name] = value;
        this.props.onChange(mtPackage);
    };

    handleOnBlur = (e) => {
        const {name, value} = e.target;
        this.setState({mtPackage: {...this.state.mtPackage, [name]: value}});
        const mtPackage = this.props.mtPackage;
        mtPackage[name] = value;
        this.props.onChange(mtPackage);
    };

    renderInfoPopup = (description, title, position = 'top left', iconOutside = false) => {
        return (
            <Popup className='popupFix'
                   trigger={
                       <Icon className={iconOutside ? 'iconOutside' : 'iconFix'}
                             name='info'
                             circular link
                       />
                   }
                   data-html="true"
                   position={position}
            >
                <Popup.Header>
                    {title}
                </Popup.Header>
                <Popup.Content className='contentFix'>
                    {description}
                </Popup.Content>
            </Popup>
        );
    };
}

AbstractPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dPackage),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};

export default AbstractPackageProperties;
