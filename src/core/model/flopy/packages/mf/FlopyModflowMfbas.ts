import {cloneDeep} from 'lodash';
import {IFlopyModflowMfbasType} from './FlopyModflowMfbas.type';

export default class FlopyModflowMfbas {

    get ibound() {
        return this._props.ibound;
    }

    set ibound(value) {
        this._props.ibound = value;
    }

    get strt() {
        return this._props.strt;
    }

    set strt(value) {
        this._props.strt = value;
    }

    get ifrefm() {
        return this._props.ifrefm;
    }

    set ifrefm(value) {
        this._props.ifrefm = value;
    }

    get ixsec() {
        return this._props.ixsec;
    }

    set ixsec(value) {
        this._props.ixsec = value;
    }

    get ichflg() {
        return this._props.ichflg;
    }

    set ichflg(value) {
        this._props.ichflg = value;
    }

    get stoper() {
        return this._props.stoper;
    }

    set stoper(value) {
        this._props.stoper = value;
    }

    get hnoflo() {
        return this._props.hnoflo;
    }

    set hnoflo(value) {
        this._props.hnoflo = value;
    }

    get extension() {
        return this._props.extension;
    }

    set extension(value) {
        this._props.extension = value;
    }

    get unitnumber() {
        return this._props.unitnumber;
    }

    set unitnumber(value) {
        this._props.unitnumber = value;
    }

    get filenames() {
        return this._props.filenames;
    }

    set filenames(value) {
        this._props.filenames = value;
    }

    public static create() {
        return new FlopyModflowMfbas({
            ibound: 1,
            strt: 1.0,
            ifrefm: true,
            ixsec: false,
            ichflg: false,
            stoper: null,
            hnoflo: -999.99,
            extension: 'bas',
            unitnumber: null,
            filenames: null
        });
    }

    public static fromObject(obj: IFlopyModflowMfbasType) {
        return new FlopyModflowMfbas(obj);
    }

    private readonly _props: IFlopyModflowMfbasType;

    constructor(props: IFlopyModflowMfbasType) {
        this._props = props;
    }

    public toObject = () => (cloneDeep(this._props));

    public supportedModflowVersions = () => [
        {name: 'MODFLOW-2005', executable: 'mf2005', version: 'mf2005', default: true},
    ];
}
