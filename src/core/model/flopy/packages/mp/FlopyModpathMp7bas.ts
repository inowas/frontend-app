import {Array2D} from '../../../geometry/Array2D.type';
import {IPropertyValueObject} from '../../../types';
import FlopyModpathMp7 from './FlopyModpathMp7';
import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMp7bas extends FlopyModpathPackage {
    private _model: FlopyModpathMp7 | null = null;
    private _porosity: number | Array2D<number> | string = 0.30;
    private _defaultiface: IPropertyValueObject | null = null;
    private _extension: string = 'mpbas';

    get model(): FlopyModpathMp7 | null {
        return this._model;
    }

    set model(value: FlopyModpathMp7 | null) {
        this._model = value;
    }

    get porosity(): number | Array2D<number> | string {
        return this._porosity;
    }

    set porosity(value: number | Array2D<number> | string) {
        this._porosity = typeof value === 'string' ? parseFloat(value) : value;
    }

    get defaultiface(): IPropertyValueObject | null {
        return this._defaultiface;
    }

    set defaultiface(value: IPropertyValueObject | null) {
        this._defaultiface = value;
    }

    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }
}
