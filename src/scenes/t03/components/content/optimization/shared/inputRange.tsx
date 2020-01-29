import React, {ChangeEvent, useEffect, useState} from 'react';
import {Form, InputOnChangeData} from 'semantic-ui-react';

export interface IInputRangeResult {
    name: string;
    from: number;
    to: number;
}

interface IProps {
    name: string;
    from: number;
    to: number;
    min?: number;
    max?: number;
    decimals?: number;
    label: string;
    label_from: string;
    label_to: string;
    disabled?: boolean;
    onChange: (result: IInputRangeResult) => any;
}

const inputRange = (props: IProps) => {
    const [from, setFrom] = useState<string>(props.from.toFixed(props.decimals));
    const [to, setTo] = useState<string>(props.to.toFixed(props.decimals));
    const [errorFrom, setErrorFrom] = useState<boolean>(false);
    const [errorTo, setErrorTo] = useState<boolean>(false);

    useEffect(() => {
        setFrom(props.from.toFixed(props.decimals));
    }, [props.decimals, props.from]);

    useEffect(() => {
        setTo(props.to.toFixed(props.decimals));
    }, [props.decimals, props.to]);

    const handleChange = (e: ChangeEvent, {name, value}: InputOnChangeData) => {
        if (name === 'from') {
            setFrom(value);
        }
        if (name === 'to') {
            setTo(value);
        }
    };

    const handleSubmit = () => {
        const rFrom = parseFloat(from);
        const rTo = parseFloat(to);
        const rErrorFrom = rFrom > rTo;
        const rErrorTo = rTo < rFrom;

        setErrorFrom(rErrorFrom);
        setErrorTo(rErrorTo);

        if (!rErrorFrom && !rErrorTo) {
            return props.onChange({
                name: props.name,
                from: rFrom,
                to: rTo
            });
        }
    };

    const styles = {
        inputFix: {
            padding: '0'
        }
    };

    return (
        <Form.Group widths="equal">
            <Form.Field>
                {props.label || props.label_from ?
                    <label>
                        {props.label ? props.label : ''} {props.label_from ? props.label_from : ''}
                    </label>
                    :
                    ''
                }
                <Form.Input
                    disabled={props.disabled}
                    type="number"
                    name="from"
                    value={from}
                    placeholder="from ="
                    style={styles.inputFix}
                    onChange={handleChange}
                    onBlur={handleSubmit}
                    error={errorFrom}
                />
            </Form.Field>
            <Form.Field>
                {props.label_to ? <label>{props.label_to}</label> : ''}
                <Form.Input
                    disabled={props.disabled}
                    type="number"
                    name="to"
                    value={to}
                    placeholder="to ="
                    style={styles.inputFix}
                    onChange={handleChange}
                    onBlur={handleSubmit}
                    error={errorTo}
                />
            </Form.Field>
        </Form.Group>
    );
};

export {
    inputRange as InputRange
};
