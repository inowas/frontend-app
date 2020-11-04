import * as turf from '@turf/turf';
import {GeoJson} from '../../core/model/geometry/Geometry.type';
import {polygon} from '@turf/helpers';

export const convertGeometry = (value: GeoJson, to?: 'linestring' | 'point' | 'polygon'): GeoJson => {
    let updatedGeoJson: GeoJson | null = null;
    console.log()
    if (value.type === 'Point' && to === 'linestring') {
        updatedGeoJson = turf.lineString([value.coordinates, value.coordinates]).geometry;
    }
    if (value.type === 'LineString' && to === 'polygon') {
        updatedGeoJson = turf.lineToPolygon(value).geometry;
    }
    if (value.type === 'Point' && to === 'polygon') {
        updatedGeoJson = polygon([[value.coordinates, value.coordinates, value.coordinates, value.coordinates]]).geometry;
    }
    return updatedGeoJson || value;
};
