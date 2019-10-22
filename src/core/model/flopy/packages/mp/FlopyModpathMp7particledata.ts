import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMp7particledata extends FlopyModpathPackage {
    private _drape: number = 0;
    private _columncelldivisions: number = 3;
    private _rowcelldivisions: number = 3;
    private _layercelldivisions: number = 3;

    get drape(): number {
        return this._drape;
    }

    set drape(value: number) {
        this._drape = value;
    }

    get columncelldivisions(): number {
        return this._columncelldivisions;
    }

    set columncelldivisions(value: number) {
        this._columncelldivisions = value;
    }

    get rowcelldivisions(): number {
        return this._rowcelldivisions;
    }

    set rowcelldivisions(value: number) {
        this._rowcelldivisions = value;
    }

    get layercelldivisions(): number {
        return this._layercelldivisions;
    }

    set layercelldivisions(value: number) {
        this._layercelldivisions = value;
    }
}
