import * as turf from '@turf/turf';
import {GeoJson} from '../../core/model/geometry/Geometry.type';

// TODO: Add linestring to polygon and point to polygon

export const convertGeometry = (value: GeoJson, to?: 'linestring' | 'point' | 'polygon'): GeoJson => {
    let updatedGeoJson: GeoJson | null = null;
    if (value.type === 'Point' && to === 'linestring') {
        updatedGeoJson = turf.lineString([value.coordinates, value.coordinates]).geometry;
    }
    return updatedGeoJson || value;
};
