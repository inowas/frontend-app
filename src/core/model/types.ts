export interface IPropertyValueObject {
    [name: string]: any;
}

export function isTypeOf<T>(arg: any): arg is T {
    return true;
}

export interface IMetaData {
    id: string;
    name: string;
    description: string;
    permissions: string;
    public: boolean;
    tool: string;
}

export interface ISimpleTool<T> extends IMetaData {
    data: T;
}
