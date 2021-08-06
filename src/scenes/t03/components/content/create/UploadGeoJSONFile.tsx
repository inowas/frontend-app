import { AllGeoJSON } from '@turf/helpers';
import { BasicTileLayer } from '../../../../../services/geoTools/tileLayers';
import { BoundingBox, Geometry } from '../../../../../core/model/modflow';
import { Button, Checkbox, CheckboxProps, Grid, List, Message } from 'semantic-ui-react';
import { CircleMarker, GeoJSON, MapContainer, useMapEvents } from 'react-leaflet';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { GeoJSON as GeoJSONType, GeoJsonGeometryTypes } from 'geojson';
import { LatLngBoundsExpression } from 'leaflet';
import uuid from 'uuid';

interface IProps {
  geometry: Geometry | undefined;
  onChange: (json: string) => any;
  type: GeoJsonGeometryTypes;
}

const styles = {
  map: {
    height: 500,
    width: '100%'
  },
  point: {
    radius: 5,
    color: 'black',
    weight: 2,
    fillColor: '#4CAF53'
  },
  area: {
    weight: 2,
    opacity: 1,
    color: '#1D7FED',
  }
};

const UploadGeoJSONFile = (props: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [features, setFeatures] = useState<GeoJSONType[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<number>();

  const refMap = useRef<any>(null);

  const fileReader = new FileReader();
  fileReader.onload = (event: any) => {
    if (event && event.target && event.target.result) {
      parseFileContent(event.target.result);
    }
  };

  useEffect(() => {
    setSelectedFeature(0);
    panToSelected(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  useEffect(() => {
    if (selectedFeature !== undefined) {
      const feature: any = features[selectedFeature];
      if (feature && feature.geometry) {
        if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.type = 'Polygon';
          feature.geometry.coordinates = feature.geometry.coordinates[0];
        }
        if (feature.geometry.type === 'MultiLineString') {
          feature.geometry.type = 'LineString';
          feature.geometry.coordinates = feature.geometry.coordinates[0];
        }
        props.onChange(JSON.stringify(feature.geometry));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, selectedFeature]);

  const panToSelected = (key?: number) => {
    if (key === undefined) {
      key = selectedFeature || 0;
    }
    if (!refMap.current || features.length < (key + 1)) {
      return null;
    }
    const feature = features[key];
    const bbox = BoundingBox.fromGeoJson(feature as AllGeoJSON);
    refMap.current.leafletElement.fitBounds(bbox.getBoundsLatLng());
  };

  const isValidJson = (text: string) => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const parseFileContent = (text: string) => {
    setErrors([]);

    if (!isValidJson(text)) {
      return setErrors(['Invalid JSON']);
    }

    const data = JSON.parse(text);

    if (!data.crs.properties.name.includes('CRS84')) {
      setErrors(errors.concat(
        `CRS ${data.crs.properties.name} might not be compatible. Use WGS 84 (EPSG 4326).`
      ));
    }

    /*
    TODO: add schema for geojson in general
    */

    setIsLoading(false);

    if (data.features && data.features.length > 0) {
      return setFeatures(data.features);
    }

    if (props.type === 'Polygon' && data.features && data.features.length > 0) {
      return props.onChange(JSON.stringify({
        type: 'Polygon',
        coordinates: data.features[0].geometry.coordinates[0]
      }));
    }

    return data.geometry;
  };

  const getBoundsLatLng = () => {
    if (props.geometry && props.geometry.type !== 'Point') {
      return BoundingBox.fromGeoJson(props.geometry.toGeoJSON()).getBoundsLatLng() as LatLngBoundsExpression;
    }

    return [[60, 10], [45, 30]] as LatLngBoundsExpression;
  };

  const handleUpload = (e: FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      fileReader.readAsText(files[0]);
    }
  };

  const handleChangeFeature = (e: FormEvent<HTMLInputElement>, { value }: CheckboxProps) => {
    if (typeof value === 'number') {
      setSelectedFeature(value);
      panToSelected(value);
    }
  };

  const GeometryObject = (f: any, key: number) => {
    useMapEvents({
      click() {
        setSelectedFeature(key);
        panToSelected(key);
      }
    })

    if (f.geometry.type === 'Point') {
      return (
        <CircleMarker
          center={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
          key={uuid.v4()}
          {...styles.point}
        />
      );
    }
    return (
      <GeoJSON
        data={f}
        key={uuid.v4()}
        {...styles.area}
      />
    );
  };

  return (
    <Grid.Row>
      <Grid.Column>
        <Button
          color="grey"
          as="label"
          htmlFor="inputField"
          icon="file alternate"
          content="Select File"
          fluid={true}
          labelPosition="left"
          loading={isLoading}
          size={'large'}
        />
        <input
          hidden={true}
          type="file"
          id="inputField"
          onChange={handleUpload}
          value={''}
        />
        {errors.map((e, key) => <Message key={key} negative={true}>{e}</Message>)}
        <List>
          {features.map((f, key) => (
            <List.Item key={key}>
              <Checkbox
                radio={true}
                checked={key === selectedFeature}
                label={`Feature ${key}`}
                onChange={handleChangeFeature}
                value={key}
              />
            </List.Item>
          ))}
        </List>
      </Grid.Column>
      <Grid.Column>
        <MapContainer
          style={styles.map}
          bounds={getBoundsLatLng()}
          ref={refMap}
        >
          <BasicTileLayer />
          {features.map((f, key) => <GeometryObject f={f} key={key} />)}
        </MapContainer>
      </Grid.Column>
    </Grid.Row>
  );
};

export default UploadGeoJSONFile;
