export interface IPropertyValueObject {
    [name: string]: any;
}

export function isTypeOf<T>(arg: any): arg is T {
    return true;
}
