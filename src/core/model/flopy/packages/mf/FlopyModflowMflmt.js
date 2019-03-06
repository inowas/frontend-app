import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMflmt extends FlopyModflowPackage {

    _output_file_name = 'mt3d_link.ftl';
    _output_file_unit = 54;
    _output_file_header = 'extended';
    _output_file_format = 'unformatted';
    _extension = 'lmt6';
    _package_flows = [];
    _unitnumber = null;
    _filenames = null;

    get output_file_name() {
        return this._output_file_name;
    }

    set output_file_name(value) {
        this._output_file_name = value;
    }

    get output_file_unit() {
        return this._output_file_unit;
    }

    set output_file_unit(value) {
        this._output_file_unit = value;
    }

    get output_file_header() {
        return this._output_file_header;
    }

    set output_file_header(value) {
        this._output_file_header = value;
    }

    get output_file_format() {
        return this._output_file_format;
    }

    set output_file_format(value) {
        this._output_file_format = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
    }

    get package_flows() {
        return this._package_flows;
    }

    set package_flows(value) {
        this._package_flows = value;
    }

    get unitnumber() {
        return this._unitnumber;
    }

    set unitnumber(value) {
        this._unitnumber = value;
    }

    get filenames() {
        return this._filenames;
    }

    set filenames(value) {
        this._filenames = value;
    }
}
