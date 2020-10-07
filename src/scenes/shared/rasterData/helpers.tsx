import {Array2D} from '../../../core/model/geometry/Array2D.type';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import GridSize from '../../../core/model/geometry/GridSize';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';

export const isValue = (data: any) => {
    return !isNaN(data);
};

export const isRaster = (data: any) => {
    if (!Array.isArray(data)) {
        return false;
    }

    if (!Array.isArray(data[0])) {
        return false;
    }

    return data[0].length > 0;
};

export const isValid = (data: any) => {
    return isValue(data) || isRaster(data);
};

export const min = (a: number | Array2D<number>) => {
    if (Array.isArray(a)) {
        const values = a
            .map((row) => row.filter((v) => (!isNaN(v) && v !== null)))
            .map((arr) => (Math.min.apply(null, arr)));

        return Math.min.apply(null, values);
    }
    return a;
};

export const max = (a: number | Array2D<number>) => {
    if (Array.isArray(a)) {
        const values = a
            .map((row) => row.filter((v) => (!isNaN(v) && v !== null)))
            .map((arr) => (Math.max.apply(null, arr)));
        return Math.max.apply(null, values);
    }
    return a;
};

export const mean = (data: number | Array2D<number>) => {
    if (isValue(data)) {
        return data;
    }

    if (Array.isArray(data)) {
        let sum = 0.0;
        let numberOfElements = 0;

        data.forEach(
            (row) => (row.forEach(
                (col) => {
                    sum += col;
                    numberOfElements += 1;
                }
            ))
        );

        return sum / numberOfElements;
    }

    return null;
};

export const getGridSize = (data: Array2D<number>) => {
    if (isValue(data)) {
        return {
            x: 1,
            n_x: 1,
            y: 1,
            n_y: 1
        };
    }

    if (isRaster(data)) {
        return {
            x: data[0].length,
            n_x: data[0].length,
            y: data.length,
            n_y: data.length,
        };
    }

    return null;
};

export const createGridData = (value: number | Array2D<number>, nx: number, ny: number) => {
    const data: Array<{ x: number, y: number, value: number }> = [];
    if (Array.isArray(value)) {
        const gridSize = getGridSize(value);
        if (gridSize && gridSize.x === nx && gridSize.y === ny) {
            for (let y = 0; y < ny; y++) {
                for (let x = 0; x < nx; x++) {
                    if (value[y][x] !== null) {
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
    }

    if (typeof value === 'number') {
        for (let y = 0; y < ny; y++) {
            for (let x = 0; x < nx; x++) {
                data.push({
                    x,
                    y,
                    value
                });
            }
        }
        return data;
    }

    return null;
};

export const rainbowFactory = (numberRange = {min: -50, max: 50}, spectrum = ['#31a354', '#addd8e', '#d8b365']) => {
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

export const rasterDownload = (raster: Array2D<number>, boundingBox: BoundingBox, gridSize: GridSize) => {
    const cellSize = (boundingBox.yMax - boundingBox.yMin) / gridSize.nY;

    let content = `NCOLS ${gridSize.nX}
NROWS ${gridSize.nY}
XLLCORNER ${boundingBox.xMin}
YLLCORNER ${boundingBox.yMin}
CELLSIZE ${cellSize}
NODATA_VALUE -9999
`;

    raster.forEach((row) => {
        content += row.join(' ');
        content += '\n';
    });

    const file = new Blob([content], {type: 'text/plain'});
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = 'suitability.asc';
    element.click();
};
