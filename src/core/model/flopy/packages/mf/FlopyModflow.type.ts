import {IFlopyModflowMf} from './FlopyModflowMf';
import {IFlopyModflowMfbas} from './FlopyModflowMfbas';
import {IFlopyModflowMfbcf} from './FlopyModflowMfbcf';
import {IFlopyModflowMfchd} from './FlopyModflowMfchd';

export interface IStressPeriodData<T> {
    [key: number]: T;
}

type IPackage = IFlopyModflowMf | IFlopyModflowMfbas | IFlopyModflowMfbcf | IFlopyModflowMfchd;

export interface IFlopyModflow {
    [type: string]: IPackage;
}
