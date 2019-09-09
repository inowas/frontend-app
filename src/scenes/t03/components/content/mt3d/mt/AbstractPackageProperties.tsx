import React, {SyntheticEvent} from 'react';

import {DropdownProps, Icon, Popup} from 'semantic-ui-react';
import FlopyMt3dPackage from '../../../../../../core/model/flopy/packages/mt/FlopyMt3dPackage';
import {PopupPosition} from '../../../../../types';

export interface IProps {
    mtPackage: FlopyMt3dPackage;
    onChange: (mtPackage: any) => void;
    readOnly: boolean;
}

interface IState {
    mtPackage: any;
    activeIndex?: number;
}

class AbstractPackageProperties extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            mtPackage: props.mtPackage.toObject(),
            activeIndex: 0
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            mtPackage: nextProps.mtPackage.toObject()
        });
    }

    protected handleClickAccordion = (e: any, titleProps: any) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({
            activeIndex: newIndex
        });
    };

    protected handleOnChange = (e: any) => {
        const {name, value} = e.target;

        return this.setState({
            mtPackage: {
                ...this.state.mtPackage,
                [name]: value
            }
        });
    };

    protected handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        const mtPackage = this.props.mtPackage;
        // @ts-ignore
        mtPackage[name] = value;
        this.props.onChange(mtPackage);
    };

    protected handleOnBlur = (cast?: (value: any) => void) => (e: any) => {
        const {name} = e.target;
        let value;

        (typeof cast === 'function') ? value = cast(e.target.value) : value = e.target.value;
        this.setState({mtPackage: {...this.state.mtPackage, [name]: value}});
        const mtPackage = this.props.mtPackage;

        // @ts-ignore
        mtPackage[name] = value;
        this.props.onChange(mtPackage);
    };

    protected renderInfoPopup = (
        description: string,
        title: string,
        position: PopupPosition = PopupPosition.TOP_LEFT,
        iconOutside = false
    ) => {
        return (
            <Popup
                className={'popupFix'}
                trigger={
                    <Icon
                        className={iconOutside ? 'iconOutside' : 'iconFix'}
                        name={'info'}
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
                <Popup.Content
                    className={'contentFix'}
                >
                    {description}
                </Popup.Content>
            </Popup>
        );
    };
}

export default AbstractPackageProperties;
