export interface IDataDropperFile {
    filename: string;
    server: string;
}

export interface IDataDropperData<T> {
    file: IDataDropperFile | null;
    fetching?: boolean;
    fetched?: boolean;
    error?: any;
    data?: T;
}
