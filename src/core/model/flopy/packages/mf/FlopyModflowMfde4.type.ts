export interface IFlopyModflowMfde4 {
    itmx: number;
    mxup: number;
    mxlow: number;
    mxbw: number;
    ifreq: number;
    mutd4: number;
    accl: number;
    hclose: number;
    iprd4: number;
    extension: 'de4';
    unitnumber: number | null;
    filenames: string | string[] | null;
}
