import {toWgs84} from 'reproject';
import epsg from 'epsg';

export const projectGeoJson = (geoJson) => {
    return toWgs84(geoJson, null, epsg);
};
