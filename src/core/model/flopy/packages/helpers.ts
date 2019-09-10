import {IPropertyValueObject} from '../../types';

export const arrayToObject = (array: any[]) => {
    const obj: IPropertyValueObject = {};
    array.forEach((item, idx) => {
        obj[idx] = item;
    });
    return obj;
};