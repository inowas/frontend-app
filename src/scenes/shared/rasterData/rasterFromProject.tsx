import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {Calculation, ModflowModel, Soilmodel} from '../../../core/model/modflow';
import {Dimmer, DropdownItemProps, DropdownProps, Form, Grid, Loader, Message} from 'semantic-ui-react';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IPropertyValueObject} from '../../../core/model/types';
import {IRootReducer} from '../../../reducers';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {IToolInstance} from '../../types';
import {RasterDataMap} from './index';
import {fetchApiWithToken, fetchCalculationDetails, fetchCalculationResultsFlow, fetchUrl} from '../../../services/api';
import {loadSoilmodel} from '../../../core/model/modflow/soilmodel/services';
import {uniqBy} from 'lodash';
import {useSelector} from 'react-redux';
import Moment from 'moment';
import React, {FormEvent, SyntheticEvent, useEffect, useState} from 'react';
import SliderWithTooltip from '../complexTools/SliderWithTooltip';

interface IProps {
  onChange: (data: Array2D<number>) => void;
}

const styles = {
  dot: {
    border: '1px solid #e9e9e9',
    borderRadius: 0,
    marginLeft: 0,
    width: '1px'
  },
  track: {
    backgroundColor: '#e9e9e9'
  }
};

const RasterFromProject = (props: IProps) => {
  const [activeTotim, setActiveTotim] = useState<number>();
  const [data, setData] = useState<Array2D<number> | number>();
  const [error, setError] = useState<string>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [mode, setMode] = useState<string>('results');
  const [parameterOptions, setParameterOptions] = useState<DropdownItemProps[]>([]);
  const [t03Instances, setT03Instances] = useState<IToolInstance[]>([]);
  const [totalTimes, setTotalTimes] = useState<number[] | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>();
  const [selectedModel, setSelectedModel] = useState<IModflowModel>();
  const [calculation, setCalculation] = useState<ICalculation>();
  const [soilmodel, setSoilmodel] = useState<ISoilmodel>();
  const [selectedLay, setSelectedLay] = useState<number>(0);
  const [selectedTotim, setSelectedTotim] = useState<number>(0);
  const [selectedParam, setSelectedParam] = useState<string>();

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const thisModel = T03.model ? ModflowModel.fromObject(T03.model) : null;

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setIsFetching(true);
        const privateT03Tools = (await fetchApiWithToken('tools/T03?public=false')).data;
        const publicT03Tools = (await fetchApiWithToken('tools/T03?public=true')).data;
        const tools = uniqBy(privateT03Tools.concat(publicT03Tools), (t: IToolInstance) => t.id);
        setT03Instances(tools);
      } catch (err) {
        handleError(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedModelId) {
      setSelectedLay(0);
      setSelectedTotim(0);
      setSelectedParam(undefined);
      setTotalTimes(null);
      setIsFetching(true);
      fetchUrl(`modflowmodels/${selectedModelId}`,
        (d1: IModflowModel) => {
          const model = ModflowModel.fromObject(d1);
          fetchUrl(`modflowmodels/${model.id}/soilmodel`,
            (d2) => {
              loadSoilmodel(
                d2,
                () => null,
                (r) => {
                  setSelectedModel(model.toObject());
                  setSoilmodel(Soilmodel.fromObject(r).toObject());
                  fetchCalculation(model);
                  setIsFetching(false);
                  setError(undefined);
                }
              );
            },
            (e) => handleError(e)
          );
        },
        (e) => handleError(e)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModelId]);

  useEffect(() => {
    setData(undefined);
    if (mode === 'results') {
      return setParameterOptions([
        {key: 0, text: 'head', value: 'head'},
        {key: 1, text: 'drawdown', value: 'drawdown'}
      ]);
    }
    if (mode === 'soilmodel' && soilmodel) {
      const sm = Soilmodel.fromObject(soilmodel);
      const layer = sm.layersCollection.all[selectedLay];
      return setParameterOptions(layer.parameters.map((p) => {
        return {key: p.id, value: p.id, text: p.id};
      }));
    }
    setParameterOptions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedLay, soilmodel]);

  useEffect(() => {
    if (!calculation) {
      setMode('soilmodel');
    }
  }, [calculation]);

  useEffect(() => {
    if (selectedParam && soilmodel && mode === 'soilmodel') {
      const sm = Soilmodel.fromObject(soilmodel);
      const layer = sm.layersCollection.all[selectedLay];
      const param = layer.parameters.filter((p) => p.id === selectedParam);
      setData((param[0].value === null || param[0].value === undefined) &&
      param[0].data.file ? param[0].data.data : param[0].value);
    }
    if (selectedParam && calculation && calculation.times && mode === 'results') {
      if (!totalTimes) {
        setTotalTimes(calculation.times.total_times);
      }
      if (totalTimes) {
        fetchResults(0, selectedParam);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParam]);

  useEffect(() => {
    if (selectedParam && totalTimes) {
      fetchResults(0, selectedParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTimes]);

  useEffect(() => {
    if (selectedParam && selectedTotim) {
      fetchResults(selectedTotim, selectedParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTotim]);

  useEffect(() => {
    if (Array.isArray(data)) {
      props.onChange(data);
    }
    if (selectedModel && typeof data === 'number') {
      const model = ModflowModel.fromObject(selectedModel);
      props.onChange(
        new Array(model.gridSize.nY).fill(data).map(
          () => new Array(model.gridSize.nX).fill(data)
        ) as Array2D<number>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const fetchCalculation = (model: ModflowModel) => {
    if (model.calculationId) {
      fetchCalculationDetails(model.calculationId)
        .then((r2) => {
          setCalculation(Calculation.fromQuery(r2).toObject());
          setError(undefined);
        })
        .catch((e) => handleError(e));
    } else {
      setCalculation(undefined);
    }
  };

  const fetchResults = (totim: number, type: string) => {
    if (calculation && selectedParam && totalTimes && thisModel) {
      const c = Calculation.fromObject(calculation);
      setIsFetching(true);
      fetchCalculationResultsFlow(
        {calculationId: c.id, layer: selectedLay, totim, type},
        (cData: Array2D<number>) => {
          if (cData[0].length !== thisModel.gridSize.nX || cData.length !== thisModel.gridSize.nY) {
            setError('Raster dimensions are not compatible.');
          } else {
            setData(cData);
            setError(undefined);
          }
          setIsFetching(false);
        },
        (e: any) => handleError(e)
      );
    }
  };

  const handleChangeLayer = (e: FormEvent<HTMLElement>, {value}: DropdownProps) => {
    if (typeof value === 'number') {
      return setSelectedLay(value);
    }
  };

  const handleChangeMode = (e: FormEvent<HTMLElement>, {value}: DropdownProps) => {
    if (typeof value === 'string') {
      return setMode(value);
    }
  };

  const handleChangeModel = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
    if (typeof value !== 'string') {
      return null;
    }
    const f = t03Instances.filter((m) => m.id === value);
    if (f.length > 0) {
      setSelectedModelId(f[0].id);
    }
  };

  const handleChangeParameter = (e: FormEvent<HTMLElement>, {value}: DropdownProps) => {
    if (typeof value === 'string') {
      return setSelectedParam(value);
    }
  };

  const handleAfterChangeSlider = () => {
    if (activeTotim && totalTimes) {
      const tKey = totalTimes.indexOf(activeTotim);
      setSelectedTotim(tKey >= 0 ? tKey : 0);
    }
    setActiveTotim(undefined);
  };

  const handleChangeSlider = (value: number) => {
    if (!totalTimes) {
      return null;
    }

    const closest = totalTimes.reduce((prev, curr) => {
      return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
    });

    return setActiveTotim(closest);
  };

  const handleError = (e: any) => {
    setIsFetching(false);
    if (typeof e === 'string') {
      setError(e);
    }
    setError(JSON.stringify(e));
  };

  const formatTimestamp = (key: number) => () => {
    if (!totalTimes || !selectedModel) {
      return [];
    }
    const model = ModflowModel.fromObject(selectedModel);
    return Moment.utc(
      model.stressperiods.dateTimes[0]
    ).add(totalTimes[key], 'days').format('L');
  };

  const sliderMarks = () => {
    const maxNumberOfMarks = 10;
    if (!totalTimes) {
      return [];
    }
    let cTotalTimes = totalTimes;

    if (cTotalTimes.length > maxNumberOfMarks) {
      const minTotim = Math.floor(cTotalTimes[0]);
      const maxTotim = Math.ceil(cTotalTimes[cTotalTimes.length - 1]);
      const dTotim = Math.round((maxTotim - minTotim) / maxNumberOfMarks);

      cTotalTimes = new Array(maxNumberOfMarks).fill(0).map((value, key) => (minTotim + (key * dTotim)));
      cTotalTimes.push(maxTotim);
    }

    const cMarks: IPropertyValueObject = {};
    cTotalTimes.forEach((value) => {
      cMarks[value] = value;
    });
    return cMarks;
  };

  const renderLayerSelect = () => {
    if (!soilmodel) {
      return null;
    }
    const sm = Soilmodel.fromObject(soilmodel);
    return (
      <Form.Select
        fluid={true}
        label="Layer"
        options={sm.layersCollection.all.map((l, key) => {
          return {
            key: l.id, text: l.name, value: key
          };
        })}
        onChange={handleChangeLayer}
        value={selectedLay}
        styles={{zIndex: 9999}}
      />
    );
  };

  return (
    <Form>
      <Grid>
        {isFetching &&
        <Dimmer active={true} inverted={true}>
          <Loader inverted={true}>Loading</Loader>
        </Dimmer>
        }
        {error &&
        <Grid.Row>
          <Grid.Column width={16}>
            <Message negative>
              <Message.Header>Error</Message.Header>
              <p>{error}</p>
            </Message>
          </Grid.Column>
        </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column>
            <Form.Select
              label="T03 Instance"
              placeholder="Select instance"
              fluid={true}
              selection={true}
              value={selectedModel ? selectedModel.id : undefined}
              options={t03Instances.map((i) => ({
                key: i.id,
                text: `${i.name} (${i.user_name})`,
                value: i.id
              }))}
              onChange={handleChangeModel}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Select
              disabled={!selectedModel}
              fluid={true}
              label="Import from"
              options={[
                {key: 'results', text: 'Results', value: 'results', disabled: !calculation},
                {key: 'soilmodel', text: 'Soilmodel', value: 'soilmodel'}
              ]}
              onChange={handleChangeMode}
              value={mode}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            {renderLayerSelect()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Select
              disabled={!selectedModel}
              fluid={true}
              label="Parameter"
              options={parameterOptions}
              onChange={handleChangeParameter}
              value={selectedParam}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            {mode === 'results' && totalTimes &&
            <Form.Field>
              <label>Stressperiod</label>
              <SliderWithTooltip
                dots={totalTimes.length < 20}
                dotStyle={styles.dot}
                trackStyle={styles.track}
                defaultValue={selectedTotim}
                min={Math.floor(totalTimes[0])}
                max={Math.ceil(totalTimes[totalTimes.length - 1])}
                marks={sliderMarks()}
                value={activeTotim ? activeTotim : selectedTotim}
                onAfterChange={handleAfterChangeSlider}
                onChange={handleChangeSlider}
                tipFormatter={formatTimestamp(totalTimes.indexOf(selectedTotim))}
                style={{marginTop: '5px'}}
              />
            </Form.Field>
            }
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {data !== undefined && selectedModel &&
            <RasterDataMap
              model={ModflowModel.fromObject(selectedModel)}
              data={data}
              unit={''}
            />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
};

export default RasterFromProject;
