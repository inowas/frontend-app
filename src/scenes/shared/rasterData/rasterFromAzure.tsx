import { Array2D } from '../../../core/model/geometry/Array2D.type';
import { Button, DropdownProps, Form, Grid, Header, InputOnChangeData, Message, Segment } from 'semantic-ui-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CircleMarker, FeatureGroup, Tooltip } from 'react-leaflet';
import { GridSize, ModflowModel } from '../../../core/model/modflow';
import { IIdwOptions, distanceWeighting } from '../../../services/geoTools/interpolation';
import { IRootReducer } from '../../../reducers';
import { useSelector } from 'react-redux';
import RasterDataMap from './rasterDataMap';
import axios from 'axios';
import uuid from 'uuid';

interface IProps {
  onChange: (r: Array2D<number>) => any;
}

interface IAzureElevationData {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  elevationInMeter: number;
}

const maxResolution = 100;

const RasterFromAzure = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string>();
  const [activeValue, setActiveValue] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('INSERT YOUR API TOKEN HERE');
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [rows, setRows] = useState<number>(10);
  const [columns, setColumns] = useState<number>(10);

  const [mode, setMode] = useState<string>('idw');
  const [idwOptions, setIdwOptions] = useState<IIdwOptions>({
    mode: 'number',
    numberOfPoints: 5,
    range: 3,
  });

  const [data, setData] = useState<Array<{ x: number; y: number; z: number }>>();
  const [raster, setRaster] = useState<Array2D<number>>();

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

  useEffect(() => {
    if (T03.model) {
      const gs = GridSize.fromObject(T03.model.discretization.grid_size);

      const cols = Math.sqrt(maxResolution / (gs.nX / gs.nY));
      const rows = maxResolution / cols;

      setColumns(Math.floor(cols));
      setRows(Math.floor(rows));
    }
  }, [T03.model]);

  useEffect(() => {
    if (rows * columns > maxResolution) {
      setError(`Rows * Columns can not exceed ${maxResolution}.`);
    } else {
      setError(null);
    }
  }, [rows, columns]);

  if (!model) {
    return <Segment color={'grey'} loading={true} />;
  }

  const handleBlurInput = () => {
    const input = activeInput;
    setActiveInput(undefined);
    if (input === 'columns') {
      setColumns(parseFloat(activeValue));
      return;
    }
    if (input === 'rows') {
      setRows(parseFloat(activeValue));
      return;
    }
    if (input === 'apiKey') {
      setApiKey(activeValue);
      return;
    }

    if (input) {
      setIdwOptions({
        ...idwOptions,
        [input]: parseFloat(activeValue),
      });
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeSelect = (e: FormEvent<HTMLElement>, { name, value }: DropdownProps) => {
    if (typeof value === 'string') {
      if (name === 'mode') {
        return setMode(value);
      }
      if (name === 'idwMode') {
        return setIdwOptions({
          ...idwOptions,
          mode: value,
        });
      }
    }
  };

  const handleDownloadCsv = () => {
    if (!data) {
      return;
    }
    let csv = 'lat,lng,value\r\n';

    data.forEach((row) => {
      csv += `${row.y},${row.x},${row.z}\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchData = () => {
    const sw = model.boundingBox.southWest;
    const ne = model.boundingBox.northEast;
    const bounds = `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`;

    setIsFetching(true);

    axios
      .request({
        method: 'GET',
        url: `https://atlas.microsoft.com/elevation/lattice/json?subscription-key=${apiKey}&api-version=1.0&bounds=${bounds}&rows=${rows}&columns=${columns}`,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((e: any) => {
        if (e.data && e.data.data) {
          const cData = e.data.data.map((r: IAzureElevationData) => {
            return {
              x: r.coordinate.longitude,
              y: r.coordinate.latitude,
              z: r.elevationInMeter,
            };
          });
          setData(cData);
        }
      })
      .catch((e) => {
        setError(
          'Fetching elevation data failed. Try again later or contact the INOWAS-Team. Error: ' + JSON.stringify(e)
        );
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const startInterpolation = () => {
    if (!data) {
      return;
    }
    setIsCalculating(true);
    const cRaster = distanceWeighting(
      model.geometry,
      model.boundingBox,
      model.gridSize,
      data,
      model.rotation,
      idwOptions
    );
    setIsCalculating(false);
    setRaster(cRaster);
    props.onChange(cRaster);
  };

  // TODO: Points are behind contour layer but should be in front of it (#1934)
  const renderPoints = () => {
    if (!data) {
      return null;
    }
    return (
      <FeatureGroup zIndex={10000}>
        {data.map((point) => (
          <CircleMarker key={uuid.v4()} center={[point.y, point.x]} radius={3}>
            <Tooltip>
              <span>{point.z} m</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </FeatureGroup>
    );
  };

  return (
    <Grid>
      {error && (
        <Grid.Row>
          <Grid.Column>
            <Message negative>
              <Message.Header>Error</Message.Header>
              {error}
            </Message>
          </Grid.Column>
        </Grid.Row>
      )}
      <Grid.Row>
        <Grid.Column width={8}>
          <Segment color="grey">
            <Header>Amount of imported points</Header>
            <Form>
              <Form.Input
                fluid={true}
                label="API-Key"
                name="apiKey"
                onBlur={handleBlurInput}
                onChange={handleChangeInput}
                value={activeInput === 'apiKey' ? activeValue : apiKey}
              />
              <Form.Group widths="equal">
                <Form.Input
                  fluid={true}
                  label="Horizontal Points"
                  name="columns"
                  onBlur={handleBlurInput}
                  onChange={handleChangeInput}
                  type="number"
                  value={activeInput === 'columns' ? activeValue : columns}
                />
                <Form.Input
                  fluid={true}
                  label="Vertical Points"
                  name="rows"
                  onBlur={handleBlurInput}
                  onChange={handleChangeInput}
                  type="number"
                  value={activeInput === 'rows' ? activeValue : rows}
                />
              </Form.Group>
            </Form>
            {!data && (
              <Button disabled={!!error} onClick={fetchData} primary fluid loading={isFetching}>
                Fetch Data
              </Button>
            )}
            {!!data && (
              <Button primary fluid onClick={handleDownloadCsv}>
                Download as CSV
              </Button>
            )}
          </Segment>
          {!!data && (
            <Segment color="grey">
              <Form>
                <Header>Interpolation between points</Header>
                <Form.Select
                  fluid={true}
                  label="Interpolation method"
                  name="mode"
                  options={[{ key: 'idw', text: 'Inverse Distance Weighting (IDW)', value: 'idw' }]}
                  onChange={handleChangeSelect}
                  value={mode}
                />
                {mode === 'idw' && (
                  <Form.Select
                    fluid={true}
                    label="Method of selecting neighbors"
                    name="idwMode"
                    options={[
                      { key: 'number', text: 'Select x closest neighbors', value: 'number' },
                      { key: 'range', text: 'Select by range in degrees', value: 'range' },
                    ]}
                    onChange={handleChangeSelect}
                    value={idwOptions.mode}
                  />
                )}
                {mode === 'idw' && idwOptions.mode === 'number' && (
                  <Form.Input
                    fluid={true}
                    label="Number of neighbors"
                    name="numberOfPoints"
                    onBlur={handleBlurInput}
                    onChange={handleChangeInput}
                    type="number"
                    value={activeInput === 'numberOfPoints' ? activeValue : idwOptions.numberOfPoints}
                  />
                )}
                {mode === 'idw' && idwOptions.mode === 'range' && (
                  <Form.Input
                    fluid={true}
                    label="Range [degrees]"
                    name="range"
                    onBlur={handleBlurInput}
                    onChange={handleChangeInput}
                    type="number"
                    value={activeInput === 'range' ? activeValue : idwOptions.range}
                  />
                )}
              </Form>
              <br />
              <Button disabled={!!error} onClick={startInterpolation} primary fluid loading={isCalculating}>
                Start Interpolation
              </Button>
            </Segment>
          )}
        </Grid.Column>
        <Grid.Column width={8}>
          <Segment color="green">
            <RasterDataMap data={raster} model={model} unit="m">
              {renderPoints()}
            </RasterDataMap>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default RasterFromAzure;
