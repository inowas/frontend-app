import * as GeoJson from 'geojson';
import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import {
  Boundary,
  BoundaryCollection,
  HeadObservationWell,
  LineBoundary,
} from '../../../../core/model/modflow/boundaries';
import { CircleMarker, Polygon, Polyline, Tooltip } from 'react-leaflet';
import { Geometry } from '../../../../core/model/modflow';
import { LatLngExpression } from 'leaflet';
import { getStyle } from './index';
import { uniqueId } from 'lodash';
import MapWithControls, { IMapWithControlsOptions } from './mapWithControls';
import React, { Component } from 'react';
import WellBoundary from '../../../../core/model/modflow/boundaries/WellBoundary';

interface IProps {
  boundary: Boundary;
  boundaries: BoundaryCollection;
  geometry: Geometry;
  selectedObservationPointId?: string;
  onClick?: (bid: string) => any;
  onClickObservationPoint?: (bid: string) => any;
}

const style = {
  map: {
    height: '400px',
  },
};

class BoundaryMap extends Component<IProps> {
  public renderObservationPoints(b: Boundary) {
    if (!(b instanceof LineBoundary)) {
      return null;
    }

    if (b.observationPoints.length <= 1) {
      return null;
    }

    const observationPoints = b.observationPoints;
    return observationPoints
      .map((op) => {
        if (op.geometry) {
          const selected = op.id === this.props.selectedObservationPointId ? '_selected' : '';
          return (
            <CircleMarker
              key={uniqueId(op.id)}
              center={[op.geometry.coordinates[1], op.geometry.coordinates[0]]}
              onClick={this.handleClickObservationPoint(op.id)}
              {...getStyle('op' + selected)}
            >
              <Tooltip offset={[0, 0]} opacity={1} sticky={true}>
                <b>{op.name}</b>
                <br />
                {op.geometry.coordinates[1] >= 0 ? 'N ' : 'S '}
                {op.geometry.coordinates[1].toFixed(3)}
                {op.geometry.coordinates[0] >= 0 ? ' E ' : ' W '}
                {op.geometry.coordinates[0].toFixed(3)}
              </Tooltip>
            </CircleMarker>
          );
        }
        return null;
      })
      .filter((x) => x);
  }

  public renderBoundaryGeometry(b: Boundary, underlay = false) {
    const geometry = b.geometry;

    if (!geometry) {
      return;
    }

    if (underlay) {
      switch (geometry.type.toLowerCase()) {
        case 'point':
          return (
            <CircleMarker
              key={uniqueId(Geometry.fromObject(geometry as GeoJson.Point).hash())}
              center={[geometry.coordinates[1], geometry.coordinates[0]]}
              {...getStyle('underlay')}
              onClick={this.handleClickBoundary(b.id)}
            />
          );
        case 'linestring':
          return (
            <Polyline
              key={uniqueId(Geometry.fromObject(geometry as GeoJson.LineString).hash())}
              positions={Geometry.fromObject(geometry as GeoJson.LineString).coordinatesLatLng}
              {...getStyle('underlay')}
              onClick={this.handleClickBoundary(b.id)}
            />
          );
        default:
          return null;
      }
    }

    switch (geometry.type.toLowerCase()) {
      case 'point':
        return b instanceof WellBoundary || b instanceof HeadObservationWell ? (
          <CircleMarker
            key={uniqueId(Geometry.fromObject(geometry as GeoJson.Point).hash())}
            center={[geometry.coordinates[1], geometry.coordinates[0]]}
            {...getStyle(b.type, b instanceof WellBoundary ? b.wellType : undefined)}
          />
        ) : null;
      case 'linestring':
        return (
          <Polyline
            key={uniqueId(Geometry.fromObject(geometry as GeoJson.LineString).hash())}
            positions={Geometry.fromObject(geometry as GeoJson.LineString).coordinatesLatLng as LatLngExpression[]}
          />
        );
      case 'polygon':
        return (
          <Polygon
            key={uniqueId(Geometry.fromObject(geometry as GeoJson.Polygon).hash())}
            positions={Geometry.fromObject(geometry as GeoJson.Polygon).coordinatesLatLng as LatLngExpression[]}
          />
        );
      default:
        return null;
    }
  }

  public renderOtherBoundaries(boundaries: BoundaryCollection) {
    return boundaries.boundaries
      .filter((b: Boundary) => b.id !== this.props.boundary.id && b.type === this.props.boundary.type)
      .map((b: Boundary) => this.renderBoundaryGeometry(b, true));
  }

  public render() {
    const { geometry, boundary, boundaries } = this.props;

    const mapOptions: IMapWithControlsOptions = {
      area: {
        checked: true,
        enabled: true,
      },
      boundaries: {
        checked: false,
        enabled: true,
        excluded: [boundary.type],
      },
      boundingBox: {
        checked: true,
        enabled: true,
      },
      grid: {
        checked: false,
        enabled: true,
      },
    };

    return (
      <MapWithControls style={style.map} bounds={geometry.getBoundsLatLng()} options={mapOptions}>
        <BasicTileLayer />
        {boundaries.length > 0 && this.renderOtherBoundaries(boundaries)}
        {this.renderBoundaryGeometry(boundary)}
        {this.renderObservationPoints(boundary)}
      </MapWithControls>
    );
  }

  private handleClickBoundary = (bid: string) => () => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.props.onClick) {
      return this.props.onClick(bid);
    }
  };

  private handleClickObservationPoint = (bid: string) => () => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.props.onClickObservationPoint) {
      return this.props.onClickObservationPoint(bid);
    }
  };
}

export default BoundaryMap;
