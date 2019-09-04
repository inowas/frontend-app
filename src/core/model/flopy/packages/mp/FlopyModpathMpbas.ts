import {Array2D} from '../../../geometry/Array2D.type';
import {IPropertyValueObject} from '../../../types';
import FlopyModpathMp from './FlopyModpathMp';
import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMpbas extends FlopyModpathPackage {
    private _model: FlopyModpathMp | null = null;
    private _hnoflo: number = -9999.0;
    private _hdry: number = -8888.0;
    private _def_face_ct: number = 0;
    private _bud_label: string | null = null;
    private _defaultiface: IPropertyValueObject | null = null;
    private _laytyp: number = 0;
    private _ibound: number = 1;
    private _prsity: number | Array2D<number> = 0.3;
    private _prsity_CB: number = 0.3;
    private _extension: string = 'mpbas';
    private _unitnumber: number = 86;

    get model(): FlopyModpathMp | null {
        return this._model;
    }

    set model(value: FlopyModpathMp | null) {
        this._model = value;
    }

    get hnoflo(): number {
        return this._hnoflo;
    }

    set hnoflo(value: number) {
        this._hnoflo = value;
    }

    get hdry(): number {
        return this._hdry;
    }

    set hdry(value: number) {
        this._hdry = value;
    }

    get def_face_ct(): number {
        return this._def_face_ct;
    }

    set def_face_ct(value: number) {
        this._def_face_ct = value;
    }

    get bud_label(): string | null {
        return this._bud_label;
    }

    set bud_label(value: string | null) {
        this._bud_label = value;
    }

    get defaultiface(): IPropertyValueObject | null {
        return this._defaultiface;
    }

    set defaultiface(value: IPropertyValueObject | null) {
        this._defaultiface = value;
    }

    get prsity_CB(): number {
        return this._prsity_CB;
    }

    set prsity_CB(value: number) {
        this._prsity_CB = value;
    }

    get laytyp(): number {
        return this._laytyp;
    }

    set laytyp(value: number) {
        this._laytyp = value;
    }

    get ibound(): number {
        return this._ibound;
    }

    set ibound(value: number) {
        this._ibound = value;
    }

    get prsity(): number | Array2D<number> {
        return this._prsity;
    }

    set prsity(value: number | Array2D<number>) {
        this._prsity = value;
    }

    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }

    get unitnumber(): number {
        return this._unitnumber;
    }

    set unitnumber(value: number) {
        this._unitnumber = value;
    }
}
