import ColorGradient from './ColorGradient';

/*
RainbowVis-JS
Released under Eclipse Public License - v 1.0
*/

class Rainbow {
    private _gradients: ColorGradient[] = [];
    private _minNum = 0;
    private _maxNum = 100;
    private _colors = ['ff0000', 'ffff00', '00ff00', '0000ff'];

    get gradients(): ColorGradient[] {
        return this._gradients;
    }

    set gradients(value: ColorGradient[]) {
        this._gradients = value;
    }

    get minNum(): number {
        return this._minNum;
    }

    set minNum(value: number) {
        this._minNum = value;
    }

    get maxNum(): number {
        return this._maxNum;
    }

    set maxNum(value: number) {
        this._maxNum = value;
    }

    get colors(): string[] {
        return this._colors;
    }

    set colors(value: string[]) {
        this._colors = value;
    }

    public setColors = (spectrum: string[]) => {
        if (spectrum.length < 2) {
            throw new Error('Rainbow must have two or more colours.');
        } else {
            const increment = (this.maxNum - this.minNum) / (spectrum.length - 1);
            const firstGradient = new ColorGradient();
            firstGradient.setGradient(spectrum[0], spectrum[1]);
            firstGradient.setNumberRange(this.minNum, this.minNum + increment);
            this.gradients = [firstGradient];

            for (let i = 1; i < spectrum.length - 1; i++) {
                const colourGradient = new ColorGradient();
                colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
                colourGradient.setNumberRange(
                    this.minNum + increment * i,
                    this.minNum + increment * (i + 1)
                );
                this.gradients[i] = colourGradient;
            }

            this.colors = spectrum;
        }
    };

    public setSpectrumByArray(array: string[]) {
        this.setColors(array);
        return this;
    }

    public colorAt = (value: number) => {
        if (isNaN(value)) {
            throw new TypeError(value + ' is not a number');
        } else if (this.gradients.length === 1) {
            return this.gradients[0].colourAt(value);
        } else {
            const segment = (this.maxNum - this.minNum) / this.gradients.length;
            const index = Math.min(
                Math.floor((Math.max(value, this.minNum) - this.minNum) / segment),
                this.gradients.length - 1
            );
            return this.gradients[index].colourAt(value);
        }
    };

    public setNumberRange(minNumber: number, maxNumber: number) {
        if (maxNumber > minNumber) {
            this.minNum = minNumber;
            this.maxNum = maxNumber;
            this.setColors(this.colors);
        } else {
            throw new RangeError(
                'maxNumber (' +
                maxNumber +
                ') is not greater than minNumber (' +
                minNumber +
                ')'
            );
        }
        return this;
    }
}

export default Rainbow;
