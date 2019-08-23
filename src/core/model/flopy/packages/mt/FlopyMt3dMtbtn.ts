import FlopyMt3dPackage from './FlopyMt3dPackage';

/**
 * Properties of Btn-Package
 * All values with default null,
 * are optional and will be taken from the MF-Model.
 */
class FlopyMt3dMtbtn extends FlopyMt3dPackage {

    /**
     * @type {boolean}
     * @private
     *
     * MFStyleArr: bool
     * Specifies whether or not to read arrays using the MODFLOW array
     * reader format or the original MT3DMS array reader.
     */
    private _MFStyleArr = false;

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to route mass through dry cells.
     * When MF-NWT is used to generate the flow-transport link file,
     * this is a distinct possibility.
     */
    private _DRYCell = false;

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to use the storage formulation used in MT3DMS.
     */
    private _Legacy99Stor = false;

    /**
     * @type {boolean}
     * @private
     *
     * Specifies if flow-transport link terms (cell-by-cell flows) should be echoed to the MT3D-USGS listing file.
     */
    private _FTLPrint = false;

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to suppress wet/dry messaging in the MT3D-USGS listing file.
     */
    private _NoWetDryPrint = false;

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to include the mass flux terms through
     * dry cells in the mass budget written to the listing file.
     */
    private _OmitDryBud = false;

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to use the MT3DMS formulation (this keyword omitted)
     * for the solid phase, whereby the entire cell thickness is available for interacting
     * with the aqueous phase, even though the aqueous phase may only occupy a portion
     * of the cell’s thickness. When used, only the saturated portion of the cell is available for sorbing.
     */
    private _AltWTSorb = false;

    /**
     * @type {number|null}
     * @private
     *
     * Total number of layers
     */
    private _nlay = null;

    /**
     * @type {number|null}
     * @private
     *
     * Total number of rows
     */
    private _nrow = null;

    /**
     * @type {number|null}
     * @private
     *
     * Total number of columns
     */
    private _ncol = null;

    /**
     * @type {number|null}
     * @private
     *
     * Total number of stressperiods
     */
    private _nper = null;

    /**
     * @type {number|array|null}
     * @private
     *
     * Length of stressperiods
     */
    private _perlen = null;

    /**
     * @type {number|array|null}
     * @private
     *
     * Number of time steps
     */
    private _nstp = null;

    /**
     * @type {number|array|null}
     * @private
     *
     * Time step multiplier
     */
    private _tsmult = null;

    /**
     * @type {number|array|null}
     * @private
     *
     * steady state flag for each stress period
     */
    private _ssflag = null;

    /**
     * @type {number}
     * @private
     *
     * The total number of chemical species in the simulation.
     * (default is None, will be changed to 1 if sconc is single value)
     */
    private _ncomp = 1;

    /**
     * @type {number}
     * @private
     *
     * The total number of ‘mobile’ species (default is 1).
     * mcomp must be equal or less than ncomp.
     */
    private _mcomp = 1;

    /**
     * @type {string}
     * @private
     *
     * The name of unit for time (default is ‘D’, for ‘days’).
     * Used for identification purposes only.
     */
    private _tunit = 'D';

    /**
     * @type {string}
     * @private
     *
     * The name of unit for length (default is ‘M’, for ‘meters’).
     * Used for identification purposes only.
     */
    private _lunit = 'M';

    /**
     * @type {string}
     * @private
     *
     * The name of unit for mass (default is ‘KG’, for ‘kilograms’).
     * Used for identification purposes only.
     */
    private _munit = 'KG';

    /**
     * @type {number|array|null}
     * @private
     */
    private _laycon = null;

    /**
     * @type {number|array|null}
     * @private
     */
    private _delr = null;

    /**
     * @type {number|array|null}
     * @private
     */
    private _delc = null;

    /**
     * @type {number|array|null}
     * @private
     */
    private _htop = null;

    /**
     * @type {number|array|null}
     * @private
     */
    private _dz = null;

    /**
     * @type {number}
     * @private
     *
     * The effective porosity of the porous medium in a single porosity system,
     * or the mobile porosity in a dual-porosity medium (the immobile porosity
     * is defined through the Chemical Reaction Package. (default is 0.25).
     */
    private _prsity = 0.25;

    /**
     * @type {number}
     * @private
     *
     * The icbund array specifies the boundary condition type for solute species
     * (shared by all species).
     *
     * If icbund = 0, the cell is an inactive concentration cell;
     * If icbund < 0, the cell is a constant-concentration cell;
     * If icbund > 0, the cell is an active concentration cell where
     * the concentration value will be calculated. (default is 1).
     */
    private _icbund = 1;

    /**
     * @type {number}
     * @private
     *
     * sconc is the starting concentration for the first species. To specify
     * starting concentrations for other species in a multi-species simulation,
     * include additional keywords, such as sconc2, sconc3, and so forth.
     */
    private _sconc = 0.0;

    /**
     * @type {number}
     * @private
     *
     * The value for indicating an inactive concentration cell. (default is 1e30).
     */
    private _cinact = 1e+30;

    /**
     * @type {number}
     * @private
     *
     * The minimum saturated thickness in a cell, expressed as the decimal
     * fraction of its thickness, below which the cell is considered inactive.
     * (default is 0.01).
     */
    private _thkmin = 0.01;

    /**
     * @type {number}
     * @private
     *
     * A flag/format code indicating how the calculated concentration should
     * be printed to the standard output text file. Format codes for printing
     * are listed in Table 3 of the MT3DMS manual.
     *
     * If ifmtcn > 0 printing is in wrap form;
     * If ifmtcn < 0 printing is in strip form;
     * If ifmtcn = 0 concentrations are not printed.
     * (default is 0).
     */
    private _ifmtcn = 0;

    /**
     * @type {number}
     * @private
     *
     * A flag/format code indicating how the number of particles should be printed
     * to the standard output text file. The convention is the same as for ifmtcn.
     * (default is 0).
     */
    private _ifmtnp = 0;

    /**
     * @type {number}
     * @private
     *
     * A flag/format code indicating how the calculated retardation factor should
     * be printed to the standard output text file.
     * The convention is the same as for ifmtcn.
     * (default is 0).
     */
    private _ifmtrf = 0;

    /**
     * @type {number}
     * @private
     *
     * A flag/format code indicating how the distance-weighted dispersion coefficient
     * should be printed to the standard output text file.
     * The convention is the same as for ifmtcn.
     * (default is 0).
     */
    private _ifmtdp = 0;

    /**
     * @type {boolean}
     * @private
     *
     * A logical flag indicating whether the concentration solution should be saved in an unformatted file.
     * (default is True).
     */
    private _savucn = true;

    /**
     * @type {number}
     * @private
     *
     * A flag indicating
     * (i) the frequency of the output and
     * (ii) whether the output frequency is specified in terms of total elapsed simulation time
     * or the transport step number.
     *
     * If nprs > 0 results will be saved at the times as specified in timprs;
     * If nprs = 0, results will not be saved except at the end of simulation;
     * If NPRS < 0, simulation results will be saved whenever the number of transport steps is an even multiple of nprs.
     * (default is 0).
     */
    private _nprs = 0;

    /**
     * @type {null}
     * @private
     *
     * The total elapsed time at which the simulation results are saved.
     * The number of entries in timprs must equal nprs.
     * (default is None).
     */
    private _timprs = null;

    /**
     * @type {array|null}
     * @private
     *
     * An array with the cell indices (layer, row, column) for which the concentration is to be printed
     * at every transport step.
     * (default is None).
     *
     * obs indices must be entered as zero-based numbers as a 1 is added to them before writing to the btn file.
     */
    private _obs = null;

    /**
     * @type {number}
     * @private
     *
     * An integer indicating how frequently the concentration at the specified observation points should be saved.
     * (default is 1).
     */
    private _nprobs = 1;

    /**
     * @type {boolean}
     * @private
     *
     * A logical flag indicating whether a one-line summary of mass balance information should be printed.
     * (default is True).
     */
    private _chkmas = true;

    /**
     * @type {number}
     * @private
     *
     * An integer indicating how frequently the mass budget information should be saved.
     * (default is 1).
     */
    private _nprmas = 1;

    /**
     * @type {number}
     * @private
     *
     * The user-specified initial transport step size within each time-step of the flow solution.
     * (default is 0).
     */
    private _dt0 = 0;

    /**
     * @type {number}
     * @private
     *
     * The maximum number of transport steps allowed within one time step of the flow solution.
     * (default is 50000).
     */
    private _mxstrn = 50000;

    /**
     * @type {number}
     * @private
     *
     * The multiplier for successive transport steps within a flow time-step
     * if the GCG solver is used and the solution option for the advection term
     * is the standard finite-difference method.
     * (default is 1.0).
     */
    private _ttsmult = 1.0;

    /**
     * @type {number}
     * @private
     *
     * The maximum transport step size allowed when transport step size multiplier TTSMULT > 1.0.
     * (default is 0).
     */
    private _ttsmax = 0;

    /**
     * @type {array|string}
     * @private
     *
     * A list of names for every species in the simulation.
     */
    // tslint:disable-next-line:variable-name
    private _species_names = null;

    /**
     * @type {string}
     * @private
     *
     * Filename extension (default is ‘btn’)
     */
    private _extension = 'btn';

    /**
     * @type {string|null}
     * @private
     *
     * File unit number (default is None).
     */
    private _unitnumber = null;

    /**
     * @type {string|null}
     * @private
     *
     * Filenames to use for the package.
     * If filenames=None the package name will be created using the model name and package extension.
     * If a single string is passed the package will be set to the string.
     * (Default is None).
     */
    private _filenames = null;

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

    get species_names() {
        return this._species_names;
    }

    set species_names(value) {
        this._species_names = value;
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
}

export default FlopyMt3dMtbtn;
