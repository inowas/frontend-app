import FlopyModpathMp from './FlopyModpathMp';
import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMpsim extends FlopyModpathPackage {

    get model(): FlopyModpathMp | null {
        return this._model;
    }

    set model(value: FlopyModpathMp | null) {
        this._model = value;
    }

    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }

    get simulationsType(): number {
        return this._option_flag[0];
    }

    set simulationType(value: number) {
        this._option_flag[0] = value;
    }

    get trackingDirection(): number {
        return this._option_flag[1];
    }

    set trackingDirection(value: number) {
        this._option_flag[1] = value;
    }

    get weakSinkOption(): number {
        return this._option_flag[2];
    }

    set weakSinkOption(value: number) {
        this._option_flag[2] = value;
    }

    get weakSourceOption(): number {
        return this._option_flag[3];
    }

    set weakSourceOption(value: number) {
        this._option_flag[3] = value;
    }

    get referenceTimeOption(): number {
        return this._option_flag[4];
    }

    set referenceTimeOption(value: number) {
        this._option_flag[4] = value;
    }

    get stopOption(): number {
        return this._option_flag[5];
    }

    set stopOption(value: number) {
        this._option_flag[5] = value;
    }

    get particleGenerationOption(): number {
        return this._option_flag[6];
    }

    set particleGenerationOption(value: number) {
        this._option_flag[6] = value;
    }

    get timePointOption(): number {
        return this._option_flag[7];
    }

    set timePointOption(value: number) {
        this._option_flag[7] = value;
    }

    get budgetOutputOption(): number {
        return this._option_flag[8];
    }

    set budgetOutputOption(value: number) {
        this._option_flag[8] = value;
    }

    get zoneArrayOption(): number {
        return this._option_flag[9];
    }

    set zoneArrayOption(value: number) {
        this._option_flag[9] = value;
    }

    get retardationOption(): number {
        return this._option_flag[10];
    }

    set retardationOption(value: number) {
        this._option_flag[10] = value;
    }

    get advectiveObservationsOption(): number {
        return this._option_flag[11];
    }

    set advectiveObservationsOption(value: number) {
        this._option_flag[11] = value;
    }

    // Option Flags
    private _option_flag: number[] = [1, 2, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1];
    private _model: FlopyModpathMp | null = null;

// Filename and Listing Files
    private _mp_name_file: string = 'mp.nam';
    private _mp_list_file: string = 'mp.list';

    // Reference Time
    private _ref_time: number = 0;
    private _ref_time_per_stp: number[] = [0, 0, 1.0];

    // Retardation Factor
    private _retard_fac: number = 1.0;
    private _retard_fc_CB: number = 1.0;

    // Stopping Time
    private _stop_time: number | null = null;

    // Zones
    private _stop_zone: number = 1;

    // Groups
    private _group_name: string[] = ['group_1'];
    private _group_placement: number[][] = [[1, 1, 1, 0, 1, 1]];

    private _release_times: number[][] = [[1, 1]];
    private _group_region: number[][] = [[1, 1, 1, 1, 1, 1]];
    private _mask_nlay: number[] = [1];
    private _mask_layer: number[] = [1];
    private _mask_1_lay: number[] = [1];
    private _face_ct: number[] = [1];
    private _ifaces: number[][] = [[6, 1, 1]];
    private _part_ct: number[][] = [[1, 1, 1]];
    private _time_ct: number = 1;
    private _release_time_incr: number = 1;
    private _timePts: number[] = [1];
    private _particle_cell_cnt: number[][] = [[2, 2, 2]];
    private _cell_bd_ct: number = 1;
    private _bud_loc: number[][] = [[1, 1, 1, 1]];
    private _trace_id: number = 1;
    private _zone: number = 1;
    private _strt_file: string | null = null;
    private _extension: string = 'mpsim';
    private _package: string = 'WEL';

    public getGrid(group: number) {
        return this._group_placement[group][0];
    }

    public setGrid(group: number, value: number) {
        this._group_placement[group][0] = value;
    }

    public getGridCellRegionOption(group: number) {
        return this._group_placement[group][1];
    }

    public setGridCellRegionOption(group: number, value: number) {
        this._group_placement[group][1] = value;
    }

    public getPlacementOption(group: number) {
        return this._group_placement[group][2];
    }

    public setPlacementOption(group: number, value: number) {
        this._group_placement[group][2] = value;
    }

    public getReleaseStartTime(group: number) {
        return this._group_placement[group][3];
    }

    public setReleaseStartTime(group: number, value: number) {
        this._group_placement[group][3] = value;
    }

    public getReleaseOption(group: number) {
        return this._group_placement[group][4];
    }

    public setReleaseOption(group: number, value: number) {
        this._group_placement[group][4] = value;
    }

    public getCHeadOption(group: number) {
        return this._group_placement[group][5];
    }

    public setCHeadOption(group: number, value: number) {
        this._group_placement[group][5] = value;
    }
}
