import FlopyMt3dPackage from './FlopyMt3dPackage';

class FlopyMt3dMtrct extends FlopyMt3dPackage {

    get isothm(): number {
        return this._isothm;
    }

    set isothm(value: number) {
        this._isothm = value;
    }

    get ireact(): number {
        return this._ireact;
    }

    set ireact(value: number) {
        this._ireact = value;
    }

    get igetsc(): number {
        return this._igetsc;
    }

    set igetsc(value: number) {
        this._igetsc = value;
    }

    get rhob(): any {
        return this._rhob;
    }

    set rhob(value: any) {
        this._rhob = value;
    }

    get prsity2(): any {
        return this._prsity2;
    }

    set prsity2(value: any) {
        this._prsity2 = value;
    }

    get srconc(): any {
        return this._srconc;
    }

    set srconc(value: any) {
        this._srconc = value;
    }

    get sp1(): any {
        return this._sp1;
    }

    set sp1(value: any) {
        this._sp1 = value;
    }

    get sp2(): any {
        return this._sp2;
    }

    set sp2(value: any) {
        this._sp2 = value;
    }

    get rc1(): any {
        return this._rc1;
    }

    set rc1(value: any) {
        this._rc1 = value;
    }

    get rc2(): any {
        return this._rc2;
    }

    set rc2(value: any) {
        this._rc2 = value;
    }

    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }

    get unitnumber(): any {
        return this._unitnumber;
    }

    set unitnumber(value: any) {
        this._unitnumber = value;
    }

    get filenames(): any {
        return this._filenames;
    }

    set filenames(value: any) {
        this._filenames = value;
    }

    private _isothm: number = 0;
    private _ireact: number = 0;
    private _igetsc: number = 0;
    private _rhob = null;
    private _prsity2 = null;
    private _srconc = null;
    private _sp1 = null;
    private _sp2 = null;
    private _rc1 = null;
    private _rc2 = null;
    private _extension: string = 'rct';
    private _unitnumber = null;
    private _filenames = null;
}

export default FlopyMt3dMtrct;
