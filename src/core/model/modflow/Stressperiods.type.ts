import {IStressPeriod} from './Stressperiod.type';
import {ITimeUnit} from './TimeUnit.type';

export interface IStressPeriods {
    start_date_time: string;
    end_date_time: string;
    stressperiods: IStressPeriod[];
    time_unit: ITimeUnit;
}
