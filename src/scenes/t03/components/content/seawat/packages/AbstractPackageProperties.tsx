import React, {ChangeEvent, MouseEvent, SyntheticEvent} from 'react';
import {AccordionTitleProps, DropdownProps, Icon, InputOnChangeData, InputProps, Popup} from 'semantic-ui-react';
import {FlopyModflowPackage} from '../../../../../../core/model/flopy/packages/mf';

interface IProps {
    swtPackage: FlopyModflowPackage;
    onChange: (data: FlopyModflowPackage) => any;
    readonly: boolean;
}

interface IState {
    swtPackage: any;
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
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = index && activeIndex === index ? -1 : parseInt(index, 10);

        this.setState({
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
        const swtPackage = this.props.swtPackage;
        swtPackage[data.name] = data.value;
        this.props.onChange(swtPackage);
    };

    public handleOnBlur = (e: SyntheticEvent<HTMLElement, Event>, data: InputProps) => {
        const {name, value} = data;
        this.setState({swtPackage: {...this.state.swtPackage, [name]: value}});
        const swtPackage = this.props.swtPackage;
        swtPackage[name] = value;
        this.props.onChange(swtPackage);
    };

    public renderInfoPopup = (description: string | Node, title: string, position: positionType = 'top left',
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
