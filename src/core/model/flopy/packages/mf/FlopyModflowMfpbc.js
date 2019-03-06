import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfpbc extends FlopyModflowPackage {

    _layer_row_column_data = null;
    _layer_row_column_shead_ehead = null;
    _cosines = null;
    _extension = 'pbc';
    _unitnumber = null;
    _zerobase = true;
    
    get layer_row_column_data() {
        return this._layer_row_column_data;
    }

    set layer_row_column_data(value) {
        this._layer_row_column_data = value;
    }

    get layer_row_column_shead_ehead() {
        return this._layer_row_column_shead_ehead;
    }

    set layer_row_column_shead_ehead(value) {
        this._layer_row_column_shead_ehead = value;
    }

    get cosines() {
        return this._cosines;
    }

    set cosines(value) {
        this._cosines = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
    }

    get unitnumber() {
        return this._unitnumber;
    }

    set unitnumber(value) {
        this._unitnumber = value;
    }

    get zerobase() {
        return this._zerobase;
    }

    set zerobase(value) {
        this._zerobase = value;
    }
}
