export interface IToolMetaData {
    id: string;
    name: string;
    description: string;
    permissions: string;
    public: boolean;
    tool: string;
    type?: string;
    data: any;
}

export interface IToolMetaDataEdit {
    id?: string;
    name: string;
    description: string;
    permissions?: string;
    public: boolean;
    tool: string;
    type?: string;
    data?: any;
}
