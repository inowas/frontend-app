import {IPropertyValueObject} from '../../../types';
import FlopyModpathMp7 from './FlopyModpathMp7';
import FlopyModpathPackage from './FlopyModpathPackage';

export default class FlopyModpathMp7bas extends FlopyModpathPackage {
    private _model: FlopyModpathMp7 | null = null;
    private _porosity: number | number[] = 0.30;
    private _defaultiface: IPropertyValueObject | null = null;
    private _extension: string = 'mpbas';

    get model(): FlopyModpathMp7 | null {
        return this._model;
    }

    set model(value: FlopyModpathMp7 | null) {
        this._model = value;
    }

    get porosity(): number | number[] {
        return this._porosity;
    }

    set porosity(value: number | number[]) {
        this._porosity = value;
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
