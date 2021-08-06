import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {FeatureGroup, GeoJSON, Pane} from 'react-leaflet';
import {Geometry, ModflowModel} from '../../../core/model/modflow';
import {ICell} from '../../../core/model/geometry/Cells.type';
import {LeafletMouseEvent} from 'leaflet';
import {getCellFromClick} from '../../../services/geoTools/getCellFromClick';
import MapWithControls, {IMapWithControlsOptions} from '../../t03/components/maps/mapWithControls';
import React, {useEffect, useRef, useState} from 'react';
import uuid from 'uuid';

const style = {
  map: {
    height: '400px',
    width: '100%',
    cursor: 'pointer'
  },
  selectedRow: {
    color: '#000',
    weight: 0.5,
    opacity: 0.5,
    fillColor: '#000',
    fillOpacity: 0.5
  },
  selectedCol: {
    color: '#000',
    weight: 0.5,
    opacity: 0.5,
    fillColor: '#000',
    fillOpacity: 0.5
  }
};

interface IProps {
  activeCell: ICell;
  boundaries: BoundaryCollection;
  data: Array2D<number>;
  globalMinMax?: [number, number];
  ibound?: Array2D<number>;
  mode?: 'contour' | 'heatmap';
  model: ModflowModel;
  onClick: (cell: ICell) => any;
  onViewPortChange?: (viewport: any) => any;
  viewport?: any;
  colors?: string[];
  opacity?: number;
}

interface IState {
  viewport: any;
}

const ResultsMap = (props: IProps) => {
  const [state, setState] = useState<IState>({viewport: null});
  const [renderKey, setRenderKey] = useState<string>(uuid.v4());
  const mapRef = useRef<any>(null);

  useEffect(() => {
      const {viewport} = props;
      if (viewport) {
        setState({viewport});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (props.viewport) {
      setState({viewport: props.viewport});
    }
  }, [props.viewport]);

  useEffect(() => {
    setRenderKey(uuid.v4());
  }, [props.activeCell]);

  const handleClickOnMap = ({latlng}: LeafletMouseEvent) => {
    const activeCell = getCellFromClick(
      props.model.boundingBox,
      props.model.gridSize,
      latlng,
      props.model.rotation,
      props.model.geometry.centerOfMass
    );

    if (!props.model.gridSize.isWithIn(activeCell[0], activeCell[1])) {
      return;
    }

    props.onClick(activeCell);
  };

  const renderSelectedRowAndCol = () => {
    const [selectedCol, selectedRow] = props.activeCell;
    const {boundingBox, gridSize} = props.model;

    const rowXMin = boundingBox.xMin;
    const rowXMax = boundingBox.xMax;
    const rowYMin = boundingBox.yMax - gridSize.getDistanceYStart(selectedRow) * boundingBox.dY;
    const rowYMax = boundingBox.yMax - gridSize.getDistanceYEnd(selectedRow) * boundingBox.dY;

    const selectedRowJson = Geometry.fromGeoJson({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [rowXMin, rowYMin],
            [rowXMax, rowYMin],
            [rowXMax, rowYMax],
            [rowXMin, rowYMax],
            [rowXMin, rowYMax]
          ]
        ]
      }
    });

    const colXMin = boundingBox.xMin + gridSize.getDistanceXStart(selectedCol) * boundingBox.dX;
    const colXMax = boundingBox.xMin + gridSize.getDistanceXEnd(selectedCol) * boundingBox.dX;
    const colYMin = boundingBox.yMin;
    const colYMax = boundingBox.yMax;

    const selectedColJson = Geometry.fromGeoJson({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [colXMin, colYMin],
            [colXMax, colYMin],
            [colXMax, colYMax],
            [colXMin, colYMax],
            [colXMin, colYMax]
          ]
        ]
      }
    });

    return (
      <FeatureGroup key={renderKey}>
        <GeoJSON
          data={selectedColJson.toGeoJSONWithRotation(
            -1 * props.model.rotation, props.model.geometry.centerOfMass
          )}
          style={style.selectedCol}
        />
        <GeoJSON
          data={selectedRowJson.toGeoJSONWithRotation(
            -1 * props.model.rotation, props.model.geometry.centerOfMass
          )}
          style={style.selectedCol}
        />
      </FeatureGroup>
    );
  };

  const handleViewPortChange = () => {
    if (!mapRef.current) {
      return;
    }

    const {viewport} = mapRef.current;
    setState({viewport});

    if (!props.onViewPortChange) {
      return;
    }

    return props.onViewPortChange(viewport);
  };

  const options: IMapWithControlsOptions = {
    raster: {
      colors: props.colors || ['#800080', '#ff2200', '#fcff00', '#45ff8e', '#15d6ff', '#0000FF'],
      enabled: true,
      globalMinMax: props.globalMinMax,
      layer: 0,
      quantile: 1
    }
  };

  return (
    <MapWithControls
      ref={mapRef}
      style={style.map}
      bounds={state.viewport ? undefined : props.model.geometry.getBoundsLatLng()}
      zoom={state.viewport && state.viewport.zoom ? state.viewport.zoom : undefined}
      center={state.viewport && state.viewport.center ? state.viewport.center : undefined}
      onClick={handleClickOnMap}
      boundsOptions={{padding: [20, 20]}}
      onMoveEnd={handleViewPortChange}
      options={options}
      raster={props.data}
    >
      <BasicTileLayer/>
      <Pane name="front" style={{zIndex: 501}}>
        {renderSelectedRowAndCol()}
      </Pane>
    </MapWithControls>
  );
};

export default ResultsMap;
