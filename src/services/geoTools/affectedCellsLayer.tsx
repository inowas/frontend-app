import * as turf from '@turf/turf';
import React, {useEffect, useState} from 'react';
import {FeatureGroup, GeoJSON, LayersControl} from 'react-leaflet';
import {useSelector} from 'react-redux';
import uuid from 'uuid';
import {BoundingBox, Cells, Geometry, GridSize} from '../../core/model/geometry';
import {ModflowModel} from '../../core/model/modflow';
import {Boundary, BoundaryCollection} from '../../core/model/modflow/boundaries';
import {IRootReducer} from '../../reducers';

interface IProps {
    boundary: Boundary;
}

const styles = {
    affected: {
        stroke: false,
        fill: true,
        fillColor: '#393B89',
        fillOpacity: 0.6
    },
    inactive: {
        stroke: false,
        fill: true,
        fillColor: '#888888',
        fillOpacity: 0.6
    },
    other: {
        stroke: false,
        fill: true,
        fillColor: '#9C9EDE',
        fillOpacity: 0.6
    }
};

const affectedCellsLayer = (props: IProps) => {
    const [iBoundLayer, setIBoundLayer] = useState();
    const [boundaryLayer, setBoundaryLayer] = useState();
    const [boundaryLayers, setBoundaryLayers] = useState();
    const [featureKey, setFeatureKey] = useState<string>(uuid.v4());

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

    if (!model || !boundaries) {
        return null;
    }

    useEffect(() => {
        setIBoundLayer(createPolygon(model.boundingBox, model.gridSize, model.inactiveCells, styles.inactive));
    }, [T03.model]);

    useEffect(() => {
        const polygon = createPolygon(model.boundingBox, model.gridSize, props.boundary.cells, styles.affected);
        setBoundaryLayer(polygon);
    }, [props.boundary]);

    useEffect(() => {
        setFeatureKey(uuid.v4());
    }, [boundaryLayer]);

    useEffect(() => {
        const sameTypeBoundaries = boundaries.all.filter(
            (b) => b.type === props.boundary.type && b.id !== props.boundary.id
        );
        setBoundaryLayers(sameTypeBoundaries.length > 0 ? sameTypeBoundaries.map(
            (b, key) => createPolygon(model.boundingBox, model.gridSize, b.cells, styles.other, key)
            ) : null
        );
    }, [T03.boundaries]);

    const createPolygon = (boundingBox: BoundingBox, gridSize: GridSize, cells: Cells, style: any, key?: number) => {
        const dX = boundingBox.dX / gridSize.nX;
        const dY = boundingBox.dY / gridSize.nY;
        const mergedCells: Array<[number, number, number, number]> = [];

        const grid = cells.calculateIBound(gridSize.nY, gridSize.nX);

        grid.forEach((row, rIdx) => {
            const startIdx: number[] = [];
            const endIdx: number[] = [];

            row.forEach((v, cIdx) => {

                    if (v === 1) {
                        if (cIdx === 0) {
                            startIdx.push(cIdx);
                        }

                        if (cIdx > 0 && grid[rIdx][cIdx - 1] === 0) {
                            startIdx.push(cIdx);
                        }

                        if (cIdx === row.length - 1) {
                            endIdx.push(cIdx);
                        }

                        if (cIdx < row.length - 1 && grid[rIdx][cIdx + 1] === 0) {
                            endIdx.push(cIdx);
                        }
                    }
                }
            );

            if (startIdx.length !== endIdx.length) {
                throw new Error('startIdx.length !== endIdx.length');
            }

            const startEndIdxArr = startIdx.map((e, idx) => [startIdx[idx], endIdx[idx]]);
            startEndIdxArr.forEach((e) => {
                const x0 = e[0];
                const x1 = e[1];
                const y = rIdx;

                const cXmin = boundingBox.xMin + x0 * dX;
                const cXmax = boundingBox.xMin + (x1 + 1) * dX;
                const cYmin = boundingBox.yMax - y * dY;
                const cYmax = boundingBox.yMax - (y + 1) * dY;

                mergedCells.push([cXmin, cXmax, cYmin, cYmax]);
            });
        });

        const turfPolygons = mergedCells.map((c) => {
            const [xMin, xMax, yMin, yMax] = c;
            return (
                turf.polygon([[
                    [xMin, yMin],
                    [xMin, yMax],
                    [xMax, yMax],
                    [xMax, yMin],
                    [xMin, yMin]
                ]])
            );
        });

        let turfPolygon: turf.helpers.Feature<turf.helpers.Polygon> | null = null;

        if (turfPolygons.length > 0) {
            turfPolygon = turfPolygons[0];
            turfPolygons.forEach((p) => {
                if (turfPolygon !== null) {
                    turfPolygon = turf.union(turfPolygon, p) as turf.helpers.Feature<turf.helpers.Polygon>;
                }
            });
        }

        if (turfPolygon === null) {
            return null;
        }

        const geometry = Geometry.fromGeoJson(turfPolygon.geometry);
        return (
            <GeoJSON
                key={key}
                data={geometry}
                {...style}
            />
        );
    };

    if (!iBoundLayer || !boundaryLayer) {
        return null;
    }

    return (
        <FeatureGroup>
            <LayersControl position="topright">
                <LayersControl.Overlay name="Inactive cells" checked={true}>
                    <FeatureGroup color={styles.inactive.fillColor}>
                        {iBoundLayer}
                    </FeatureGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Affected cells" checked={true} key={featureKey}>
                    <FeatureGroup color={styles.affected.fillColor}>
                        {boundaryLayer}
                    </FeatureGroup>
                </LayersControl.Overlay>
                {!!boundaryLayers &&
                <LayersControl.Overlay name={`Cells of other ${props.boundary.type} boundaries`} checked={true}>
                    <FeatureGroup color={styles.other.fillColor}>
                        {boundaryLayers}
                    </FeatureGroup>
                </LayersControl.Overlay>
                }
            </LayersControl>
        </FeatureGroup>
    );
};

export default affectedCellsLayer;
