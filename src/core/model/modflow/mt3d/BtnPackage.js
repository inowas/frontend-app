import AbstractMt3dPackage from './AbstractMt3dPackage';

class BtnPackage extends AbstractMt3dPackage {

    _MFStyleArr = false;
    _DRYCell = false;
    _Legacy99Stor = false;
    _FTLPrint = false;
    _NoWetDryPrint = false;
    _OmitDryBud = false;
    _AltWTSorb = false;
    _nlay = null;
    _nrow = null;
    _ncol = null;
    _nper = null;
    _ncomp = 1;
    _mcomp = 1;
    _tunit = 'D';
    _lunit = 'M';
    _munit = 'KG';
    _laycon = null;
    _delr = null;
    _delc = null;
    _htop = null;
    _dz = null;
    _prsity = 0.3;
    _icbund = 1;
    _sconc = 0.0;
    _cinact = 1e+30;
    _thkmin = 0.01;
    _ifmtcn = 0;
    _ifmtnp = 0;
    _ifmtrf = 0;
    _ifmtdp = 0;
    _savucn = true;
    _nprs = 0;
    _timprs = null;
    _obs = null;
    _nprobs = 1;
    _chkmas = true;
    _nprmas = 1;
    _perlen = null;
    _nstp = null;
    _tsmult = null;
    _ssflag = null;
    _dt0 = 0;
    _mxstrn = 50000;
    _ttsmult = 1.0;
    _ttsmax = 0;
    _speciesNames = null;
    _extension = 'btn';
    _unitnumber = null;
    _filenames = null;

    static fromDefault() {
        return new BtnPackage();
    }

    static fromObject(obj) {
        const btn = new BtnPackage();
        btn.metaDataFromObject(obj);
        btn.MFStyleArr = obj.MFStyleArr;
        btn.DRYCell = obj.DRYCell;
        btn.Legacy99Stor = obj.Legacy99Stor;
        btn.FTLPrint = obj.FTLPrint;
        btn.NoWetDryPrint = obj.NoWetDryPrint;
        btn.OmitDryBud = obj.OmitDryBud;
        btn.AltWTSorb = obj.AltWTSorb;
        btn.nlay = obj.nlay;
        btn.nrow = obj.nrow;
        btn.ncol = obj.ncol;
        btn.nper = obj.nper;
        btn.ncomp = obj.ncomp;
        btn.mcomp = obj.mcomp;
        btn.tunit = obj.tunit;
        btn.lunit = obj.lunit;
        btn.munit = obj.munit;
        btn.laycon = obj.laycon;
        btn.delr = obj.delr;
        btn.delc = obj.delc;
        btn.htop = obj.htop;
        btn.dz = obj.dz;
        btn.prsity = obj.prsity;
        btn.icbund = obj.icbund;
        btn.sconc = obj.sconc;
        btn.cinact = obj.cinact;
        btn.thkmin = obj.thkmin;
        btn.ifmtcn = obj.ifmtcn;
        btn.ifmtnp = obj.ifmtnp;
        btn.ifmtrf = obj.ifmtrf;
        btn.ifmtdp = obj.ifmtdp;
        btn.savucn = obj.savucn;
        btn.nprs = obj.nprs;
        btn.timprs = obj.timprs;
        btn.obs = obj.obs;
        btn.nprobs = obj.nprobs;
        btn.chkmas = obj.chkmas;
        btn.nprmas = obj.nprmas;
        btn.perlen = obj.perlen;
        btn.nstp = obj.nstp;
        btn.tsmult = obj.tsmult;
        btn.ssflag = obj.ssflag;
        btn.dt0 = obj.dt0;
        btn.mxstrn = obj.mxstrn;
        btn.ttsmult = obj.ttsmult;
        btn.ttsmax = obj.ttsmax;
        btn.speciesNames = obj.species_names;
        btn.extension = obj.extension;
        btn.unitnumber = obj.unitnumber;
        btn.filenames = obj.filenames;
        return btn;
    }

    constructor() {
        super('btn');
    }

    get MFStyleArr() {
        return this._MFStyleArr;
    }

    set MFStyleArr(value) {
        this._MFStyleArr = value;
    }

    get DRYCell() {
        return this._DRYCell;
    }

    set DRYCell(value) {
        this._DRYCell = value;
    }

    get Legacy99Stor() {
        return this._Legacy99Stor;
    }

    set Legacy99Stor(value) {
        this._Legacy99Stor = value;
    }

    get FTLPrint() {
        return this._FTLPrint;
    }

    set FTLPrint(value) {
        this._FTLPrint = value;
    }

    get NoWetDryPrint() {
        return this._NoWetDryPrint;
    }

    set NoWetDryPrint(value) {
        this._NoWetDryPrint = value;
    }

    get OmitDryBud() {
        return this._OmitDryBud;
    }

    set OmitDryBud(value) {
        this._OmitDryBud = value;
    }

    get AltWTSorb() {
        return this._AltWTSorb;
    }

    set AltWTSorb(value) {
        this._AltWTSorb = value;
    }

    get nlay() {
        return this._nlay;
    }

    set nlay(value) {
        this._nlay = value;
    }

    get nrow() {
        return this._nrow;
    }

    set nrow(value) {
        this._nrow = value;
    }

    get ncol() {
        return this._ncol;
    }

    set ncol(value) {
        this._ncol = value;
    }

    get nper() {
        return this._nper;
    }

    set nper(value) {
        this._nper = value;
    }

    get ncomp() {
        return this._ncomp;
    }

    set ncomp(value) {
        this._ncomp = value;
    }

    get mcomp() {
        return this._mcomp;
    }

    set mcomp(value) {
        this._mcomp = value;
    }

    get tunit() {
        return this._tunit;
    }

    set tunit(value) {
        this._tunit = value;
    }

    get lunit() {
        return this._lunit;
    }

    set lunit(value) {
        this._lunit = value;
    }

    get munit() {
        return this._munit;
    }

    set munit(value) {
        this._munit = value;
    }

    get laycon() {
        return this._laycon;
    }

    set laycon(value) {
        this._laycon = value;
    }

    get delr() {
        return this._delr;
    }

    set delr(value) {
        this._delr = value;
    }

    get delc() {
        return this._delc;
    }

    set delc(value) {
        this._delc = value;
    }

    get htop() {
        return this._htop;
    }

    set htop(value) {
        this._htop = value;
    }

    get dz() {
        return this._dz;
    }

    set dz(value) {
        this._dz = value;
    }

    get prsity() {
        return this._prsity;
    }

    set prsity(value) {
        this._prsity = value;
    }

    get icbund() {
        return this._icbund;
    }

    set icbund(value) {
        this._icbund = value;
    }

    get sconc() {
        return this._sconc;
    }

    set sconc(value) {
        this._sconc = value;
    }

    get cinact() {
        return this._cinact;
    }

    set cinact(value) {
        this._cinact = value;
    }

    get thkmin() {
        return this._thkmin;
    }

    set thkmin(value) {
        this._thkmin = value;
    }

    get ifmtcn() {
        return this._ifmtcn;
    }

    set ifmtcn(value) {
        this._ifmtcn = value;
    }

    get ifmtnp() {
        return this._ifmtnp;
    }

    set ifmtnp(value) {
        this._ifmtnp = value;
    }

    get ifmtrf() {
        return this._ifmtrf;
    }

    set ifmtrf(value) {
        this._ifmtrf = value;
    }

    get ifmtdp() {
        return this._ifmtdp;
    }

    set ifmtdp(value) {
        this._ifmtdp = value;
    }

    get savucn() {
        return this._savucn;
    }

    set savucn(value) {
        this._savucn = value;
    }

    get nprs() {
        return this._nprs;
    }

    set nprs(value) {
        this._nprs = value;
    }

    get timprs() {
        return this._timprs;
    }

    set timprs(value) {
        this._timprs = value;
    }

    get obs() {
        return this._obs;
    }

    set obs(value) {
        this._obs = value;
    }

    get nprobs() {
        return this._nprobs;
    }

    set nprobs(value) {
        this._nprobs = value;
    }

    get chkmas() {
        return this._chkmas;
    }

    set chkmas(value) {
        this._chkmas = value;
    }

    get nprmas() {
        return this._nprmas;
    }

    set nprmas(value) {
        this._nprmas = value;
    }

    get perlen() {
        return this._perlen;
    }

    set perlen(value) {
        this._perlen = value;
    }

    get nstp() {
        return this._nstp;
    }

    set nstp(value) {
        this._nstp = value;
    }

    get tsmult() {
        return this._tsmult;
    }

    set tsmult(value) {
        this._tsmult = value;
    }

    get ssflag() {
        return this._ssflag;
    }

    set ssflag(value) {
        this._ssflag = value;
    }

    get dt0() {
        return this._dt0;
    }

    set dt0(value) {
        this._dt0 = value;
    }

    get mxstrn() {
        return this._mxstrn;
    }

    set mxstrn(value) {
        this._mxstrn = value;
    }

    get ttsmult() {
        return this._ttsmult;
    }

    set ttsmult(value) {
        this._ttsmult = value;
    }

    get ttsmax() {
        return this._ttsmax;
    }

    set ttsmax(value) {
        this._ttsmax = value;
    }

    get speciesNames() {
        return this._speciesNames;
    }

    set speciesNames(value) {
        this._speciesNames = value;
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

    get filenames() {
        return this._filenames;
    }

    set filenames(value) {
        this._filenames = value;
    }

    toObject() {
        const obj = super.toObject();
        obj.MFStyleArr = this.MFStyleArr;
        obj.DRYCell = this.DRYCell;
        obj.Legacy99Stor = this.Legacy99Stor;
        obj.FTLPrint = this.FTLPrint;
        obj.NoWetDryPrint = this.NoWetDryPrint;
        obj.OmitDryBud = this.OmitDryBud;
        obj.AltWTSorb = this.AltWTSorb;
        obj.nlay = this.nlay;
        obj.nrow = this.nrow;
        obj.ncol = this.ncol;
        obj.nper = this.nper;
        obj.ncomp = this.ncomp;
        obj.mcomp = this.mcomp;
        obj.tunit = this.tunit;
        obj.lunit = this.lunit;
        obj.munit = this.munit;
        obj.laycon = this.laycon;
        obj.delr = this.delr;
        obj.delc = this.delc;
        obj.htop = this.htop;
        obj.dz = this.dz;
        obj.prsity = this.prsity;
        obj.icbund = this.icbund;
        obj.sconc = this.sconc;
        obj.cinact = this.cinact;
        obj.thkmin = this.thkmin;
        obj.ifmtcn = this.ifmtcn;
        obj.ifmtnp = this.ifmtnp;
        obj.ifmtrf = this.ifmtrf;
        obj.ifmtdp = this.ifmtdp;
        obj.savucn = this.savucn;
        obj.nprs = this.nprs;
        obj.timprs = this.timprs;
        obj.obs = this.obs;
        obj.nprobs = this.nprobs;
        obj.chkmas = this.chkmas;
        obj.nprmas = this.nprmas;
        obj.perlen = this.perlen;
        obj.nstp = this.nstp;
        obj.tsmult = this.tsmult;
        obj.ssflag = this.ssflag;
        obj.dt0 = this.dt0;
        obj.mxstrn = this.mxstrn;
        obj.ttsmult = this.ttsmult;
        obj.ttsmax = this.ttsmax;
        obj.species_names = this.speciesNames;
        obj.extension = this.extension;
        obj.unitnumber = this.unitnumber;
        obj.filenames = this.filenames;
        return obj;
    }
}

export default BtnPackage;
