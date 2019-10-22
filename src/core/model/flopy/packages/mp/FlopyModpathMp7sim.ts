import FlopyModpathMp7 from './FlopyModpathMp7';
import FlopyModpathMp7particlegroup from './FlopyModpathMp7particlegroup';
import FlopyModpathPackage from './FlopyModpathPackage';
import {
    BudgetOutOptionType, OnOffType, SimulationType, StopTimeOptionType,
    TrackingDirectionType, WeakSinkSourceOptionType
} from './types';

export default class FlopyModpathMp7sim extends FlopyModpathPackage {
    private _model: FlopyModpathMp7 | null = null;
    private _mpnamefilename: string | null = null;
    private _listingfilename: string | null = null;
    private _endpointfilename: string | null = null;
    private _pathlinefilename: string | null = null;
    private _timeseriesfilename: string | null = null;
    private _tracefilename: string | null = null;
    private _simulationtype: SimulationType = 'pathline';
    private _trackingdirection: TrackingDirectionType = 'forward';
    private _weaksinkoption: WeakSinkSourceOptionType = 'stop_at';
    private _weaksourceoption: WeakSinkSourceOptionType = 'stop_at';
    private _budgetoutoption: BudgetOutOptionType = 'summary';
    private _traceparticledata: number[] | null = null;
    private _budgetcellnumbers: number[] | null = null;
    private _referencetime: number | number[] | null = null;
    private _stoptimeoption: StopTimeOptionType = 'extend';
    private _stoptime: number | null = null;
    private _timepointdata: Array<number | number[]> | null = null;
    private _zonedataoption: OnOffType = 'off';
    private _stopzone: number | null = null;
    private _zones: number | number[] = 0;
    private _retardationfactoroption: OnOffType = 'on';
    private _retardation: number | number[] = 1;
    private _particlegroups: FlopyModpathMp7particlegroup | FlopyModpathMp7particlegroup[] | null = null;
    private _extension: string = 'mpsim';

    get model(): FlopyModpathMp7 | null {
        return this._model;
    }

    set model(value: FlopyModpathMp7 | null) {
        this._model = value;
    }

    get mpnamefilename(): string | null {
        return this._mpnamefilename;
    }

    set mpnamefilename(value: string | null) {
        this._mpnamefilename = value;
    }

    get listingfilename(): string | null {
        return this._listingfilename;
    }

    set listingfilename(value: string | null) {
        this._listingfilename = value;
    }

    get endpointfilename(): string | null {
        return this._endpointfilename;
    }

    set endpointfilename(value: string | null) {
        this._endpointfilename = value;
    }

    get pathlinefilename(): string | null {
        return this._pathlinefilename;
    }

    set pathlinefilename(value: string | null) {
        this._pathlinefilename = value;
    }

    get timeseriesfilename(): string | null {
        return this._timeseriesfilename;
    }

    set timeseriesfilename(value: string | null) {
        this._timeseriesfilename = value;
    }

    get tracefilename(): string | null {
        return this._tracefilename;
    }

    set tracefilename(value: string | null) {
        this._tracefilename = value;
    }

    get simulationtype(): SimulationType {
        return this._simulationtype;
    }

    set simulationtype(value: SimulationType) {
        this._simulationtype = value;
    }

    get trackingdirection(): TrackingDirectionType {
        return this._trackingdirection;
    }

    set trackingdirection(value: TrackingDirectionType) {
        this._trackingdirection = value;
    }

    get weaksinkoption(): WeakSinkSourceOptionType {
        return this._weaksinkoption;
    }

    set weaksinkoption(value: WeakSinkSourceOptionType) {
        this._weaksinkoption = value;
    }

    get weaksourceoption(): WeakSinkSourceOptionType {
        return this._weaksourceoption;
    }

    set weaksourceoption(value: WeakSinkSourceOptionType) {
        this._weaksourceoption = value;
    }

    get budgetoutoption(): BudgetOutOptionType {
        return this._budgetoutoption;
    }

    set budgetoutoption(value: BudgetOutOptionType) {
        this._budgetoutoption = value;
    }

    get traceparticledata(): number[] | null {
        return this._traceparticledata;
    }

    set traceparticledata(value: number[] | null) {
        this._traceparticledata = value;
    }

    get budgetcellnumbers(): number[] | null {
        return this._budgetcellnumbers;
    }

    set budgetcellnumbers(value: number[] | null) {
        this._budgetcellnumbers = value;
    }

    get referencetime(): number | number[] | null {
        return this._referencetime;
    }

    set referencetime(value: number | number[] | null) {
        this._referencetime = value;
    }

    get stoptimeoption(): StopTimeOptionType {
        return this._stoptimeoption;
    }

    set stoptimeoption(value: StopTimeOptionType) {
        this._stoptimeoption = value;
    }

    get stoptime(): number | null {
        return this._stoptime;
    }

    set stoptime(value: number | null) {
        this._stoptime = value;
    }

    get timepointdata(): Array<number | number[]> | null {
        return this._timepointdata;
    }

    set timepointdata(value: Array<number | number[]> | null) {
        this._timepointdata = value;
    }

    get zonedataoption(): OnOffType {
        return this._zonedataoption;
    }

    set zonedataoption(value: OnOffType) {
        this._zonedataoption = value;
    }

    get stopzone(): number | null {
        return this._stopzone;
    }

    set stopzone(value: number | null) {
        this._stopzone = value;
    }

    get zones(): number | number[] {
        return this._zones;
    }

    set zones(value: number | number[]) {
        this._zones = value;
    }

    get retardationfactoroption(): OnOffType {
        return this._retardationfactoroption;
    }

    set retardationfactoroption(value: OnOffType) {
        this._retardationfactoroption = value;
    }

    get retardation(): number | number[] {
        return this._retardation;
    }

    set retardation(value: number | number[]) {
        this._retardation = value;
    }

    get particlegroups(): FlopyModpathMp7particlegroup | FlopyModpathMp7particlegroup[] | null {
        return this._particlegroups;
    }

    set particlegroups(value: FlopyModpathMp7particlegroup | FlopyModpathMp7particlegroup[] | null) {
        this._particlegroups = value;
    }

    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }
}
