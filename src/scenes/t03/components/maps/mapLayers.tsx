import { Array2D } from '../../../../core/model/geometry/Array2D.type';
import { BoundingBox, Geometry } from '../../../../core/model/geometry';
import { CircleMarker, FeatureGroup, GeoJSON, LayersControl } from 'react-leaflet';
import { EBoundaryType } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { HeadObservationWell, WellBoundary } from '../../../../core/model/modflow/boundaries';
import { ModflowModel } from '../../../../core/model/modflow';
import { getStyle } from '../../../../services/geoTools/mapHelpers';
import { rasterToContour } from '../../../../services/geoTools/contours';
import BoundaryCollection from '../../../../core/model/modflow/boundaries/BoundaryCollection';
import Rainbow from '../../../../services/rainbowvis/Rainbowvis';
import md5 from 'md5';

export const renderAreaLayer = (geometry: Geometry) => {
  return <GeoJSON key={geometry.hash()} data={geometry.toGeoJSON()} style={getStyle('area')} priority={100} />;
};

export const renderBoundaryOverlay = (
  boundaries: BoundaryCollection,
  name: string,
  type: EBoundaryType,
  checked = false
) => {
  const filtered = boundaries.all.filter((b) => b.type === type);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <LayersControl.Overlay key={type} name={name} checked={checked}>
      <FeatureGroup>
        {filtered.map((b) => {
          if (b instanceof WellBoundary || b instanceof HeadObservationWell) {
            return (
              <CircleMarker
                key={b.id}
                center={[b.geometry.coordinates[1], b.geometry.coordinates[0]]}
                {...getStyle(b.type, b instanceof WellBoundary ? b.wellType : undefined)}
                priority={100}
              />
            );
          }
          return (
            <GeoJSON
              key={Geometry.fromGeoJson(b.geometry).hash() + '-' + b.layers.join('-')}
              data={b.geometry}
              style={getStyle(b.type)}
              priority={100}
            />
          );
        })}
      </FeatureGroup>
    </LayersControl.Overlay>
  );
};

export const renderBoundaryOverlays = (boundaries: BoundaryCollection) => {
  return [
    renderBoundaryOverlay(boundaries, 'Constant head boundaries', EBoundaryType.CHD),
    renderBoundaryOverlay(boundaries, 'Drainage', EBoundaryType.DRN),
    renderBoundaryOverlay(boundaries, 'Evapotranspiration', EBoundaryType.EVT),
    renderBoundaryOverlay(boundaries, 'Flow and head boundaries', EBoundaryType.FHB),
    renderBoundaryOverlay(boundaries, 'General head boundaries', EBoundaryType.GHB),
    renderBoundaryOverlay(boundaries, 'Head observations', EBoundaryType.HOB),
    renderBoundaryOverlay(boundaries, 'Recharge', EBoundaryType.RCH),
    renderBoundaryOverlay(boundaries, 'Rivers', EBoundaryType.RIV, true),
    renderBoundaryOverlay(boundaries, 'Wells', EBoundaryType.WEL, true),
  ];
};

export const renderBoundingBoxLayer = (boundingBox: BoundingBox, rotation?: number, geometry?: Geometry) => {
  const data =
    rotation && geometry ? boundingBox.geoJsonWithRotation(rotation, geometry.centerOfMass) : boundingBox.geoJson;
  return <GeoJSON key={md5(JSON.stringify(data))} data={data} style={getStyle('bounding_box')} priority={90} />;
};

interface IRenderContourLayerProps {
  model: ModflowModel;
  data: number | Array2D<number>;
  ibound?: Array2D<number>;
  rainbow: Rainbow;
  steps?: number;
}

export const renderContourLayer = (props: IRenderContourLayerProps) => {
  const { boundingBox, geometry, gridSize, rotation } = props.model;

  const data: Array2D<number> = !Array.isArray(props.data)
    ? (Array(gridSize.nY)
        .fill(0)
        .map(() => Array(gridSize.nX).fill(props.data)) as Array2D<number>)
    : props.data;

  let ibound;
  if (props.ibound) {
    const iboundContour = rasterToContour(props.ibound, boundingBox, geometry, gridSize, undefined, rotation);
    if (iboundContour.contours.length > 0) {
      ibound = iboundContour.contours[1];
    }
  }
  const cResult = rasterToContour(data, boundingBox, geometry, gridSize, props.steps, rotation, ibound);
  const contours = cResult.contours;
  const thresholds = cResult.thresholds;
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <FeatureGroup key={`data_${md5(JSON.stringify(contours))}`}>
      {contours.map((mp, key) => (
        <GeoJSON
          key={key}
          data={mp}
          color={`#${props.rainbow.colorAt(thresholds[key])}`}
          fill={true}
          weight={1.5}
          priority={0}
        />
      ))}
    </FeatureGroup>
  );
};
