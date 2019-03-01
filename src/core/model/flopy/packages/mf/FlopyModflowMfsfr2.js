import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfsfr2 extends FlopyModflowPackage {

    _nstrm = -2;
    _nss = 1;
    _nsfrpar = 0;
    _nparseg = 0;
    _const = null;
    _dleak = 0.0001;
    _ipakcb = null;
    _istcb2 = null;
    _isfropt = 0;
    _nstrail = 10;
    _isuzn = 1;
    _nsfrsets = 30;
    _irtflg = 0;
    _numtim = 2;
    _weight = 0.75;
    _flwtol = 0.0001;
    _reach_data = null;
    _segment_data = null;
    _channel_geometry_data = null;
    _channel_flow_data = null;
    _dataset_5 = null;
    _irdflag = 0;
    _iptflag = 0;
    _reachinput = false;
    _transroute = false;
    _tabfiles = false;
    _tabfiles_dict = null;
    _extension = 'sfr';
    _unit_number = null;
    _filenames = null;

    get nstrm() {
        return this._nstrm;
    }

    set nstrm(value) {
        this._nstrm = value;
    }

    get nss() {
        return this._nss;
    }

    set nss(value) {
        this._nss = value;
    }

    get nsfrpar() {
        return this._nsfrpar;
    }

    set nsfrpar(value) {
        this._nsfrpar = value;
    }

    get nparseg() {
        return this._nparseg;
    }

    set nparseg(value) {
        this._nparseg = value;
    }

    get const() {
        return this._const;
    }

    set const(value) {
        this._const = value;
    }

    get dleak() {
        return this._dleak;
    }

    set dleak(value) {
        this._dleak = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get istcb2() {
        return this._istcb2;
    }

    set istcb2(value) {
        this._istcb2 = value;
    }

    get isfropt() {
        return this._isfropt;
    }

    set isfropt(value) {
        this._isfropt = value;
    }

    get nstrail() {
        return this._nstrail;
    }

    set nstrail(value) {
        this._nstrail = value;
    }

    get isuzn() {
        return this._isuzn;
    }

    set isuzn(value) {
        this._isuzn = value;
    }

    get nsfrsets() {
        return this._nsfrsets;
    }

    set nsfrsets(value) {
        this._nsfrsets = value;
    }

    get irtflg() {
        return this._irtflg;
    }

    set irtflg(value) {
        this._irtflg = value;
    }

    get numtim() {
        return this._numtim;
    }

    set numtim(value) {
        this._numtim = value;
    }

    get weight() {
        return this._weight;
    }

    set weight(value) {
        this._weight = value;
    }

    get flwtol() {
        return this._flwtol;
    }

    set flwtol(value) {
        this._flwtol = value;
    }

    get reach_data() {
        return this._reach_data;
    }

    set reach_data(value) {
        this._reach_data = value;
    }

    get segment_data() {
        return this._segment_data;
    }

    set segment_data(value) {
        this._segment_data = value;
    }

    get channel_geometry_data() {
        return this._channel_geometry_data;
    }

    set channel_geometry_data(value) {
        this._channel_geometry_data = value;
    }

    get channel_flow_data() {
        return this._channel_flow_data;
    }

    set channel_flow_data(value) {
        this._channel_flow_data = value;
    }

    get dataset_5() {
        return this._dataset_5;
    }

    set dataset_5(value) {
        this._dataset_5 = value;
    }

    get irdflag() {
        return this._irdflag;
    }

    set irdflag(value) {
        this._irdflag = value;
    }

    get iptflag() {
        return this._iptflag;
    }

    set iptflag(value) {
        this._iptflag = value;
    }

    get reachinput() {
        return this._reachinput;
    }

    set reachinput(value) {
        this._reachinput = value;
    }

    get transroute() {
        return this._transroute;
    }

    set transroute(value) {
        this._transroute = value;
    }

    get tabfiles() {
        return this._tabfiles;
    }

    set tabfiles(value) {
        this._tabfiles = value;
    }

    get tabfiles_dict() {
        return this._tabfiles_dict;
    }

    set tabfiles_dict(value) {
        this._tabfiles_dict = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
    }

    get unit_number() {
        return this._unit_number;
    }

    set unit_number(value) {
        this._unit_number = value;
    }

    get filenames() {
        return this._filenames;
    }

    set filenames(value) {
        this._filenames = value;
    }
}
