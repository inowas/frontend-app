import {ModflowModel} from '../../../modflow';
import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMp7 extends FlopyModpathPackage {
    private _modelname = 'modpath7test';
    private _simfileExt = 'mpsim';
    private _namefileExt = 'mpnam';
    private _version = 'modpath7';
    private _exeName = 'mp7';
    private _flowmodel: ModflowModel | null = null;
    private _headfilename: string | null = null;
    private _budgetfilename: string | null = null;
    private _modelWs = '.';
    private _verbose = false;

    get modelname(): string {
        return this._modelname;
    }

    set modelname(value: string) {
        this._modelname = value;
    }

    get simfile_ext(): string {
        return this._simfileExt;
    }

    set simfile_ext(value: string) {
        this._simfileExt = value;
    }

    get namefile_ext(): string {
        return this._namefileExt;
    }

    set namefile_ext(value: string) {
        this._namefileExt = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }

    get exe_name(): string {
        return this._exeName;
    }

    set exe_name(value: string) {
        this._exeName = value;
    }

    get flowmodel(): ModflowModel | null {
        return this._flowmodel;
    }

    set flowmodel(value: ModflowModel | null) {
        this._flowmodel = value;
    }

    get headfilename(): string | null {
        return this._headfilename;
    }

    set headfilename(value: string | null) {
        this._headfilename = value;
    }

    get budgetfilename(): string | null {
        return this._budgetfilename;
    }

    set budgetfilename(value: string | null) {
        this._budgetfilename = value;
    }

    get model_ws(): string {
        return this._modelWs;
    }

    set model_ws(value: string) {
        this._modelWs = value;
    }

    get verbose(): boolean {
        return this._verbose;
    }

    set verbose(value: boolean) {
        this._verbose = value;
    }
}
