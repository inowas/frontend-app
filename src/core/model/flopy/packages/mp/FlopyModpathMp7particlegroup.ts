import FlopyModpathMp7particledata from './FlopyModpathMp7particledata';
import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMp7particlegroup extends FlopyModpathPackage {
    private _particlegroupname = 'PG1';
    private _filename: string | null = null;
    private _releasedata: number | number[] = 0.0;
    private _particledata: FlopyModpathMp7particledata | null = null;


    get particlegroupname(): string {
        return this._particlegroupname;
    }

    set particlegroupname(value: string) {
        this._particlegroupname = value;
    }

    get filename(): string | null {
        return this._filename;
    }

    set filename(value: string | null) {
        this._filename = value;
    }

    get releasedata(): number | number[] {
        return this._releasedata;
    }

    set releasedata(value: number | number[]) {
        this._releasedata = value;
    }

    get particledata(): FlopyModpathMp7particledata | null {
        return this._particledata;
    }

    set particledata(value: FlopyModpathMp7particledata | null) {
        this._particledata = value;
    }
}
