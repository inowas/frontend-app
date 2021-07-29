import * as turf from '@turf/turf';
import { Array2D } from '../../../../core/model/geometry/Array2D.type';
import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import {
  Boundary,
  BoundaryCollection,
  LineBoundary, WellBoundary,
} from '../../../../core/model/modflow/boundaries';
import { CALCULATE_CELLS_INPUT } from '../../../modflow/worker/t03.worker';
import { Cells, Geometry, ModflowModel } from '../../../../core/model/modflow';
import { CircleMarker, FeatureGroup, GeoJSON, MapContainer, Polygon, Polyline } from 'react-leaflet';
import { Dimmer, Grid, Icon, List, Loader } from 'semantic-ui-react';
import { EditControl } from 'react-leaflet-draw';
import { GeoJson } from '../../../../core/model/geometry/Geometry.type';
import { ICalculateCellsInputData } from '../../../modflow/worker/t03.worker.type';
import { ICells } from '../../../../core/model/geometry/Cells.type';
import { LatLngExpression } from 'leaflet';
import { LineString, Point } from 'geojson';
import { SoilmodelLayer } from '../../../../core/model/modflow/soilmodel';
import { addMessage } from '../../actions/actions';
import { asyncWorker } from '../../../modflow/worker/worker';
import { getCellFromClick, rotateCoordinateAroundPoint } from '../../../../services/geoTools/getCellFromClick';
import { getStyle } from './index';
import { messageError } from '../../defaults/messages';
import { uniqueId } from 'lodash';
import { useDispatch } from 'react-redux';
import AffectedCellsLayer from '../../../../services/geoTools/affectedCellsLayer';
import BoundingBox from '../../../../core/model/geometry/BoundingBox';
import GridSize from '../../../../core/model/geometry/GridSize';
import React, { useState } from 'react';
import Soilmodel from '../../../../core/model/modflow/soilmodel/Soilmodel';
import math from 'mathjs';

const style = {
  map: {
    height: '500px',
    width: '100%'
  }
};

interface IProps {
  model: ModflowModel;
  boundary: Boundary;
  boundaries: BoundaryCollection;
  onChange: (boundary: Boundary) => void;
  readOnly: boolean;
  showActiveCells: boolean;
  showBoundaryGeometry: boolean;
  soilmodel: Soilmodel;
}

const BoundaryDiscretizationMap = (props: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const calculate = (boundary: Boundary, geometry: Geometry, boundingBox: BoundingBox, gridSize: GridSize) => {
    setIsLoading(true);
    let g = geometry.toGeoJSON();
    if (props.model.rotation % 360 !== 0) {
      g = turf.transformRotate(
        geometry.toGeoJSON(), -1 * props.model.rotation, { pivot: props.model.geometry.centerOfMass }
      );
    }
    asyncWorker({
      type: CALCULATE_CELLS_INPUT,
      data: {
        geometry: g,
        boundingBox: boundingBox.toObject(),
        gridSize: gridSize.toObject(),
        intersection: props.model.intersection
      } as ICalculateCellsInputData
    }).then((c: ICells) => {
      boundary.cells = Cells.fromObject(Cells.fromObject(c).removeCells(props.model.inactiveCells));
      boundary.geometry = geometry;
      props.onChange(boundary);
      setIsLoading(false);
    }).catch(() => {
      dispatch(addMessage(messageError('boundaries', 'Calculating cells failed.')));
      setIsLoading(false);
    });
  };

  const handleOnEdited = (e: any) => {
    const { boundary, model } = props;
    const { boundingBox, gridSize } = model;

    e.layers.eachLayer((layer: any) => {
      const geometry = Geometry.fromGeoJson(layer.toGeoJSON());
      calculate(boundary, geometry, boundingBox, gridSize);
    });
  };

  const renderBoundaryGeometry = (b: Boundary, underlay = false) => {
    const geometryType = b.geometryType;

    if (underlay) {
      switch (geometryType.toLowerCase()) {
        case 'point':
          return (
            <CircleMarker
              key={uniqueId(Geometry.fromObject(b.geometry as Point).hash())}
              center={[
                b.geometry.coordinates[1],
                b.geometry.coordinates[0]
              ]}
              {...getStyle('underlay')}
            />
          );
        case 'linestring':
          return (
            <Polyline
              key={uniqueId(Geometry.fromObject(b.geometry as LineString).hash())}
              positions={Geometry.fromObject(b.geometry as LineString).coordinatesLatLng}
              {...getStyle('underlay')}
            />
          );
        default:
          return null;
      }
    }

    switch (geometryType.toLowerCase()) {
      case 'point':
        return (
          <CircleMarker
            key={uniqueId(Geometry.fromObject(b.geometry as Point).hash())}
            center={[
              b.geometry.coordinates[1],
              b.geometry.coordinates[0]
            ]}
            {...getStyle(b.type, (b as WellBoundary).wellType)}
          />
        );
      case 'linestring':
        return (
          <Polyline
            key={uniqueId(Geometry.fromObject(b.geometry as GeoJson).hash())}
            positions={
              Geometry.fromObject(b.geometry as LineString).coordinatesLatLng as LatLngExpression[]
            }
          />
        );
      case 'polygon':
        return (
          <Polygon
            key={Geometry.fromObject(b.geometry as GeoJson).hash()}
            positions={
              Geometry.fromObject(b.geometry as GeoJSON.Polygon).coordinatesLatLng as LatLngExpression[][]
            }
          />
        );
      default:
        return null;
    }
  };

  const renderOtherBoundaries = (boundaries: BoundaryCollection) => {
    return boundaries.boundaries
      .filter((b) => b.id !== props.boundary.id)
      .map((b) => renderBoundaryGeometry(b, true));
  };

  const showBoundaryGeometry = () => {
    const { boundary, readOnly, showActiveCells } = props;

    // When rendering Cells, the geometry should not be editable
    if (readOnly || showActiveCells) {
      return (renderBoundaryGeometry(boundary));
    }

    return (
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            rectangle: false,
            polygon: false
          }}
          edit={{
            edit: true,
            remove: false
          }}
          onEdited={handleOnEdited}
        />
        {renderBoundaryGeometry(boundary)}
      </FeatureGroup>
    );
  };

  const modelGeometryLayer = () => {
    const { geometry } = props.model;
    return (
      <GeoJSON
        key={geometry.hash()}
        data={geometry.toGeoJSON()}
        style={getStyle('area')}
      />
    );
  };

  const affectedCellsLayer = () => {
    const affectedLayers = props.boundary.layers;

    let cells: Array2D<number> = props.model.cells.toRaster(props.model.gridSize);
    affectedLayers.forEach((l) => {
      const layer = SoilmodelLayer.fromObject(props.soilmodel.layersCollection.all[l]);
      const data = layer.getValueOfParameter('ibound');
      if (data && Array.isArray(data)) {
        cells = math.dotMultiply(cells, data) as Array2D<number>;
      }
    });

    return (
      <AffectedCellsLayer
        boundary={props.boundary}
        boundingBox={props.model.boundingBox}
        gridSize={props.model.gridSize}
        cells={Cells.fromRaster(cells)}
        rotation={{
          geometry: props.model.geometry,
          angle: props.model.rotation
        }}
      />
    );
  };

  const handleClickOnMap = ({ latlng }: { latlng: { lng: number, lat: number } }) => {
    if (!props.showActiveCells || props.readOnly) {
      return null;
    }

    const boundary = props.boundary;
    const cells = Cells.fromObject(boundary.cells.cells);
    const boundingBox = props.model.boundingBox;
    const gridSize = props.model.gridSize;

    const latlngRot = props.model.rotation ?
      rotateCoordinateAroundPoint(latlng, props.model.geometry.centerOfMass, props.model.rotation) : latlng;

    const clickedCell = getCellFromClick(
      props.model.boundingBox, props.model.gridSize, latlngRot, props.model.rotation, props.model.geometry.centerOfMass
    );

    cells.toggle(clickedCell, boundingBox, gridSize, false);

    if (boundary instanceof LineBoundary) {
      cells.calculateValues(boundary, boundingBox, gridSize);
    }

    boundary.cells = Cells.fromObject(cells.toObject());
    props.onChange(boundary);
  };

  const legend = [
    { active: true, name: 'AFFECTED', color: '#393B89' },
    { active: true, name: 'INACTIVE', color: '#888888' },
    { active: true, name: 'OTHER', color: '#9C9EDE' }
  ];

  return (
    <Grid>
      <Grid.Column width={props.showActiveCells ? 13 : 16}>
        <Dimmer active={isLoading} inverted={true}>
          <Loader>Loading</Loader>
        </Dimmer>
        <MapContainer
          style={style.map}
          bounds={props.model.boundingBox.getBoundsLatLng()}
          onClick={!props.readOnly && handleClickOnMap}
        >
          <BasicTileLayer />
          {renderOtherBoundaries(props.boundaries)}
          {props.showBoundaryGeometry && showBoundaryGeometry()}
          {modelGeometryLayer()}
          {props.showActiveCells && affectedCellsLayer()}
        </MapContainer>
      </Grid.Column>
      {props.showActiveCells &&
        <Grid.Column width={3}>
          <List>
            <List.Item>
              {legend.map((c, key) =>
                <List.Item
                  key={key}
                >
                  <Icon
                    style={{
                      color: c.color
                    }}
                    name="square"
                  />
                  {c.name}
                </List.Item>
              )}
            </List.Item>
          </List>
        </Grid.Column>
      }
    </Grid>
  );
};

export default BoundaryDiscretizationMap;
