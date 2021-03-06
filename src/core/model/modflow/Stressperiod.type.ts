export interface IStressPeriod {
    start_date_time: string; // ISOString || ex: 2013-02-04T22:44:30.652Z
    nstp: number;
    tsmult: number;
    steady: boolean;
}

export interface IStressPeriodWithTotim {
    totim_start: number;
    perlen: number;
    nstp: number;
    tsmult: number;
    steady: boolean;
}
