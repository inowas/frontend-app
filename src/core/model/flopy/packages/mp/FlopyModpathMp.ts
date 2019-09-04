import {ModflowModel} from '../../../modflow';
import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMp extends FlopyModpathPackage {
    private _modelname: string = 'modpathtest';
    private _simfile_ext: string = 'mpsim';
    private _namefile_ext: string = 'mpnam';
    private _version: string = 'modpath';
    private _exe_name: string = 'mp6';
    private _modflowmodel: ModflowModel | null = null;
    private _dis_file: string | null = 'mf.dis';
    private _dis_unit: number = 87;
    private _head_file: string | null = 'mf.hds';
    private _budget_file: string | null = 'mf.list';
    private _model_ws: string | null = null;
    private _external_path: string | null = null;
    private _verbose: boolean = false;
    private _load: boolean = true;
    private _listunit: number = 7;

    get modelname(): string {
        return this._modelname;
    }

    set modelname(value: string) {
        this._modelname = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }

    get modflowmodel(): ModflowModel | null {
        return this._modflowmodel;
    }

    set modflowmodel(value: ModflowModel | null) {
        this._modflowmodel = value;
    }

    get verbose(): boolean {
        return this._verbose;
    }

    set verbose(value: boolean) {
        this._verbose = value;
    }

    get simfile_ext(): string {
        return this._simfile_ext;
    }

    set simfile_ext(value: string) {
        this._simfile_ext = value;
    }

    get namefile_ext(): string {
        return this._namefile_ext;
    }

    set namefile_ext(value: string) {
        this._namefile_ext = value;
    }

    get exe_name(): string {
        return this._exe_name;
    }

    set exe_name(value: string) {
        this._exe_name = value;
    }

    get dis_file(): string | null {
        return this._dis_file;
    }

    set dis_file(value: string | null) {
        this._dis_file = value;
    }

    get dis_unit(): number {
        return this._dis_unit;
    }

    set dis_unit(value: number) {
        this._dis_unit = value;
    }

    get head_file(): string | null {
        if (!this._head_file) {
            return 'mf.hds';
        }
        return this._head_file;
    }

    set head_file(value: string | null) {
        this._head_file = value;
    }

    get budget_file(): string | null {
        if (!this._budget_file) {
            return 'mf.list';
        }
        return this._budget_file;
    }

    set budget_file(value: string | null) {
        this._budget_file = value;
    }

    get model_ws(): string | null {
        return this._model_ws;
    }

    set model_ws(value: string | null) {
        this._model_ws = value;
    }

    get external_path(): string | null {
        return this._external_path;
    }

    set external_path(value: string | null) {
        this._external_path = value;
    }

    get load(): boolean {
        return this._load;
    }

    set load(value: boolean) {
        this._load = value;
    }

    get listunit(): number {
        return this._listunit;
    }

    set listunit(value: number) {
        this._listunit = value;
    }
}
