import { Array2D } from '../../../../core/model/geometry/Array2D.type';
import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import { BoundaryCollection, ModflowModel } from '../../../../core/model/modflow';
import { BoundaryFactory } from '../../../../core/model/modflow/boundaries';
import { ColorLegend } from '../../../shared/rasterData';
import { FlopyModflowMfbas } from '../../../../core/model/flopy/packages/mf';
import { FlopyPackages } from '../../../../core/model/flopy';
import { GeoJSON, MapConsumer, MapContainer, MapContainerProps, Pane } from 'react-leaflet';
import { IMapWithControlsOptions } from '../../../shared/leaflet/types';
import { IReactLeafletHeatMapProps } from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay.type';
import { IRootReducer } from '../../../../reducers';
import { LeafletEvent, LeafletMouseEvent, Map } from 'leaflet';
import { ReactNode } from 'react';
import { createGridData, rainbowFactory } from '../../../shared/rasterData/helpers';
import { getStyle } from '../../../../services/geoTools/mapHelpers';
import { renderBoundaryOverlays, renderBoundingBoxLayer } from './mapLayers';
import { useSelector } from 'react-redux';
import ContourLayer from '../../../shared/rasterData/contourLayer';
import GridRefinement from '../content/discretization/gridRefinement';
import GroupedAffectedCellsLayer from '../../../../services/geoTools/groupedAffectedCellsLayer';
import LayerControl, { GroupedLayer } from '../../../shared/leaflet/LayerControl';
import Rainbow from '../../../../services/rainbowvis/Rainbowvis';
import ReactLeafletHeatMapCanvasOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import _ from 'lodash';

interface IProps {
  children: ReactNode;
  onClick?: (e: LeafletMouseEvent) => any;
  onMoveEnd?: (e: LeafletEvent) => any;
  options?: IMapWithControlsOptions;
  raster?: Array2D<number>;
}

type TProps = IProps & MapContainerProps;

const defaultOptions: IMapWithControlsOptions = {
  area: {
    checked: true,
    enabled: true,
  },
  boundaries: {
    checked: false,
    enabled: true,
    excluded: [],
  },
  boundingBox: {
    checked: false,
    enabled: false,
  },
  fullScreenControl: true,
  grid: {
    checked: true,
    enabled: true,
  },
  raster: {
    enabled: false,
    layer: 0,
    quantile: 1,
  },
};

const MapWithControls = (props: TProps) => {
  let options: IMapWithControlsOptions = defaultOptions;

  if (props.options) {
    options = {
      ...options,
      ...props.options,
    };
  }

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
  let boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
  const packages = T03.packages && T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;

  if (boundaries && options.boundaries) {
    boundaries = BoundaryCollection.fromObject(
      T03.boundaries.filter((b) => {
        return options.boundaries && !options.boundaries.excluded.includes(BoundaryFactory.fromObject(b).type);
      })
    );
  }

  const getRainbow = () => {
    if (!options || !options.raster) {
      throw new Error('Function getRainbow can only be used if raster is enabled.');
    }
    const filteredData = _.sortBy(_.flatten(props.raster).filter((n) => n !== null));
    const q = Math.floor((options.raster.quantile / 100) * filteredData.length);
    let minData = filteredData[q];
    let maxData = filteredData[filteredData.length - q];
    if (options.raster.globalMinMax) {
      [minData, maxData] = options.raster.globalMinMax;
    }
    return rainbowFactory(
      { min: minData, max: maxData },
      options.raster.colors || ['#800080', '#ff2200', '#fcff00', '#45ff8e', '#15d6ff', '#0000FF']
    );
  };

  const renderLegend = (rainbow: Rainbow) => {
    const gradients = rainbow.gradients.slice().reverse();
    const lastGradient = gradients[gradients.length - 1];
    const legend = gradients.map((gradient) => ({
      color: '#' + gradient.endColor,
      value: Number(gradient.maxNum).toExponential(2),
    }));

    legend.push({
      color: '#' + lastGradient.startColor,
      value: Number(lastGradient.minNum).toExponential(2),
    });

    return <ColorLegend legend={legend} unit="m" />;
  };

  const renderRaster = () => {
    if (!model || !props.raster || !options.raster || !options.raster.enabled) {
      return null;
    }

    const rainbowVis = getRainbow();

    let ibound = undefined;

    if (packages) {
      const mfPackage = packages.mf.getPackage('bas');
      if (mfPackage instanceof FlopyModflowMfbas) {
        const cIbound = mfPackage.ibound;
        if (Array.isArray(cIbound) && Array.isArray(cIbound[0]) && cIbound.length > options.raster.layer) {
          const sIbound = cIbound as Array<Array2D<number>>;
          ibound = sIbound[options.raster.layer];
        }
      }
    }

    const mapProps = {
      nX: model.gridSize.nX,
      nY: model.gridSize.nY,
      rainbow: rainbowVis,
      data: createGridData(props.raster, model.gridSize.nX, model.gridSize.nY),
      bounds: model.boundingBox.getBoundsLatLng(),
      opacity: 0.75,
      sharpening: 10,
      zIndex: 1,
    } as IReactLeafletHeatMapProps;

    return (
      <>
        <Pane name="back" style={{ zIndex: 499 }}>
          <GroupedLayer name="Raster" group="Data" radio>
            <ReactLeafletHeatMapCanvasOverlay
              key="HEATMAP"
              nX={mapProps.nX}
              nY={mapProps.nY}
              data={mapProps.data}
              bounds={mapProps.bounds}
              rainbow={mapProps.rainbow}
              sharpening={mapProps.sharpening}
            />
          </GroupedLayer>
          <GroupedLayer checked name="Contours" group="Data" radio>
            <ContourLayer
              boundingBox={model.boundingBox}
              data={props.raster}
              geometry={model.geometry}
              gridSize={model.gridSize}
              ibound={ibound}
              rainbow={rainbowVis}
              rotation={model.rotation}
            />
          </GroupedLayer>
        </Pane>
      </>
    );
  };

  return (
    <MapContainer zoomControl={false} {...props}>
      <MapConsumer>
        {(map: Map) => {
          map.on('click', (e: LeafletMouseEvent) => (props.onClick ? props.onClick(e) : null));
          map.on('moveend', (e: LeafletEvent) => (props.onMoveEnd ? props.onMoveEnd(e) : null));
          return null;
        }}
      </MapConsumer>
      <BasicTileLayer />
      {props.raster ? renderLegend(getRainbow()) : null}
      <LayerControl events={options.events} position="topright">
        {props.raster ? renderRaster() : null}
        <Pane name="middle" style={{ zIndex: 500 }}>
          {model && options.area && options.area.enabled ? (
            <GroupedLayer checked={options.area.checked} name="Model Area" group="Discretization">
              <GeoJSON key={model.geometry.hash()} data={model.geometry.toGeoJSON()} style={getStyle('area')} />
            </GroupedLayer>
          ) : null}
          {model && options.boundingBox && options.boundingBox.enabled ? (
            <GroupedLayer checked={options.boundingBox.checked} name="Bounding Box" group="Discretization">
              {renderBoundingBoxLayer(model.boundingBox)}
            </GroupedLayer>
          ) : null}
          {model && options.grid && options.grid.enabled ? (
            <GroupedLayer name="Grid" group="Discretization">
              <GridRefinement boundingBox={model.boundingBox} gridSize={model.gridSize} selectedRowsAndColumns={null} />
            </GroupedLayer>
          ) : null}
          {model && options.inactiveCells && options.inactiveCells ? (
            <GroupedAffectedCellsLayer
              boundingBox={model.boundingBox}
              gridSize={model.gridSize}
              cells={model.cells}
              rotation={{ geometry: model.geometry, angle: model.rotation }}
            />
          ) : null}
          {boundaries && options.boundaries && options.boundaries.enabled
            ? renderBoundaryOverlays(boundaries, options.boundaries?.checked)
            : null}
        </Pane>
      </LayerControl>
      {props.children}
    </MapContainer>
  );
};

export default MapWithControls;
