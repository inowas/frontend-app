export interface IFlopyModflowMfdis {
    nlay: number;
    nrow: number;
    ncol: number;
    nper: number;
    delr: number | number[];
    delc: number | number[];
    laycbd: number | number[];
    top: number | number[][];
    botm: number | number[][][];
    perlen: number | number[];
    nstp: number | number[];
    tsmult: number | number[];
    steady: boolean | boolean[];
    itmuni: number;
    lenuni: number;
    extension: 'dis';
    unitnumber: number | null;
    filenames: string | string[] | null;
    xul: number | null;
    yul: number | null;
    rotation: number;
    proj4_str: string | null;
    start_datetime: string | null;
}
