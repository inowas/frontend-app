import {IPropertyValueObject} from '../../../types';
import {Transport} from '../../../modflow';
import FlopyMt3dPackage from './FlopyMt3dPackage';

export interface IFlopyMt3dMtBtn extends IPropertyValueObject {
    MFStyleArr: boolean;
    DRYCell: boolean;
    Legacy99Stor: boolean;
    FTLPrint: boolean;
    NoWetDryPrint: boolean;
    OmitDryBud: boolean;
    AltWTSorb: boolean;
    nlay: number | null;
    nrow: number | null;
    ncol: number | null;
    nper: number | null;
    perlen: number | number[] | null;
    nstp: number | number[] | null;
    tsmult: number | number[] | null;
    ssflag: number | number[] | null;
    ncomp: number;
    mcomp: number;
    tunit: string;
    lunit: string;
    munit: string;
    laycon: number | number[] | null;
    delr: number | number[] | null;
    delc: number | number[] | null;
    htop: number | [] | null;
    dz: number | [] | null;
    prsity: number | [];
    icbund: number | [];
    sconc: number;
    cinact: number;
    thkmin: number;
    ifmtcn: number;
    ifmtnp: number;
    ifmtrf: number;
    ifmtdp: number;
    savucn: boolean;
    nprs: number;
    timprs: null;
    obs: [] | null;
    nprobs: number;
    chkmas: boolean;
    nprmas: number;
    dt0: number;
    mxstrn: number;
    ttsmult: number;
    ttsmax: number;
    species_names: string[] | string | null;
    extension: string;
    unitnumber: number | null;
    filenames: string | null;
}

export const defaults: IFlopyMt3dMtBtn = {
    /**
     * @type {boolean}
     * @private
     *
     * MFStyleArr: bool
     * Specifies whether or not to read arrays using the MODFLOW array
     * reader format or the original MT3DMS array reader.
     */
    MFStyleArr: false,

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to route mass through dry cells.
     * When MF-NWT is used to generate the flow-transport link file,
     * this is a distinct possibility.
     */
    DRYCell: false,

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to use the storage formulation used in MT3DMS.
     */
    Legacy99Stor: false,

    /**
     * @type {boolean}
     * @private
     *
     * Specifies if flow-transport link terms (cell-by-cell flows) should be echoed to the MT3D-USGS listing file.
     */
    FTLPrint: false,

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to suppress wet/dry messaging in the MT3D-USGS listing file.
     */
    NoWetDryPrint: false,

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to include the mass flux terms through
     * dry cells in the mass budget written to the listing file.
     */
    OmitDryBud: false,

    /**
     * @type {boolean}
     * @private
     *
     * Specifies whether or not to use the MT3DMS formulation (this keyword omitted)
     * for the solid phase, whereby the entire cell thickness is available for interacting
     * with the aqueous phase, even though the aqueous phase may only occupy a portion
     * of the cell’s thickness. When used, only the saturated portion of the cell is available for sorbing.
     */
    AltWTSorb: false,

    /**
     * @type {number|null}
     * @private
     *
     * Total number of layers
     */
    nlay: null,

    /**
     * @type {number|null}
     * @private
     *
     * Total number of rows
     */
    nrow: null,

    /**
     * @type {number|null}
     * @private
     *
     * Total number of columns
     */
    ncol: null,

    /**
     * @type {number|null}
     * @private
     *
     * Total number of stressperiods
     */
    nper: null,

    /**
     * @type {number|array|null}
     * @private
     *
     * Length of stressperiods
     */
    perlen: null,

    /**
     * @type {number|array|null}
     * @private
     *
     * Number of time steps
     */
    nstp: null,

    /**
     * @type {number|array|null}
     * @private
     *
     * Time step multiplier
     */
    tsmult: null,

    /**
     * @type {number|array|null}
     * @private
     *
     * steady state flag for each stress period
     */
    ssflag: null,

    /**
     * @type {number}
     * @private
     *
     * The total number of chemical species in the simulation.
     * (default is None, will be changed to 1 if sconc is single value)
     */
    ncomp: 1,

    /**
     * @type {number}
     * @private
     *
     * The total number of ‘mobile’ species (default is 1).
     * mcomp must be equal or less than ncomp.
     */
    mcomp: 1,

    /**
     * @type {string}
     * @private
     *
     * The name of unit for time (default is ‘D’, for ‘days’).
     * Used for identification purposes only.
     */
    tunit: 'D',

    /**
     * @type {string}
     * @private
     *
     * The name of unit for length (default is ‘M’, for ‘meters’).
     * Used for identification purposes only.
     */
    lunit: 'M',

    /**
     * @type {string}
     * @private
     *
     * The name of unit for mass (default is ‘KG’, for ‘kilograms’).
     * Used for identification purposes only.
     */
    munit: 'KG',

    /**
     * @type {number|array|null}
     * @private
     */
    laycon: null,

    /**
     * @type {number|array|null}
     * @private
     */
    delr: null,

    /**
     * @type {number|array|null}
     * @private
     */
    delc: null,

    /**
     * @type {number|array|null}
     * @private
     */
    htop: null,

    /**
     * @type {number|array|null}
     * @private
     */
    dz: null,

    /**
     * @type {number}
     * @private
     *
     * The effective porosity of the porous medium in a single porosity system,
     * or the mobile porosity in a dual-porosity medium (the immobile porosity
     * is defined through the Chemical Reaction Package. (default is 0.25).
     */
    prsity: 0.25,

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
    icbund: 1,

    /**
     * @type {number}
     * @private
     *
     * sconc is the starting concentration for the first species. To specify
     * starting concentrations for other species in a multi-species simulation,
     * include additional keywords, such as sconc2, sconc3, and so forth.
     */
    sconc: 0.0,

    /**
     * @type {number}
     * @private
     *
     * The value for indicating an inactive concentration cell. (default is 1e30).
     */
    cinact: 1e+30,

    /**
     * @type {number}
     * @private
     *
     * The minimum saturated thickness in a cell, expressed as the decimal
     * fraction of its thickness, below which the cell is considered inactive.
     * (default is 0.01).
     */
    thkmin: 0.01,

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
    ifmtcn: 0,

    /**
     * @type {number}
     * @private
     *
     * A flag/format code indicating how the number of particles should be printed
     * to the standard output text file. The convention is the same as for ifmtcn.
     * (default is 0).
     */
    ifmtnp: 0,

    /**
     * @type {number}
     * @private
     *
     * A flag/format code indicating how the calculated retardation factor should
     * be printed to the standard output text file.
     * The convention is the same as for ifmtcn.
     * (default is 0).
     */
    ifmtrf: 0,

    /**
     * @type {number}
     * @private
     *
     * A flag/format code indicating how the distance-weighted dispersion coefficient
     * should be printed to the standard output text file.
     * The convention is the same as for ifmtcn.
     * (default is 0).
     */
    ifmtdp: 0,

    /**
     * @type {boolean}
     * @private
     *
     * A logical flag indicating whether the concentration solution should be saved in an unformatted file.
     * (default is True).
     */
    savucn: true,

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
    nprs: 0,

    /**
     * @type {null}
     * @private
     *
     * The total elapsed time at which the simulation results are saved.
     * The number of entries in timprs must equal nprs.
     * (default is None).
     */
    timprs: null,

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
    obs: null,

    /**
     * @type {number}
     * @private
     *
     * An integer indicating how frequently the concentration at the specified observation points should be saved.
     * (default is 1).
     */
    nprobs: 1,

    /**
     * @type {boolean}
     * @private
     *
     * A logical flag indicating whether a one-line summary of mass balance information should be printed.
     * (default is True).
     */
    chkmas: true,

    /**
     * @type {number}
     * @private
     *
     * An integer indicating how frequently the mass budget information should be saved.
     * (default is 1).
     */
    nprmas: 1,

    /**
     * @type {number}
     * @private
     *
     * The user-specified initial transport step size within each time-step of the flow solution.
     * (default is 0).
     */
    dt0: 0,

    /**
     * @type {number}
     * @private
     *
     * The maximum number of transport steps allowed within one time step of the flow solution.
     * (default is 50000).
     */
    mxstrn: 50000,

    /**
     * @type {number}
     * @private
     *
     * The multiplier for successive transport steps within a flow time-step
     * if the GCG solver is used and the solution option for the advection term
     * is the standard finite-difference method.
     * (default is 1.0).
     */
    ttsmult: 1.0,

    /**
     * @type {number}
     * @private
     *
     * The maximum transport step size allowed when transport step size multiplier TTSMULT > 1.0.
     * (default is 0).
     */
    ttsmax: 0,

    /**
     * @type {array|string}
     * @private
     *
     * A list of names for every species in the simulation.
     */
    species_names: null,

    /**
     * @type {string}
     * @private
     *
     * Filename extension (default is ‘btn’)
     */
    extension: 'btn',

    /**
     * @type {string|null}
     * @private
     *
     * File unit number (default is None).
     */
    unitnumber: null,

    /**
     * @type {string|null}
     * @private
     *
     * Filenames to use for the package.
     * If filenames=None the package name will be created using the model name and package extension.
     * If a single string is passed the package will be set to the string.
     * (Default is None).
     */
    filenames: null
};

/**
 * Properties of Btn-Package
 * All values with default null,
 * are optional and will be taken from the MF-Model.
 */
class FlopyMt3dMtbtn extends FlopyMt3dPackage<IFlopyMt3dMtBtn> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyMt3dMtbtn {
        const d: any = FlopyMt3dPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update(transport: Transport) {
        this.ncomp = transport.substances.length;
        this.mcomp = transport.substances.length;
        this.species_names = transport.substances.all.map((s) => s.name);
        return this;
    }

    get MFStyleArr() {
        return this._props.MFStyleArr;
    }

    set MFStyleArr(value) {
        this._props.MFStyleArr = value;
    }

    get DRYCell() {
        return this._props.DRYCell;
    }

    set DRYCell(value) {
        this._props.DRYCell = value;
    }

    get Legacy99Stor() {
        return this._props.Legacy99Stor;
    }

    set Legacy99Stor(value) {
        this._props.Legacy99Stor = value;
    }

    get FTLPrint() {
        return this._props.FTLPrint;
    }

    set FTLPrint(value) {
        this._props.FTLPrint = value;
    }

    get NoWetDryPrint() {
        return this._props.NoWetDryPrint;
    }

    set NoWetDryPrint(value) {
        this._props.NoWetDryPrint = value;
    }

    get OmitDryBud() {
        return this._props.OmitDryBud;
    }

    set OmitDryBud(value) {
        this._props.OmitDryBud = value;
    }

    get AltWTSorb() {
        return this._props.AltWTSorb;
    }

    set AltWTSorb(value) {
        this._props.AltWTSorb = value;
    }

    get nlay() {
        return this._props.nlay;
    }

    set nlay(value) {
        this._props.nlay = value;
    }

    get nrow() {
        return this._props.nrow;
    }

    set nrow(value) {
        this._props.nrow = value;
    }

    get ncol() {
        return this._props.ncol;
    }

    set ncol(value) {
        this._props.ncol = value;
    }

    get nper() {
        return this._props.nper;
    }

    set nper(value) {
        this._props.nper = value;
    }

    get ncomp() {
        return this._props.ncomp;
    }

    set ncomp(value) {
        this._props.ncomp = value;
    }

    get mcomp() {
        return this._props.mcomp;
    }

    set mcomp(value) {
        this._props.mcomp = value;
    }

    get tunit() {
        return this._props.tunit;
    }

    set tunit(value) {
        this._props.tunit = value;
    }

    get lunit() {
        return this._props.lunit;
    }

    set lunit(value) {
        this._props.lunit = value;
    }

    get munit() {
        return this._props.munit;
    }

    set munit(value) {
        this._props.munit = value;
    }

    get laycon() {
        return this._props.laycon;
    }

    set laycon(value) {
        this._props.laycon = value;
    }

    get delr() {
        return this._props.delr;
    }

    set delr(value) {
        this._props.delr = value;
    }

    get delc() {
        return this._props.delc;
    }

    set delc(value) {
        this._props.delc = value;
    }

    get htop() {
        return this._props.htop;
    }

    set htop(value) {
        this._props.htop = value;
    }

    get dz() {
        return this._props.dz;
    }

    set dz(value) {
        this._props.dz = value;
    }

    get prsity() {
        return this._props.prsity;
    }

    set prsity(value) {
        this._props.prsity = value;
    }

    get icbund() {
        return this._props.icbund;
    }

    set icbund(value) {
        this._props.icbund = value;
    }

    get sconc() {
        return this._props.sconc;
    }

    set sconc(value) {
        this._props.sconc = value;
    }

    get cinact() {
        return this._props.cinact;
    }

    set cinact(value) {
        this._props.cinact = value;
    }

    get thkmin() {
        return this._props.thkmin;
    }

    set thkmin(value) {
        this._props.thkmin = value;
    }

    get ifmtcn() {
        return this._props.ifmtcn;
    }

    set ifmtcn(value) {
        this._props.ifmtcn = value;
    }

    get ifmtnp() {
        return this._props.ifmtnp;
    }

    set ifmtnp(value) {
        this._props.ifmtnp = value;
    }

    get ifmtrf() {
        return this._props.ifmtrf;
    }

    set ifmtrf(value) {
        this._props.ifmtrf = value;
    }

    get ifmtdp() {
        return this._props.ifmtdp;
    }

    set ifmtdp(value) {
        this._props.ifmtdp = value;
    }

    get savucn() {
        return this._props.savucn;
    }

    set savucn(value) {
        this._props.savucn = value;
    }

    get nprs() {
        return this._props.nprs;
    }

    set nprs(value) {
        this._props.nprs = value;
    }

    get timprs() {
        return this._props.timprs;
    }

    set timprs(value) {
        this._props.timprs = value;
    }

    get obs() {
        return this._props.obs;
    }

    set obs(value) {
        this._props.obs = value;
    }

    get nprobs() {
        return this._props.nprobs;
    }

    set nprobs(value) {
        this._props.nprobs = value;
    }

    get chkmas() {
        return this._props.chkmas;
    }

    set chkmas(value) {
        this._props.chkmas = value;
    }

    get nprmas() {
        return this._props.nprmas;
    }

    set nprmas(value) {
        this._props.nprmas = value;
    }

    get perlen() {
        return this._props.perlen;
    }

    set perlen(value) {
        this._props.perlen = value;
    }

    get nstp() {
        return this._props.nstp;
    }

    set nstp(value) {
        this._props.nstp = value;
    }

    get tsmult() {
        return this._props.tsmult;
    }

    set tsmult(value) {
        this._props.tsmult = value;
    }

    get ssflag() {
        return this._props.ssflag;
    }

    set ssflag(value) {
        this._props.ssflag = value;
    }

    get dt0() {
        return this._props.dt0;
    }

    set dt0(value) {
        this._props.dt0 = value;
    }

    get mxstrn() {
        return this._props.mxstrn;
    }

    set mxstrn(value) {
        this._props.mxstrn = value;
    }

    get ttsmult() {
        return this._props.ttsmult;
    }

    set ttsmult(value) {
        this._props.ttsmult = value;
    }

    get ttsmax() {
        return this._props.ttsmax;
    }

    set ttsmax(value) {
        this._props.ttsmax = value;
    }

    get species_names() {
        return this._props.species_names;
    }

    set species_names(value) {
        this._props.species_names = value;
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
}

export default FlopyMt3dMtbtn;
