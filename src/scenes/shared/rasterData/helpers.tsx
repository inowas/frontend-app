import React from 'react';
import {CircleMarker, FeatureGroup, GeoJSON, LayersControl} from 'react-leaflet';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {Geometry} from '../../../core/model/modflow';
import {HeadObservationWell, WellBoundary} from '../../../core/model/modflow/boundaries';
import {EBoundaryType} from '../../../core/model/modflow/boundaries/Boundary.type';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import {getStyle} from '../../../services/geoTools/mapHelpers';
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

export const renderBoundaryOverlay = (
    boundaries: BoundaryCollection,
    name: string,
    type: EBoundaryType,
    checked: boolean = false
) => {
    const filtered = boundaries.all.filter((b) => b.type === type);

    if (filtered.length === 0) {
        return null;
    }

    return (
        <LayersControl.Overlay key={type} name={name} checked={checked}>
            <FeatureGroup>
                {filtered.map((b) => {
                    if (b instanceof WellBoundary || b instanceof HeadObservationWell) {
                        return (
                            <CircleMarker
                                key={b.id}
                                center={[
                                    b.geometry.coordinates[1],
                                    b.geometry.coordinates[0]
                                ]}
                                {...getStyle(b.type, b instanceof WellBoundary ? b.wellType : undefined)}
                            />
                        );
                    }
                    return (
                        <GeoJSON
                            key={Geometry.fromGeoJson(b.geometry).hash() + '-' + b.layers.join('-')}
                            data={b.geometry}
                            style={getStyle(b.type)}
                        />
                    );
                })}
            </FeatureGroup>
        </LayersControl.Overlay>
    );
};

export const renderBoundaryOverlays = (boundaries: BoundaryCollection) => {
    return [
        renderBoundaryOverlay(boundaries, 'Constant head boundaries', EBoundaryType.CHD),
        renderBoundaryOverlay(boundaries, 'Drainage', EBoundaryType.DRN),
        renderBoundaryOverlay(boundaries, 'Evapotranspiration', EBoundaryType.EVT),
        renderBoundaryOverlay(boundaries, 'Flow and head boundaries', EBoundaryType.FHB),
        renderBoundaryOverlay(boundaries, 'General head boundaries', EBoundaryType.GHB),
        renderBoundaryOverlay(boundaries, 'Recharge', EBoundaryType.RCH),
        renderBoundaryOverlay(boundaries, 'Rivers', EBoundaryType.RIV, true),
        renderBoundaryOverlay(boundaries, 'Wells', EBoundaryType.WEL, true)
    ];
};
