import * as turf from '@turf/turf';
import { Boundary, BoundaryCollection } from '../../core/model/modflow/boundaries';
import { BoundingBox, Cells, Geometry, GridSize } from '../../core/model/geometry';
import { FeatureGroup, GeoJSON, LayersControl } from 'react-leaflet';
import { IBoundingBox } from '../../core/model/geometry/BoundingBox.type';
import { IRootReducer } from '../../reducers';
import { IRotationProperties } from '../../core/model/geometry/Geometry.type';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import uuid from 'uuid';

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
    fill: false
  }
};

const AffectedCellsLayer = (props: IProps) => {
  const [iBoundLayer, setIBoundLayer] = useState();
  const [boundingBox, setBoundingBox] = useState<IBoundingBox>(props.boundingBox.toObject());
  const [boundaryLayer, setBoundaryLayer] = useState();
  const [boundaryLayers, setBoundaryLayers] = useState();
  const [boundaryKey, setBoundaryKey] = useState<string>(uuid.v4());
  const [iBoundKey, setIBoundKey] = useState<string>(uuid.v4());

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;

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
    const polygon = createPolygon(
      BoundingBox.fromObject(boundingBox),
      props.gridSize,
      props.cells.invert(props.gridSize),
      styles.inactive
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Todo
    setIBoundLayer(polygon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundingBox, props.cells, props.gridSize]);

  useEffect(() => {
    if (props.boundary) {
      const polygon = createPolygon(
        BoundingBox.fromObject(boundingBox), props.gridSize, props.boundary.cells, styles.affected
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO!
      setBoundaryLayer(polygon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.boundary]);

  useEffect(() => {
    setBoundaryKey(uuid.v4());
  }, [boundaryLayer]);

  useEffect(() => {
    setIBoundKey(uuid.v4());
  }, [iBoundLayer]);

  useEffect(() => {
    if (!props.boundary || !T03.boundaries || !boundaries) {
      return;
    }
    const sameTypeBoundaries = boundaries.all.filter(
      (b) => props.boundary && b.type === props.boundary.type && b.id !== props.boundary.id
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Todo
    setBoundaryLayers(sameTypeBoundaries.length > 0 ? sameTypeBoundaries.map(
      (b, key) => createPolygon(props.boundingBox, props.gridSize, b.cells, styles.other, key)
      ) : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [T03.boundaries]);

  if (!boundaries) {
    return null;
  }

  const createPolygon = (bbox: BoundingBox, gridSize: GridSize, cells: Cells, style: any, key?: number) => {

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

        const cXmin = bbox.xMin + gridSize.getDistanceXStart(x0) * bbox.dX;
        const cXmax = bbox.xMin + gridSize.getDistanceXEnd(x1) * bbox.dX;
        const cYmin = bbox.yMax - gridSize.getDistanceYStart(y) * bbox.dY;
        const cYmax = bbox.yMax - gridSize.getDistanceYEnd(y) * bbox.dY;

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

    if (props.rotation && props.rotation.angle % 360 !== 0) {
      turfPolygon = turf.transformRotate(
        turfPolygon,
        props.rotation.angle,
        { pivot: props.rotation.geometry.centerOfMass }
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
        <FeatureGroup>
          {iBoundLayer}
        </FeatureGroup>
      </LayersControl.Overlay>
      }
      {!!boundaryLayer &&
      <LayersControl.Overlay name="Affected cells" checked={true} key={boundaryKey}>
        <FeatureGroup>
          {boundaryLayer}
        </FeatureGroup>
      </LayersControl.Overlay>
      }
      {!!boundaryLayers && !!props.boundary &&
      <LayersControl.Overlay name={`Cells of other ${props.boundary.type} boundaries`} checked={true}>
        <FeatureGroup>
          {boundaryLayers}
        </FeatureGroup>
      </LayersControl.Overlay>
      }
    </LayersControl>
  );
};

export default AffectedCellsLayer;
