import React, {ChangeEvent} from 'react';
import {Icon, Input, InputOnChangeData, Popup} from 'semantic-ui-react';

interface IProps {
    name: string;
    onChange: (name: string, value: string | number | null) => any;
    placeholder: string | number;
    readOnly: boolean;
    type: 'number' | 'string';
    value: string | number | null;
}

interface IState {
    localValue: string | number | null;
}

class ToggleableInput extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            localValue: props.value
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            localValue: nextProps.value
        });
    }

    public render() {
        const {name, value} = this.props;
        const {localValue} = this.state;

        const isActive = value !== null;
        const type = !isActive ? 'string' : this.props.type;

        return (
            <Input
                disabled={!isActive}
                onBlur={this.onChange}
                onChange={this.onLocalChange}
                readOnly={this.props.readOnly}
                type={type}
                name={name}
                value={!isActive ? '-' : localValue}
                onKeyPress={this.onKeyPress}
                icon={!this.props.readOnly &&
                    <Popup
                        trigger={
                            <Icon
                                name={!isActive ? 'toggle on' : 'toggle off'}
                                link={true}
                                onClick={this.onToggle}
                            />
                        }
                        content="Toggle"
                        size="mini"
                    />
                }
            />
        );
    }

    private onChange = () => {
        const parsedValue = this.props.type === 'number' && typeof this.state.localValue === 'string' ?
            parseFloat(this.state.localValue) : this.state.localValue;

        return this.props.onChange(this.props.name, parsedValue);
    };

    private onKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            return this.onChange();
        }
    };

    private onLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => this.setState({
        localValue: data.value
    });

    private onToggle = () => {
        return this.props.onChange(this.props.name, this.props.value === null ? this.props.placeholder : null);
    };
}

export default ToggleableInput;
