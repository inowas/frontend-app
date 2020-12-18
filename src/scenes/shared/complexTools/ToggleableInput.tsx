import {Icon, Input, InputOnChangeData, Popup} from 'semantic-ui-react';
import React, {ChangeEvent, useState} from 'react';

interface IProps {
    name: string;
    onChange: (name: string, value: string | number | null) => any;
    placeholder: string | number;
    readOnly: boolean;
    type: 'number' | 'string';
    value: string | number | null;
}

const ToggleableInput = (props: IProps) => {
    const [localValue, setLocalValue] = useState<string | number | null>(props.value);

    const handleChange = () => {
        const parsedValue = props.type === 'number' && typeof localValue === 'string' ?
            parseFloat(localValue) : localValue;

        return props.onChange(props.name, parsedValue);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            return handleChange();
        }
    };

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setLocalValue(data.value);

    const handleToggle = () => {
        setLocalValue(props.value === null ? props.placeholder : null);
        return props.onChange(props.name, props.value === null ? props.placeholder : null);
    };

    const isActive = localValue !== null;
    const type = !isActive ? 'string' : props.type;

    return (
        <Input
            disabled={!isActive}
            onBlur={handleChange}
            onChange={handleLocalChange}
            readOnly={props.readOnly}
            type={type}
            name={props.name}
            value={!isActive ? '-' : localValue}
            onKeyPress={handleKeyPress}
            icon={!props.readOnly &&
            <Popup
                trigger={
                    <Icon
                        name={!isActive ? 'toggle on' : 'toggle off'}
                        link={true}
                        onClick={handleToggle}
                    />
                }
                content="Toggle"
                size="mini"
            />
            }
        />
    );
};

export default ToggleableInput;
