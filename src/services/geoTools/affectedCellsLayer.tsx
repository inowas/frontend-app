import * as turf from '@turf/turf';
import React, {useEffect, useState} from 'react';
import {FeatureGroup, GeoJSON, LayersControl} from 'react-leaflet';
import {useSelector} from 'react-redux';
import uuid from 'uuid';
import {BoundingBox, Cells, Geometry, GridSize} from '../../core/model/geometry';
import {IBoundingBox} from '../../core/model/geometry/BoundingBox.type';
import {IRotationProperties} from '../../core/model/geometry/Geometry.type';
import {Boundary, BoundaryCollection} from '../../core/model/modflow/boundaries';
import {IRootReducer} from '../../reducers';

interface IProps {
    boundary?: Boundary;
    boundingBox: BoundingBox;
    gridSize: GridSize;
    cells: Cells;
    rotation?: IRotationProperties;
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
    },
    selected: {
        color: '#ded340',
        stroke: true,
        fill: false,
    }
};

const affectedCellsLayer = (props: IProps) => {
    const [iBoundLayer, setIBoundLayer] = useState();
    const [boundingBox, setBoundingBox] = useState<IBoundingBox>(props.boundingBox.toObject());
    const [boundaryLayer, setBoundaryLayer] = useState();
    const [boundaryLayers, setBoundaryLayers] = useState();
    const [boundaryKey, setBoundaryKey] = useState<string>(uuid.v4());
    const [iBoundKey, setIBoundKey] = useState<string>(uuid.v4());

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;

    if (!boundaries) {
        return null;
    }

    useEffect(() => {
        setBoundingBox(props.boundingBox.toObject());
    }, [props.boundingBox]);

    useEffect(() => {
        if (props.rotation) {
            const bbox = BoundingBox.fromGeometryAndRotation(props.rotation.geometry, props.rotation.angle);
            setBoundingBox(bbox.toObject());
        }
    }, [props.rotation]);

    useEffect(() => {
        setIBoundLayer(
            createPolygon(
                BoundingBox.fromObject(boundingBox),
                props.gridSize,
                props.cells.invert(props.gridSize),
                styles.inactive
            )
        );
    }, [boundingBox, props.cells, props.gridSize]);

    useEffect(() => {
        if (props.boundary) {
            const polygon = createPolygon(
                BoundingBox.fromObject(boundingBox), props.gridSize, props.boundary.cells, styles.affected
            );
            setBoundaryLayer(polygon);
        }
    }, [props.boundary]);

    useEffect(() => {
        setBoundaryKey(uuid.v4());
    }, [boundaryLayer]);

    useEffect(() => {
        setIBoundKey(uuid.v4());
    }, [iBoundLayer]);

    useEffect(() => {
        if (!props.boundary || !T03.boundaries) {
            return;
        }
        const sameTypeBoundaries = boundaries.all.filter(
            (b) => props.boundary && b.type === props.boundary.type && b.id !== props.boundary.id
        );
        setBoundaryLayers(sameTypeBoundaries.length > 0 ? sameTypeBoundaries.map(
            (b, key) => createPolygon(props.boundingBox, props.gridSize, b.cells, styles.other, key)
            ) : null
        );
    }, [T03.boundaries]);

    const createPolygon = (bbox: BoundingBox, gridSize: GridSize, cells: Cells, style: any, key?: number) => {
        const dX = bbox.dX / gridSize.nX;
        const dY = bbox.dY / gridSize.nY;
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

                const cXmin = bbox.xMin + x0 * dX;
                const cXmax = bbox.xMin + (x1 + 1) * dX;
                const cYmin = bbox.yMax - y * dY;
                const cYmax = bbox.yMax - (y + 1) * dY;

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

        if (props.rotation && props.rotation.angle > 0 && props.rotation.angle < 360) {
            turfPolygon = turf.transformRotate(
                turfPolygon,
                props.rotation.angle,
                {pivot: props.rotation.geometry.centerOfMass}
            );
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

    return (
        <LayersControl position="topright">
            {!!iBoundLayer &&
            <LayersControl.Overlay name="Inactive cells" checked={true} key={iBoundKey}>
                <FeatureGroup color={styles.inactive.fillColor}>
                    {iBoundLayer}
                </FeatureGroup>
            </LayersControl.Overlay>
            }
            {!!boundaryLayer &&
            <LayersControl.Overlay name="Affected cells" checked={true} key={boundaryKey}>
                <FeatureGroup color={styles.affected.fillColor}>
                    {boundaryLayer}
                </FeatureGroup>
            </LayersControl.Overlay>
            }
            {!!boundaryLayers && !!props.boundary &&
            <LayersControl.Overlay name={`Cells of other ${props.boundary.type} boundaries`} checked={true}>
                <FeatureGroup color={styles.other.fillColor}>
                    {boundaryLayers}
                </FeatureGroup>
            </LayersControl.Overlay>
            }
        </LayersControl>
    );
};

export default affectedCellsLayer;
