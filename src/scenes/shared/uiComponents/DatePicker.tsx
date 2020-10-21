import {IRootReducer} from '../../../reducers';
import {useSelector} from 'react-redux';
import React from 'react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';

interface IProps {
    disabled?: boolean;
    inline?: boolean;
    inverted?: boolean;
    label?: string;
    onBlur?: (event?: React.SyntheticEvent) => void;
    onChange?: (event: React.SyntheticEvent) => void;
    pointing?: 'left' | 'right' | 'top left' | 'top right';
    required?: boolean;
    showToday?: boolean;
    datePickerOnly?: boolean;
    size?: string;
    value: Date | null;
}

const DatePicker = (props: IProps) => {
    const dateFormat = useSelector((state: IRootReducer) => state.user.settings.dateFormat);

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <SemanticDatepicker format={dateFormat} {...props}/>
    );
};

export default DatePicker;
