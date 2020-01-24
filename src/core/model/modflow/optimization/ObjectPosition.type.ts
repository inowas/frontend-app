interface IMinMaxResult {
    min: number;
    max: number;
    result: null | number;
}

export interface IObjectPosition {
    lay: IMinMaxResult;
    row: IMinMaxResult;
    col: IMinMaxResult;
}
