import {IFlopyModflowMf} from './FlopyModflowMf';
import {IFlopyModflowMfbas} from './FlopyModflowMfbas';
import {IFlopyModflowMfbcf} from './FlopyModflowMfbcf';
import {IFlopyModflowMfchd} from './FlopyModflowMfchd';
import {IFlopyModflowMfde4} from './FlopyModflowMfde4';
import {IFlopyModflowMfdis} from './FlopyModflowMfdis';
import {IFlopyModflowMfdrn} from './FlopyModflowMfdrn';
import {IFlopyModflowMfevt} from './FlopyModflowMfevt';
import {IFlopyModflowMffhb} from './FlopyModflowMffhb';
import {IFlopyModflowMfghb} from './FlopyModflowMfghb';
import {IFlopyModflowMfgmg} from './FlopyModflowMfgmg';
import {IFlopyModflowMfhfb} from './FlopyModflowMfhfb';
import {IFlopyModflowMfhob} from './FlopyModflowMfhob';
import {IFlopyModflowMflak} from './FlopyModflowMflak';
import {IFlopyModflowMflmt} from './FlopyModflowMflmt';
import {IFlopyModflowMflpf} from './FlopyModflowMflpf';
import {IFlopyModflowMfnwt} from './FlopyModflowMfnwt';
import {IFlopyModflowMfoc} from './FlopyModflowMfoc';
import {IFlopyModflowMfpcg} from './FlopyModflowMfpcg';
import {IFlopyModflowMfpcgn} from './FlopyModflowMfpcgn';
import {IFlopyModflowMfrch} from './FlopyModflowMfrch';
import {IFlopyModflowMfriv} from './FlopyModflowMfriv';
import {IFlopyModflowMfsip} from './FlopyModflowMfsip';
import {IFlopyModflowMfsms} from './FlopyModflowMfsms';
import {IFlopyModflowMfsor} from './FlopyModflowMfsor';
import {IFlopyModflowMfstr} from './FlopyModflowMfstr';
import {IFlopyModflowMfswi2} from './FlopyModflowMfswi2';
import {IFlopyModflowMfupw} from './FlopyModflowMfupw';
import {IFlopyModflowMfuzf1} from './FlopyModflowMfuzf1';
import {IFlopyModflowMfwel} from './FlopyModflowMfwel';
import {IPropertyValueObject} from '../../../types';

export interface IStressPeriodData<T> {
    [key: number]: T;
}

export type IFlopyModflowPackage = IFlopyModflowMf | IFlopyModflowMfbas | IFlopyModflowMfdis | IFlopyModflowMfoc |
    IFlopyModflowMfbcf | IFlopyModflowMfchd | IFlopyModflowMfde4 | IFlopyModflowMfdrn | IFlopyModflowMfevt |
    IFlopyModflowMffhb | IFlopyModflowMfghb | IFlopyModflowMfgmg | IFlopyModflowMfhfb | IFlopyModflowMfhob |
    IFlopyModflowMflak | IFlopyModflowMflmt | IFlopyModflowMflpf | IFlopyModflowMfnwt | IFlopyModflowMfpcg |
    IFlopyModflowMfpcgn | IFlopyModflowMfrch | IFlopyModflowMfriv | IFlopyModflowMfsip | IFlopyModflowMfsms |
    IFlopyModflowMfsor | IFlopyModflowMfstr | IFlopyModflowMfswi2 | IFlopyModflowMfupw | IFlopyModflowMfuzf1 |
    IFlopyModflowMfwel;

export interface IFlopyModflow extends IPropertyValueObject {
    mf: IFlopyModflowMf;
    bas: IFlopyModflowMfbas;
    dis: IFlopyModflowMfdis;
    oc: IFlopyModflowMfoc;

    bcf?: IFlopyModflowMfbcf;
    chd?: IFlopyModflowMfchd;
    de4?: IFlopyModflowMfde4;
    drn?: IFlopyModflowMfdrn;
    evt?: IFlopyModflowMfevt;
    fhb?: IFlopyModflowMffhb;
    ghb?: IFlopyModflowMfghb;
    gmg?: IFlopyModflowMfgmg;
    hfb?: IFlopyModflowMfhfb;
    hob?: IFlopyModflowMfhob;
    lak?: IFlopyModflowMflak;
    lmt?: IFlopyModflowMflmt;
    lpf?: IFlopyModflowMflpf;
    nwt?: IFlopyModflowMfnwt;
    pcg?: IFlopyModflowMfpcg;
    pcgn?: IFlopyModflowMfpcgn;
    rch?: IFlopyModflowMfrch;
    riv?: IFlopyModflowMfriv;
    sip?: IFlopyModflowMfsip;
    sms?: IFlopyModflowMfsms;
    sor?: IFlopyModflowMfsor;
    str?: IFlopyModflowMfstr;
    swi2?: IFlopyModflowMfswi2;
    upw?: IFlopyModflowMfupw;
    uzf1?: IFlopyModflowMfuzf1;
    wel?: IFlopyModflowMfwel;
}
