import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfhob extends FlopyModflowPackage {

    _tomulth = 1.0;
    _obsname = 'HOBS';
    _layer = 0;
    _row = 0;
    _column = 0;
    _irefsp = null;
    _roff = 0.0;
    _coff = 0.0;
    _itt = 1;
    _mlay = null;
    _time_series_data = null;
    _names = null;

    get tomulth() {
        return this._tomulth;
    }

    set tomulth(value) {
        this._tomulth = value;
    }

    get obsname() {
        return this._obsname;
    }

    set obsname(value) {
        this._obsname = value;
    }

    get layer() {
        return this._layer;
    }

    set layer(value) {
        this._layer = value;
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value;
    }

    get column() {
        return this._column;
    }

    set column(value) {
        this._column = value;
    }

    get irefsp() {
        return this._irefsp;
    }

    set irefsp(value) {
        this._irefsp = value;
    }

    get roff() {
        return this._roff;
    }

    set roff(value) {
        this._roff = value;
    }

    get coff() {
        return this._coff;
    }

    set coff(value) {
        this._coff = value;
    }

    get itt() {
        return this._itt;
    }

    set itt(value) {
        this._itt = value;
    }

    get mlay() {
        return this._mlay;
    }

    set mlay(value) {
        this._mlay = value;
    }

    get time_series_data() {
        return this._time_series_data;
    }

    set time_series_data(value) {
        this._time_series_data = value;
    }

    get names() {
        return this._names;
    }

    set names(value) {
        this._names = value;
    }
}
