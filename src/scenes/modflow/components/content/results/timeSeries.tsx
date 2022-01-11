import { Array2D } from '../../../../../core/model/geometry/Array2D.type';
import { BoundaryCollection, Calculation, ModflowModel, Soilmodel } from '../../../../../core/model/modflow';
import { DropdownProps, Form, Grid, Icon, Label, Segment } from 'semantic-ui-react';
import { EResultType } from './flowResults';
import { HeadObservationWell } from '../../../../../core/model/modflow/boundaries';
import { IHeadObservationWell } from '../../../../../core/model/modflow/boundaries/HeadObservationWell.type';
import { MODFLOW_CALCULATION_URL, fetchApiWithToken } from '../../../../../services/api';
import { cloneDeep, flatten, uniq, upperFirst } from 'lodash';
import { misc } from '../../../defaults/colorScales';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import TimeSeriesChart from './timeSeriesChart';
import TimeSeriesMap from './timeSeriesMap';
import _ from 'lodash';

interface IProps {
  boundaries: BoundaryCollection;
  calculation: Calculation;
  model: ModflowModel;
  soilmodel: Soilmodel;
}

const TimeSeries = (props: IProps) => {
  const [activeHobs, setActiveHobs] = useState<IHeadObservationWell[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [layerValues, setLayerValues] = useState<string[][] | null>(null);
  const [selectedCells, setSelectedCells] = useState<Array<[number, number, Array2D<number>]>>([]);
  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);

  const { boundaries, calculation, model, soilmodel } = props;

  const hobs = props.boundaries.all.filter((b) => b instanceof HeadObservationWell);

  useEffect(() => {
    if (calculation) {
      setLayerValues(calculation.layer_values);
    }
  }, [calculation, model.calculationId]);

  useEffect(() => {
    setSelectedCells([]);
  }, [selectedLayer, selectedType]);

  const fetchCellData = async (row: number, col: number) => {
    try {
      const c = await fetchApiWithToken(
        `${MODFLOW_CALCULATION_URL}/${calculation.id}/timeseries/types/${selectedType}/layers/${selectedLayer}/rows/${row}/columns/${col}`
      );
      if (c.data && Array.isArray(c.data)) {
        const cSelectedCells = _.cloneDeep(selectedCells);
        cSelectedCells.push([row, col, c.data]);
        setSelectedCells(cSelectedCells);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChangeLayer = (e: SyntheticEvent, { value }: DropdownProps) => {
    if (typeof value === 'number') {
      setSelectedLayer(value);
    }
  };

  const handleChangeType = (e: SyntheticEvent, { value }: DropdownProps) => {
    if (typeof value === 'string') {
      setSelectedType(value as EResultType);
    }
  };

  const handleClickDelete = (cell: [number, number]) => () => {
    const cSelectedCells = selectedCells.filter((c) => !(c[0] === cell[0] && c[1] === cell[1]));
    setSelectedCells(cSelectedCells);
  };

  const handleToggleHob = (h: string) => () => {
    if (activeHobs.filter((hob) => hob.id === h).length > 0) {
      setActiveHobs(activeHobs.filter((hob) => hob.id !== h));
      return;
    }
    const hobToAdd = hobs.filter((hob) => hob.id === h);
    if (hobToAdd.length > 0) {
      const cActiveHobs = cloneDeep(activeHobs);
      cActiveHobs.push(hobToAdd[0].toObject() as IHeadObservationWell);
      setActiveHobs(cActiveHobs);
    }
  };

  const handleClickMap = (cell: [number, number]) => {
    const f = selectedCells.filter((c) => c[1] === cell[0] && c[0] === cell[1]);
    if (f.length > 0) {
      const cSelectedCells = selectedCells.filter((c) => !(c[1] === cell[0] && c[0] === cell[1]));
      setSelectedCells(cSelectedCells);
    } else {
      setIsFetching(true);
      fetchCellData(cell[1], cell[0]);
    }
  };

  const layerOptions = () =>
    soilmodel.layersCollection.reorder().all.map((l, idx) => ({ key: l.id, value: idx, text: l.name }));

  const typeOptions = () => {
    if (!layerValues) {
      return [];
    }

    const types = uniq(flatten(layerValues));
    return types
      .filter((t) => t === EResultType.HEAD || t === EResultType.DRAWDOWN)
      .map((v, id) => ({ key: id, value: v, text: upperFirst(v) }));
  };

  return (
    <React.Fragment>
      <Grid columns={2}>
        <Grid.Row stretched={true}>
          <Grid.Column width={6}>
            <Segment color={'grey'}>
              <Form>
                <Form.Group inline={true}>
                  <label>Select type</label>
                  <Form.Dropdown
                    selection={true}
                    style={{ zIndex: 1002, minWidth: '8em' }}
                    options={typeOptions()}
                    value={selectedType}
                    onChange={handleChangeType}
                    disabled={isFetching}
                  />
                </Form.Group>
                <Form.Select
                  loading={!soilmodel}
                  style={{ zIndex: 1001 }}
                  fluid={true}
                  options={layerOptions()}
                  value={selectedLayer}
                  name={'affectedLayers'}
                  onChange={handleChangeLayer}
                  disabled={isFetching}
                />
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment color={'grey'}>
              <p>Selected Cells</p>
              {selectedCells.map((c, key) => (
                <Label
                  style={{
                    background: key < misc.length ? misc[key] : misc[misc.length - 1],
                    color: '#fff',
                    marginBottom: '1px',
                  }}
                  key={key}
                >
                  {c[0]} {c[1]}
                  <Icon name="delete" onClick={handleClickDelete([c[0], c[1]])} />
                </Label>
              ))}
              {hobs.length > 0 && (
                <>
                  <p style={{ marginTop: '10px' }}>Selected Head Observations</p>
                  {hobs.map((h, key) => (
                    <Label
                      key={h.id}
                      style={{
                        background: '#ffffff',
                        border:
                          activeHobs.filter((hob) => hob.id === h.id).length > 0
                            ? `1px solid ${key < misc.length ? misc[key] : misc[misc.length - 1]}`
                            : '0',
                        color: '#000',
                        marginBottom: '1px',
                      }}
                      as="a"
                      onClick={handleToggleHob(h.id)}
                    >
                      {h.name}
                    </Label>
                  ))}
                </>
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Segment color={'grey'}>
        <TimeSeriesMap
          headObservationWells={BoundaryCollection.fromObject(activeHobs)}
          boundaries={boundaries}
          model={model}
          onClick={handleClickMap}
          selectedCells={selectedCells}
        />
      </Segment>
      {selectedCells.length > 0 && (
        <Segment color={'blue'}>
          <TimeSeriesChart
            headObservationWells={activeHobs.map((h) => HeadObservationWell.fromObject(h))}
            selectedCells={selectedCells}
            stressperiods={props.model.stressperiods}
            type={selectedType}
          />
        </Segment>
      )}
    </React.Fragment>
  );
};

export default TimeSeries;
