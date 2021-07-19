import * as turf from '@turf/turf';
import { FeatureGroup, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import BoundingBox from '../../core/model/geometry/BoundingBox';
import GridSize from '../../core/model/geometry/GridSize';
import React from 'react';

interface IProps {
  boundingBox: BoundingBox;
  gridSize: GridSize;
  rotation?: number;
}

const styles = {
  line: {
    stroke: true,
    color: '#6c6e69',
    weight: 1
  }
};

const grid = (props: IProps) => {
  const { boundingBox, gridSize } = props;

  const rotate = (positions: Array<[number, number]>) => {
    if (!props.rotation || props.rotation % 360 === 0) {
      return positions;
    }
    const lineString = turf.lineString(positions);
    const withRotation = turf.transformRotate(lineString, props.rotation);
    if (withRotation.geometry) {
      return withRotation.geometry.coordinates as LatLngExpression[];
    }
    return positions;
  };

  const horizontalLines = () => {
    const horizontalPositions: Array<[number, number]> = [];
    for (let i = 0; i <= gridSize.nY; i++) {
      const x = [boundingBox.xMin, boundingBox.xMax];
      const y = boundingBox.yMin + gridSize.getDistanceYStart(i) * boundingBox.dY;
      horizontalPositions.push([y, x[i % 2 === 1 ? 0 : 1]], [y, x[i % 2 === 1 ? 1 : 0]]);
    }
    return rotate(horizontalPositions);
  };

  const verticalLines = () => {
    const verticalPositions: Array<[number, number]> = [];
    for (let i = 0; i <= gridSize.nX; i++) {
      const x = boundingBox.xMin + gridSize.getDistanceXStart(i) * boundingBox.dX;
      const y = [boundingBox.yMin, boundingBox.yMax];
      verticalPositions.push([y[i % 2 === 1 ? 0 : 1], x], [y[i % 2 === 1 ? 1 : 0], x]);
    }
    return rotate(verticalPositions);
  };

  return (
    <FeatureGroup>
      <Polyline
        positions={horizontalLines()}
        {...styles.line}
      />
      <Polyline
        positions={verticalLines()}
        {...styles.line}
      />
    </FeatureGroup>
  );
};

export default grid;
