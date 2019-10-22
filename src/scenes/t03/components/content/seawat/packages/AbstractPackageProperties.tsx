import React, {ChangeEvent, FocusEvent, MouseEvent, SyntheticEvent} from 'react';
import {AccordionTitleProps, DropdownProps, Icon, InputOnChangeData, Popup} from 'semantic-ui-react';
import {FlopySeawatPackage} from '../../../../../../core/model/flopy/packages/swt';
import {Transport} from '../../../../../../core/model/modflow';

interface IIndexObject {
    [index: string]: any;
}

interface IProps {
    swtPackage: FlopySeawatPackage;
    onChange: (data: FlopySeawatPackage | IIndexObject) => any;
    readOnly: boolean;
    transport: Transport;
}

interface IState {
    swtPackage: {[index: string]: any};
    activeIndex: number;
}

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

class AbstractPackageProperties extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            swtPackage: props.swtPackage.toObject(),
            activeIndex: 0
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            swtPackage: nextProps.swtPackage.toObject()
        });
    }

    public handleClickAccordion = (e: MouseEvent<HTMLDivElement, MouseEvent>, titleProps: AccordionTitleProps) => {
        if (!titleProps.index) {
            return;
        }

        const index = typeof titleProps.index === 'number' ? titleProps.index : parseFloat(titleProps.index);
        const {activeIndex} = this.state;
        const newIndex = index && activeIndex === index ? -1 : index;

        return this.setState({
            activeIndex: newIndex
        });
    };

    public handleOnChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const {name, value} = data;

        return this.setState({
            swtPackage: {
                ...this.state.swtPackage,
                [name]: value
            }
        });
    };

    public handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const swtPackage: IIndexObject = this.props.swtPackage;
        swtPackage[data.name] = data.value;
        this.props.onChange(swtPackage);
    };

    public handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget;

        this.setState({swtPackage: {...this.state.swtPackage, [name]: value}});
        const swtPackage: IIndexObject = this.props.swtPackage;
        swtPackage[name] = value;
        this.props.onChange(swtPackage);
    };

    public renderInfoPopup = (description: JSX.Element, title: string, position: positionType = 'top left',
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
}

export default AbstractPackageProperties;
