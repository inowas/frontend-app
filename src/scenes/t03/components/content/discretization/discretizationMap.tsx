import * as turf from '@turf/turf';
import { BasicTileLayer } from '../../../../../services/geoTools/tileLayers';
import { BoundingBox, Cells, Geometry, GridSize } from '../../../../../core/model/geometry';
import { Button } from 'semantic-ui-react';
import { CALCULATE_CELLS_INPUT } from '../../../../modflow/worker/t03.worker';
import { Control, DrawEvents, LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import { FeatureGroup, LayersControl, Map } from 'react-leaflet';
import { ICalculateCellsInputData } from '../../../../modflow/worker/t03.worker.type';
import { ICells } from '../../../../../core/model/geometry/Cells.type';
import { IGeometry } from '../../../../../core/model/geometry/Geometry.type';
import { IRowsAndColumns, getRowsAndColumnsFromGeoJson } from '../../../../../services/geoTools';
import { Polygon } from 'react-leaflet';
import { addMessage } from '../../../actions/actions';
import { asyncWorker } from '../../../../modflow/worker/worker';
import { getCellFromClick, rotateCoordinateAroundPoint } from '../../../../../services/geoTools/getCellFromClick';
import { messageError } from '../../../defaults/messages';
import { renderBoundaryOverlays, renderBoundingBoxLayer } from '../../maps/mapLayers';
import { useDispatch } from 'react-redux';
import AffectedCellsLayer from '../../../../../services/geoTools/affectedCellsLayer';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import GridRefinement from './gridRefinement';
import GridRefinementPopup from './gridRefinementPopup';
import React, { useEffect, useRef, useState } from 'react';
import _, { uniqueId } from 'lodash';

interface IProps {
  boundingBox: BoundingBox;
  boundaries: BoundaryCollection;
  cells: Cells | null;
  geometry: Geometry | null;
  gridSize: GridSize;
  intersection?: number;
  readOnly: boolean;
  rotation?: number;
  onChangeCells: (cells: Cells) => void;
  onChangeGeometry?: (geometry: Geometry) => void;
  onChangeGridSize?: (gridSize: GridSize) => void;
}

const style = {
  map: {
    height: '400px',
    width: '100%',
  },
};

const DiscretizationMap = (props: IProps) => {
  const cellsRef = useRef<Cells | null>(null);
  const mapRef = useRef<Map>(null);
  const readOnlyRef = useRef<boolean>(true);
  const refDrawControl = useRef<Control>(null);
  const [geometry, setGeometry] = useState<IGeometry | null>(null);
  const [mode, setMode] = useState<string>('single');
  const [selected, setSelected] = useState<IRowsAndColumns | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.cells) {
      cellsRef.current = props.cells;
    }

    if (props.geometry) {
      setGeometry(props.geometry.toObject());
    }

    readOnlyRef.current = props.readOnly;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.geometry) {
      setGeometry(props.geometry.toObject());
    }
  }, [props.geometry]);

  useEffect(() => {
    if (props.cells) {
      cellsRef.current = props.cells;
    }
  }, [props.cells]);

  useEffect(() => {
    readOnlyRef.current = props.readOnly;
  }, [props.readOnly]);

  const onCreated = (e: DrawEvents.Created) => {
    if (mode === 'refinement' && e.layerType === 'rectangle') {
      if (mapRef && mapRef.current) {
        mapRef.current.leafletElement.removeLayer(e.layer);
      }

      const r = getRowsAndColumnsFromGeoJson(e.layer.toGeoJSON(), props.boundingBox, props.gridSize);
      setSelected(r);
      return;
    }

    if ((mode === 'multi' && e.layerType === 'polygon') || e.layerType === 'polyline') {
      if (!cellsRef.current || !props.geometry) {
        return;
      }

      if (mapRef && mapRef.current) {
        mapRef.current.leafletElement.removeLayer(e.layer);
      }

      let g = Geometry.fromGeoJson(e.layer.toGeoJSON()).toGeoJSON();
      if (props.geometry && props.rotation && props.rotation % 360 !== 0) {
        g = turf.transformRotate(g, -1 * props.rotation, { pivot: props.geometry.centerOfMass });
      }

      asyncWorker({
        type: CALCULATE_CELLS_INPUT,
        data: {
          geometry: g,
          boundingBox: props.boundingBox.toObject(),
          gridSize: props.gridSize.toObject(),
          intersection: props.intersection || 0,
        } as ICalculateCellsInputData,
      })
        .then((rCells: ICells) => {
          const cCells: Cells | null = cellsRef.current;
          if (cCells) {
            rCells.forEach((rC) => {
              cCells.toggle([rC[0], rC[1]], props.boundingBox, props.gridSize, false);
            });
            cellsRef.current = cCells;
            return props.onChangeCells(cCells);
          }
        })
        .catch(() => {
          dispatch(addMessage(messageError('discretizationMap', 'Calculating cells failed.')));
        });
      return;
    }
    if (!props.onChangeGeometry) {
      return;
    }
    const polygon = e.layer;
    const g2 = Geometry.fromGeoJson(polygon.toGeoJSON());
    setGeometry(g2.toObject());
    return props.onChangeGeometry(g2);
  };

  const onEdited = (e: DrawEvents.Edited) => {
    e.layers.eachLayer((layer: any) => {
      if (!props.onChangeGeometry) {
        return;
      }
      const g = Geometry.fromGeoJson(layer.toGeoJSON());
      setGeometry(g.toObject());
      props.onChangeGeometry(g);
    });
  };

  const getBoundsLatLng = () => {
    if (props.boundingBox) {
      return props.boundingBox.getBoundsLatLng();
    }

    if (geometry) {
      return Geometry.fromObject(geometry).getBoundsLatLng();
    }

    return [
      [60, 10],
      [45, 30],
    ];
  };

  const handleCancelSelection = () => {
    setSelected(null);
  };

  const handleChangeGridRefinement = (gridSize?: GridSize) => {
    if (gridSize && props.onChangeGridSize) {
      props.onChangeGridSize(gridSize);
    }
    setSelected(null);
  };

  const handleClickOnMap = ({ latlng }: { latlng: any }) => {
    if (
      mode !== 'single' ||
      readOnlyRef.current ||
      !cellsRef.current ||
      !props.boundingBox ||
      !props.gridSize ||
      !props.geometry ||
      latlng.lat < props.boundingBox.yMin ||
      latlng.lat > props.boundingBox.yMax ||
      latlng.lng < props.boundingBox.xMin ||
      latlng.lng > props.boundingBox.xMax
    ) {
      return null;
    }

    const latlngRot = props.rotation
      ? rotateCoordinateAroundPoint(latlng, props.geometry.centerOfMass, props.rotation)
      : latlng;

    const clickedCell = getCellFromClick(
      props.boundingBox,
      props.gridSize,
      latlngRot,
      props.rotation,
      props.geometry.centerOfMass
    );

    const c: Cells = cellsRef.current;
    c.toggle(clickedCell, props.boundingBox, props.gridSize, false);
    cellsRef.current = _.cloneDeep(c);
    props.onChangeCells(c);
  };

  const handleToggleDrawing = (m: string) => () => setMode(m);

  const renderActiveCellsLayer = () => {
    if (!props.cells) {
      return null;
    }
    if (props.geometry && props.rotation && props.rotation % 360 !== 0) {
      return (
        <AffectedCellsLayer
          boundingBox={props.boundingBox}
          gridSize={props.gridSize}
          cells={props.cells}
          rotation={{ geometry: props.geometry, angle: props.rotation }}
        />
      );
    }
    return <AffectedCellsLayer boundingBox={props.boundingBox} gridSize={props.gridSize} cells={props.cells} />;
  };

  return (
    <React.Fragment>
      {!props.readOnly && (
        <Button.Group attached="top">
          <Button primary={mode === 'single'} onClick={handleToggleDrawing('single')}>
            Single Selection
          </Button>
          <Button primary={mode === 'multi'} onClick={handleToggleDrawing('multi')}>
            Multi-Selection
          </Button>
          <Button primary={mode === 'refinement'} onClick={handleToggleDrawing('refinement')}>
            Grid Refinement
          </Button>
        </Button.Group>
      )}
      <Map
        style={style.map}
        bounds={getBoundsLatLng() as LatLngBoundsExpression}
        onclick={handleClickOnMap}
        ref={mapRef}
      >
        <BasicTileLayer />
        {!props.readOnly && (
          <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: mode === 'multi' && geometry !== null,
                rectangle: mode === 'refinement' && geometry !== null,
                polygon: geometry === null || mode === 'multi',
              }}
              edit={{
                edit: mode !== 'refinement' && geometry !== null && !!props.onChangeGeometry,
                remove: false,
              }}
              onCreated={onCreated}
              onEdited={onEdited}
              ref={refDrawControl}
            />
            {geometry && (
              <Polygon
                key={uniqueId()}
                positions={Geometry.fromObject(geometry).coordinatesLatLng as LatLngExpression[]}
              />
            )}
          </FeatureGroup>
        )}
        {props.boundaries.length > 0 && (
          <LayersControl position="topright">{renderBoundaryOverlays(props.boundaries)}</LayersControl>
        )}
        {mode !== 'refinement' && renderActiveCellsLayer()}
        {renderBoundingBoxLayer(props.boundingBox, props.rotation, props.geometry || undefined)}
        {mode === 'refinement' && (
          <GridRefinement
            boundingBox={props.boundingBox}
            geometry={props.geometry || undefined}
            gridSize={props.gridSize}
            rotation={props.rotation}
            selectedRowsAndColumns={selected}
          />
        )}
      </Map>
      {selected && (
        <div
          style={{
            bottom: '110px',
            position: 'absolute',
            right: '25px',
            zIndex: 1000,
          }}
        >
          <GridRefinementPopup
            gridSize={props.gridSize}
            onCancel={handleCancelSelection}
            onChange={handleChangeGridRefinement}
            selectedColumns={selected && selected.columns ? selected.columns : []}
            selectedRows={selected && selected.rows ? selected.rows : []}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default DiscretizationMap;
