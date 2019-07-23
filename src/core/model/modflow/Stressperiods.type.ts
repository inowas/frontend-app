interface IStressPeriod {
    totim_start: number;
    perlen: number;
    nstp: number;
    tsmult: number;
    steady: number;
}

export interface IStressPeriods {
    start_date_time: string;
    end_date_time: string;
    stressperiods: IStressPeriod[];
    time_unit: number;
}
