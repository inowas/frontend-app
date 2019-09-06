export interface IFlopyModflowMfbasType {
    ibound: number;
    strt: number;
    ifrefm: boolean;
    ixsec: boolean;
    ichflg: boolean;
    stoper: number | null;
    hnoflo: number;
    extension: string | null;
    unitnumber: number | null;
    filenames: string | string[] | null;
}
