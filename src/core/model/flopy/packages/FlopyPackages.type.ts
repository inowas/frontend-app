import {IFlopyModflow} from './mf/FlopyModflow.type';

export interface IFlopyPackages {
    model_id: string;
    version: string;
    author: string;
    project: string;
    mf: IFlopyModflow;
    mp?: any;
    mt?: any;
    swt?: any;
}

export interface IFlopyCalculation {
    author: string;
    project: string;
    version: string;
    calculation_id: string;
    model_id: string;
    data: {
        mf: IFlopyModflow;
        mp?: any;
        mt?: any;
        swt?: any;
    };
}
