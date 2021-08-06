import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import { BoundingBox } from '../../../../core/model/geometry';
import { Button, Dropdown, DropdownProps, Grid, Popup } from 'semantic-ui-react';
import { CircleMarker, MapContainer, Tooltip } from 'react-leaflet';
import { ColorLegend } from '../../../shared/rasterData';
import { IParameterWithMetaData, ITimeStamps } from './types';
import { LatLngExpression } from 'leaflet';
import { SyntheticEvent, useEffect, useState } from 'react';
import { heatMapColors } from '../../../t05/defaults/gis';
import { rainbowFactory } from '../../../shared/rasterData/helpers';
import _ from 'lodash';

interface IProps {
  data: { [key: string]: number }[];
  parameters: IParameterWithMetaData[];
  timeRef: number;
  timestamp: number;
  tsData: ITimeStamps;
}

const VisualizationMap = (props: IProps) => {
  const [selectedParameter, setSelectedParameter] = useState<string | undefined>(props.parameters[0].parameter.type);
  const [showScale, setShowScale] = useState<boolean>(false);

  useEffect(() => {
    if (props.parameters.length > 0 && (!selectedParameter || (selectedParameter &&
      props.parameters.filter((p) => p.parameter.type === selectedParameter)))) {
      setSelectedParameter(props.parameters[0].parameter.type)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.parameters]);

  const getMinMax = () => {
    const params = props.parameters.filter((p) => p.parameter.type === selectedParameter);
    const left = params.filter((p) => p.meta.axis === 'left');
    const right = params.filter((p) => p.meta.axis === 'right');
    if (left.length > 0 && right.length > 0) {
      return {
        min: Math.min(props.tsData.left.min, props.tsData.right.min),
        max: Math.max(props.tsData.left.max, props.tsData.right.max)
      };
    }
    if (left.length > 0) {
      return {
        min: props.tsData.left.min,
        max: props.tsData.left.max
      };
    }
    if (right.length > 0) {
      return {
        min: props.tsData.right.min,
        max: props.tsData.right.max
      };
    }
    return {
      min: 0,
      max: 0
    };
  };

  const rainbow = rainbowFactory(getMinMax(), heatMapColors.default);

  const calculateBoundingBox = () => {
    return BoundingBox.fromPoints(
      props.parameters.filter((p) => p.parameter.type === selectedParameter)
        .map((p) => {
          return {
            type: 'Point',
            coordinates: [p.sensor.geolocation.coordinates[0], p.sensor.geolocation.coordinates[1]]
          };
        })
    );
  };

  const handleToggleScale = () => setShowScale(!showScale);

  const renderLegend = () => {
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
  };

  const renderMarker = (key: number, p: IParameterWithMetaData) => {
    let fillColor = p.meta.color;
    let fillOpacity = 0.8;
    let value = null;

    if (props.tsData) {
      const row = props.data.filter((r) => r['date'] && r['date'] === (props.timestamp));
      if (row.length > 0) {
        value = row[0].y;
        const pos = row[0][`${p.parameter.type}-${p.sensor.id}`];
        if (showScale && pos !== undefined) {
          fillColor = `#${rainbow.colorAt(row[0][`${p.parameter.type}-${p.sensor.id}`])}`;
        }
      } else if (showScale) {
        fillColor = '#000';
        fillOpacity = 0.3;
      }
    }

    return (
      <CircleMarker
        center={
          [
            p.sensor.geolocation.coordinates[1],
            p.sensor.geolocation.coordinates[0]
          ] as LatLngExpression
        }
        fillColor={fillColor}
        fillOpacity={fillOpacity}
        key={key}
        radius={10}
        stroke={false}
      >
        <Tooltip direction="top">
          {p.sensor.name} {value ? `(${value})` : null}
        </Tooltip>
      </CircleMarker>
    );
  };

  const handleChangeParameter = (e: SyntheticEvent, { value }: DropdownProps) => {
    if (typeof value === 'string') {
      return setSelectedParameter(value);
    }
  };

  const selectOptions = _.uniq(props.parameters.map((p) => p.parameter.type)).map((p) => {
    return { key: p, value: p, text: p };
  });

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Popup
            content="Show color scale"
            trigger={
              <Button
                onClick={handleToggleScale}
                icon="chart pie"
                primary={showScale}
              />
            }
          />
          <Dropdown
            search={true}
            selection={true}
            onChange={handleChangeParameter}
            options={selectOptions}
            placeholder="Select parameter"
            value={selectedParameter}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          {selectedParameter &&
            <MapContainer
              maxZoom={19}
              bounds={calculateBoundingBox().getBoundsLatLng()}
              style={{
                height: '400px',
                width: '100%',
                zIndex: 1
              }}
            >
              <BasicTileLayer />
              {props.parameters.filter((p) => p.parameter.type === selectedParameter)
                .map((p, sKey) => renderMarker(sKey, p))}
              {showScale && renderLegend()}
            </MapContainer>
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default VisualizationMap;
