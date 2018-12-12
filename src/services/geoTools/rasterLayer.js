import Rainbow from 'rainbowvis.js';

export function isValue(data) {
    return !isNaN(data);
}

export function isRaster(data) {
    if (!Array.isArray(data)) {
        return false;
    }

    if (!Array.isArray(data[0])) {
        return false;
    }

    return !isNaN(data[0][0]);
}

export function getGridSize(data) {
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
}

export function createGridData(value, nx, ny) {
    const data = [];

    if (isValue(value)) {
        for (let y = 0; y < ny; y++) {
            for (let x = 0; x < nx; x++) {
                data.push({
                    x: x,
                    y: y,
                    value: value
                });
            }
        }
        return data;
    }

    if (isRaster(value) && getGridSize(value).x === nx && getGridSize(value).y === ny) {
        for (let y = 0; y < ny; y++) {
            for (let x = 0; x < nx; x++) {
                data.push({
                    x: x,
                    y: y,
                    value: value[y][x]
                });
            }
        }
        return data;
    }

    return null;
}

export function min(a) {
    if (isValue(a)) {
        return a;
    }
    const values = a.map(arr => (Math.min.apply(null, arr)));
    return Math.min.apply(null, values);
}

export function max(a) {
    if (isValue(a)) {
        return a;
    }
    const values = a.map(arr => (Math.max.apply(null, arr)));
    return Math.max.apply(null, values);
}

export function rainbowFactory(numberRange = {min: -50, max: 50}) {
    const rainbow = new Rainbow();

    rainbow.setSpectrum(
        '#31a354',
        '#addd8e',
        '#d8b365',
    );

    if (numberRange) {
        const rMin = numberRange.min;
        const rMax = numberRange.max;

        if (rMin === rMax) {
            if (rMin === 0) {
                rainbow.setNumberRange(-10, 10);
                return rainbow;
            }

            rainbow.setNumberRange((rMin - rMin / 10), (rMax + rMax / 10));
            return rainbow;
        }

        rainbow.setNumberRange(numberRange.min, numberRange.max);
        return rainbow;
    }

    return rainbow;
}

export const disableMap = (map) => {
    if (map) {
        map.leafletElement._handlers.forEach(function(handler) {
            handler.disable();
        });
    }
};

export const invalidateSize = (map) => {
    if (map) {
        map.leafletElement.invalidateSize();
    }
};