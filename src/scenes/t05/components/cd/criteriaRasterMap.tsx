import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import { BoundingBox } from '../../../../core/model/geometry';
import { Button, Icon } from 'semantic-ui-react';
import { ColorLegend, ColorLegendDiscrete } from '../../../shared/rasterData';
import { EditControl } from 'react-leaflet-draw';
import { FeatureGroup, MapContainer, Rectangle } from 'react-leaflet';
import { ILegendItemDiscrete, RainbowOrLegend } from '../../../../services/rainbowvis/types';
import { LeafletMouseEvent } from 'leaflet';
import { RasterLayer } from '../../../../core/model/mcda/gis';
import { createGridData } from '../../../shared/rasterData/helpers';
import { getActiveCellFromCoordinate } from '../../../../services/geoTools';
import { getStyle } from '../../../t03/components/maps';
import { useEffect, useState } from 'react';
import CanvasHeatMapOverlay from '../../../shared/rasterData/leafletCanvasHeatMapOverlay';
import GridSize from '../../../../core/model/geometry/GridSize';
import Rainbow from '../../../../services/rainbowvis/Rainbowvis';
import RasterDataImage from '../../../shared/rasterData/rasterDataImage';

const options = {
  edit: {
    remove: false
  },
  draw: {
    polyline: false,
    polygon: false,
    rectangle: false,
    circle: false,
    circlemarker: false,
    marker: false,
    poly: {
      allowIntersection: false
    }
  }
};

const maximumGridCells = 10000;

interface IProps {
  gridSize: GridSize;
  onChange?: (raster: RasterLayer) => any;
  onClickCell?: ({ x, y }: { x: number, y: number }) => any;
  raster: RasterLayer;
  showBasicLayer: boolean;
  showButton: boolean;
  showLegend: boolean;
  legend?: RainbowOrLegend;
  mapHeight?: string;
}

const CriteriaRasterMap = (props: IProps) => {
  const [showMap, setShowMap] = useState<boolean>(
    props.gridSize.nX * props.gridSize.nY <= maximumGridCells
  );

  useEffect(() => {
    setShowMap(props.showBasicLayer || props.gridSize.nX * props.gridSize.nY <= maximumGridCells);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showBasicLayer, props.raster]);

  const handleClickMap = (e: LeafletMouseEvent) => {
    const latlng = e.latlng;
    if (latlng && props.onClickCell !== undefined) {
      const cRaster = props.raster;

      const cell = getActiveCellFromCoordinate(
        [latlng.lng, latlng.lat],
        cRaster.boundingBox,
        props.gridSize
      );

      if (cell[0] < 0 || cell[1] < 0 || cell[0] >= props.gridSize.nX || cell[1] >= props.gridSize.nY) {
        return;
      }

      return props.onClickCell({ x: cell[0], y: cell[1] });
    }
  };

  const handleEditPath = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      const cBoundingBox = BoundingBox.fromGeoJson(layer);
      const cRaster = props.raster;
      raster.boundingBox = cBoundingBox;
      if (props.onChange !== undefined) {
        props.onChange(cRaster);
      }
    });
  };

  const handleToggleShowMap = () => setShowMap(!showMap);

  const renderLegend = (rainbow: RainbowOrLegend) => {
    if (rainbow instanceof Rainbow) {
      const gradients = rainbow.gradients.slice().reverse();
      const lastGradient = gradients[gradients.length - 1];
      const legend = gradients.map((gradient) => ({
        color: '#' + gradient.endColor,
        value: Number(gradient.maxNum).toFixed(2)
      }));

      legend.push({
        color: '#' + lastGradient.startColor,
        value: Number(lastGradient.minNum).toFixed(2)
      });
      return <ColorLegend legend={legend} unit={''} />;
    }
    return <ColorLegendDiscrete legend={rainbow as ILegendItemDiscrete[]} unit={''} />;
  };

  const { gridSize, raster, showButton } = props;
  const { boundingBox } = props.raster;

  if (!showMap) {
    return (
      <div>
        {showButton &&
          <Button
            icon={true}
            fluid={true}
            onClick={handleToggleShowMap}
            labelPosition="left"
          >
            <Icon name="map" />
            Show on map (might take a while to render because of big grid size)
          </Button>
        }
        <RasterDataImage
          onClickCell={props.onClickCell}
          data={raster.data}
          legend={props.legend}
          unit=""
          gridSize={gridSize}
        />
      </div>
    );
  }

  const data = createGridData(raster.data, gridSize.nX, gridSize.nY);

  return (
    <div>
      {showButton && gridSize.nX * gridSize.nY > maximumGridCells &&
        <Button
          icon={true}
          fluid={true}
          onClick={handleToggleShowMap}
          labelPosition="left"
        >
          <Icon name="image" />
          Show as Image (better performance)
        </Button>
      }
      <MapContainer
        style={{
          width: '100%',
          height: props.mapHeight || '600px'
        }}
        bounds={boundingBox.getBoundsLatLng()}
        onClick={handleClickMap}
      >
        {props.showBasicLayer &&
          <BasicTileLayer />
        }
        {!!props.onChange &&
          <FeatureGroup>
            <EditControl
              position="bottomright"
              onEdited={handleEditPath}
              {...options}
            />
            <Rectangle
              bounds={boundingBox.getBoundsLatLng()}
              {...getStyle('bounding_box')}
            />
          </FeatureGroup>
        }
        {props.legend && data && data.length > 0 &&
          <div>
            {CanvasHeatMapOverlay(gridSize.nX, gridSize.nY, data, boundingBox.getBoundsLatLng(), props.legend, 10)}
            {props.legend && props.showLegend && renderLegend(props.legend)}
          </div>
        }
      </MapContainer>
    </div>
  );
};

export default CriteriaRasterMap;
