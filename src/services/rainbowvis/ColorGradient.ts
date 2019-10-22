import colorNames from './colorNames';

class ColourGradient {
    private _startColor = 'ff0000';
    private _endColor = '0000ff';
    private _minNum = 0;
    private _maxNum = 100;

    get startColor(): string {
        return this._startColor;
    }

    set startColor(value: string) {
        this._startColor = value;
    }

    get endColor(): string {
        return this._endColor;
    }

    set endColor(value: string) {
        this._endColor = value;
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

    public setGradient = (colorStart: string, colorEnd: string) => {
        this.startColor = this.getHexColor(colorStart);
        this.endColor = this.getHexColor(colorEnd);
    };

    public setNumberRange = (minNumber: number, maxNumber: number) => {
        if (maxNumber > minNumber) {
            this.minNum = minNumber;
            this.maxNum = maxNumber;
        } else {
            throw new RangeError(
                'maxNumber (' +
                maxNumber +
                ') is not greater than minNumber (' +
                minNumber +
                ')'
            );
        }
    };

    public colourAt = (value: number) => {
        return (
            this.calcHex(value, this.startColor.substring(0, 2), this.endColor.substring(0, 2)) +
            this.calcHex(value, this.startColor.substring(2, 4), this.endColor.substring(2, 4)) +
            this.calcHex(value, this.startColor.substring(4, 6), this.endColor.substring(4, 6))
        );
    };

    public calcHex = (value: number, channelStartBase16: string, channelEndBase16: string) => {
        let num = value;
        if (num < this.minNum) {
            num = this.minNum;
        }
        if (num > this.maxNum) {
            num = this.maxNum;
        }
        const numRange = this.maxNum - this.minNum;
        const cStartBase10 = parseInt(channelStartBase16, 16);
        const cEndBase10 = parseInt(channelEndBase16, 16);
        const cPerUnit = (cEndBase10 - cStartBase10) / numRange;
        const cBase10 = Math.round(cPerUnit * (num - this.minNum) + cStartBase10);
        return this.formatHex(cBase10.toString(16));
    };

    public formatHex = (hex: string) => {
        if (hex.length === 1) {
            return '0' + hex;
        } else {
            return hex;
        }
    };

    public isHexColor = (value: string) => {
        const regex = /^#?[0-9a-fA-F]{6}$/i;
        return regex.test(value);
    };

    public getHexColor = (value: string) => {
        if (this.isHexColor(value)) {
            return value.substring(value.length - 6, value.length);
        }

        const color = colorNames[value.toLowerCase() as keyof typeof colorNames];
        if (color) {
            return color;
        }

        throw new Error(value + ' is not a valid colour.');
    };
}

export default ColourGradient;
