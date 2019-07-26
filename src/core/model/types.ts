export interface IPropertyValueObject {
    [name: string]: any;
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
