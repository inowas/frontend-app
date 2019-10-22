import {Array2D} from '../../core/model/geometry/Array2D.type';
import Rainbow from './Rainbowvis';

interface IData {
    x: number;
    y: number;
    value: number;
}

interface INumberRange {
    max: number;
    min: number;
}

export function isRaster(data: any) {
    if (!Array.isArray(data)) {
        return false;
    }

    if (!Array.isArray(data[0])) {
        return false;
    }

    return data[0].length > 0;
}

export function isValue(data: any) {
    return !isNaN(data);
}

export const getGridSize = (data: number | Array2D<number>) => {
    if (isValue(data)) {
        return {
            x: 1,
            n_x: 1,
            y: 1,
            n_y: 1
        };
    }

    if (isRaster(data) && Array.isArray(data)) {
        return {
            x: data[0].length,
            n_x: data[0].length,
            y: data.length,
            n_y: data.length,
        };
    }

    throw new Error('getGridSize expects either number or array of numbers');
};

export const createGridData = (value: number | Array2D<number>, nx: number, ny: number): IData[] => {
    const data: IData[] = [];

    if (isValue(value)) {
        for (let y = 0; y < ny; y++) {
            for (let x = 0; x < nx; x++) {
                data.push({
                    x,
                    y,
                    value: value as number
                });
            }
        }
        return data;
    }

    if (isRaster(value) && getGridSize(value) && getGridSize(value).x === nx && getGridSize(value).y === ny) {
        for (let y = 0; y < ny; y++) {
            for (let x = 0; x < nx; x++) {
                if (Array.isArray(value) && value[y][x] !== null) {
                    data.push({
                        x,
                        y,
                        value: value[y][x]
                    });
                }
            }
        }
        return data;
    }

    throw new Error('createGridData expects either number or array of numbers');
};

export const rainbowFactory = (
    numberRange: INumberRange = {min: -50, max: 50},
    spectrum: string[] = ['#31a354', '#addd8e', '#d8b365']
): Rainbow => {
    const rainbow = new Rainbow();

    if (spectrum) {
        rainbow.setSpectrumByArray(spectrum);
    }

    if (numberRange) {
        const rMin = isFinite(numberRange.min) ? numberRange.min : -100;
        const rMax = isFinite(numberRange.max) ? numberRange.max : 100;

        if (rMin === rMax) {
            if (rMin === 0) {
                rainbow.setNumberRange(-10, 10);
                return rainbow;
            }

            rainbow.setNumberRange((rMin - Math.abs(rMin / 10)), (rMax + Math.abs(rMax / 10)));

            return rainbow;
        }

        rainbow.setNumberRange(rMin, rMax);
        return rainbow;
    }

    return rainbow;
};
