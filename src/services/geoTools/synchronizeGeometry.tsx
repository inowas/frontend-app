import * as turf from '@turf/turf';
import {GeoJsonObject} from 'geojson';
import {BoundingBox, Geometry, GridSize} from '../../core/model/modflow';
import {dxCell, dyCell} from './distance';

const synchronizeGeometry = (
    geometry: Geometry,
    boundingBox: BoundingBox | null,
    boundingBoxIsFixed: boolean,
    cellSize: [number, number] | null,
    gridSize: GridSize | null,
    rotation?: number
): {
    boundingBox: BoundingBox,
    cellSize: [number, number],
    gridSize: GridSize,
    boundingBoxWithRotation: GeoJsonObject | null
} => {
    let bbox = boundingBox ? boundingBox : BoundingBox.fromGeoJson(geometry.toGeoJSON());

    if (rotation && rotation % 360 !== 0) {
        const withRotation = turf.transformRotate(
            geometry.toGeoJSON(), -1 * rotation, {pivot: geometry.centerOfMass}
        );
        bbox = BoundingBox.fromGeoJson(withRotation);
    }

    if (!boundingBoxIsFixed && bbox && cellSize && !gridSize) {
        const [cellHeight, cellWidth] = cellSize;
        const [diffHeight, diffWidth] = [
            turf.lengthToDegrees((Math.ceil(bbox.heightInMeters / cellHeight)
                * cellHeight - bbox.heightInMeters) / 2, 'meters'),
            turf.lengthToDegrees((Math.ceil(bbox.widthInMeters / cellWidth)
                * cellWidth - bbox.widthInMeters) / 2, 'meters')
        ];
        bbox = new BoundingBox([[bbox.xMin - diffWidth, bbox.yMin - diffHeight],
            [bbox.xMax + diffWidth, bbox.yMax + diffHeight]]);
        gridSize = new GridSize({
            n_x: Math.ceil(bbox.widthInMeters / cellWidth),
            n_y: Math.ceil(bbox.heightInMeters / cellHeight)
        });
    } else if (boundingBoxIsFixed && bbox && cellSize && !gridSize) {
        const [cellHeight, cellWidth] = cellSize;
        gridSize = new GridSize({
            n_x: Math.floor(bbox.widthInMeters / cellWidth),
            n_y: Math.floor(bbox.heightInMeters / cellHeight)
        });
        cellSize = [
            Math.round(dyCell(bbox, gridSize) * 1000),
            Math.round(dxCell(bbox, gridSize) * 1000)
        ];
    } else if (bbox && !cellSize && gridSize) {
        cellSize = [
            Math.round(dyCell(bbox, gridSize) * 1000),
            Math.round(dxCell(bbox, gridSize) * 1000)
        ];
    }

    if (!bbox || !gridSize || !cellSize) {
        throw new Error('Something went wrong');
    }

    let boundingBoxWithRotation = bbox.geoJson;
    if (rotation && rotation % 360 !== 0) {
        boundingBoxWithRotation = bbox.geoJsonWithRotation(rotation, geometry.centerOfMass);
    }

    return {
        boundingBox: bbox,
        boundingBoxWithRotation,
        cellSize,
        gridSize
    };
};

export default synchronizeGeometry;
