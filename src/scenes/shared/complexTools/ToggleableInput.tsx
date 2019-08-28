import React, {ChangeEvent, useEffect, useState} from 'react';
import {Icon, Input, InputOnChangeData, Popup} from 'semantic-ui-react';

interface IProps {
    name: string;
    onChange: (name: string, value: string | number | null) => any;
    placeholder: string | number;
    readOnly: boolean;
    type: 'number' | 'string';
    value: string | number | null;
}

const toggleableInput = (props: IProps) => {
    const [localValue, setLocalValue] = useState<string | number | null>(props.value);

    useEffect(() => {
        setLocalValue(props.value);
    }, [props.value]);

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

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setLocalValue(data.value);
    };

    const handleToggle = () => {
        return props.onChange(props.name, props.value === null ? props.placeholder : null);
    };

    const isActive = props.value !== null;
    const type = !isActive ? 'string' : props.type;

    return (
        <Input
            disabled={!isActive}
            onBlur={handleChange}
            onChange={handleLocalChange}
            readOnly={props.readOnly}
            type={type}
            name={name}
            value={!isActive ? '-' : localValue}
            onKeyPress={handleKeyPress}
            icon={
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

export default toggleableInput;
