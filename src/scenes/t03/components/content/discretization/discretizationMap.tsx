import * as turf from '@turf/turf';
import { BoundingBox, Cells, Geometry, GridSize } from '../../../../../core/model/geometry';
import { Button } from 'semantic-ui-react';
import { CALCULATE_CELLS_INPUT } from '../../../../modflow/worker/t03.worker';
import { Control, LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import { FeatureGroup, Polygon } from 'react-leaflet';
import { ICalculateCellsInputData } from '../../../../modflow/worker/t03.worker.type';
import { ICells } from '../../../../../core/model/geometry/Cells.type';
import { IGeometry } from '../../../../../core/model/geometry/Geometry.type';
import { IMapWithControlsOptions } from '../../../../shared/leaflet/types';
import { IRowsAndColumns, getRowsAndColumnsFromGeoJson } from '../../../../../services/geoTools';
import { addMessage } from '../../../actions/actions';
import { asyncWorker } from '../../../../modflow/worker/worker';
import { getCellFromClick, rotateCoordinateAroundPoint } from '../../../../../services/geoTools/getCellFromClick';
import { messageError } from '../../../defaults/messages';
import { useDispatch } from 'react-redux';
import AffectedCellsLayer from '../../../../../services/geoTools/affectedCellsLayer';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import GridRefinementPopup from './gridRefinementPopup';
import MapWithControls from '../../maps/mapWithControls';
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

const DiscretizationMap = (props: IProps) => {
  const cellsRef = useRef<Cells | null>(null);
  const mapRef = useRef<any>(null);
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

  const onCreated = (e: any) => {
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

  const onEdited = (e: any) => {
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

  const mapOptions: IMapWithControlsOptions = {
    area: {
      enabled: false,
    },
    boundaries: {
      checked: true,
      enabled: props.boundaries.length > 0,
      excluded: [],
    },
    boundingBox: {
      checked: true,
      enabled: true,
    },
    fullScreenControl: true,
    grid: {
      checked: mode === 'refinement',
      enabled: !!props.cells,
    },
  };

  const style = {
    height: '400px',
    width: '100%',
    cursor: 'pointer',
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
      <MapWithControls
        bounds={getBoundsLatLng() as LatLngBoundsExpression}
        maxZoom={16}
        style={style}
        onClick={mode === 'single' ? handleClickOnMap : undefined}
        options={mapOptions}
      >
        {!props.readOnly && (
          <>
            <FeatureGroup>
              <EditControl
                ref={refDrawControl}
                position="topleft"
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
                style={{ marginTop: '10px' }}
              />
              {geometry && (
                <Polygon
                  key={uniqueId()}
                  positions={Geometry.fromObject(geometry).coordinatesLatLng as LatLngExpression[]}
                />
              )}
            </FeatureGroup>
            {mode !== 'refinement' && renderActiveCellsLayer()}
          </>
        )}
      </MapWithControls>
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
