import { DropdownProps, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { IPropertyValueObject } from '../../../core/model/types';
import { Soilmodel, Stressperiods, Transport } from '../../../core/model/modflow';
import { SyntheticEvent, useState } from 'react';
import Moment from 'moment';
import SliderWithTooltip from './SliderWithTooltip';

const styles = {
  dot: {
    border: '1px solid #e9e9e9',
    borderRadius: 0,
    marginLeft: 0,
    width: '1px',
  },
  track: {
    backgroundColor: '#e9e9e9',
  },
};

interface IProps {
  data: {
    layer: number;
    substance: number;
    totim: number;
  };
  onChange: (result: { layer: number; substance: number; totim: number }) => any;
  layerValues: string[][];
  totalTimes: number[];
  soilmodel: Soilmodel;
  stressperiods: Stressperiods;
  transport: Transport;
}

const ResultsSelectorTransport = (props: IProps) => {
  const [temporaryTotim, setTemporaryTotim] = useState<number>(props.totalTimes[props.data.totim]);

  const sliderMarks = () => {
    const maxNumberOfMarks = 10;
    let { totalTimes } = props;

    if (totalTimes.length > maxNumberOfMarks) {
      const minTotim = Math.floor(totalTimes[0]);
      const maxTotim = Math.ceil(totalTimes[totalTimes.length - 1]);
      const dTotim = Math.round((maxTotim - minTotim) / maxNumberOfMarks);

      totalTimes = new Array(maxNumberOfMarks).fill(0).map((value, key) => minTotim + key * dTotim);
      totalTimes.push(maxTotim);
    }

    const cMarks: IPropertyValueObject = {};
    totalTimes.forEach((value) => {
      cMarks[value] = value;
    });
    return cMarks;
  };

  const layerOptions = () =>
    props.soilmodel.layersCollection.reorder().all.map((l, idx) => ({ key: l.id, value: idx, text: l.name }));

  const substanceOptions = () => {
    const { transport } = props;
    return transport.substances.all.map((s, idx) => ({ key: idx, value: idx, text: s.name }));
  };

  const formatTimestamp = (key: number) => () => {
    return Moment.utc(props.stressperiods.dateTimes[0]).add(props.totalTimes[key], 'days').format('L');
  };

  const handleChangeSubstance = (e: SyntheticEvent, { value }: DropdownProps) => {
    const { layer, totim } = props.data;
    return props.onChange({
      substance: typeof value === 'number' ? value : 0,
      layer,
      totim,
    });
  };

  const handleChangeLayer = (e: SyntheticEvent, { value }: DropdownProps) =>
    props.onChange({
      layer: value as number,
      substance: props.data.substance,
      totim: props.data.totim,
    });

  const handleChangeSlider = (value: number) => {
    const { totalTimes } = props;
    const differences = totalTimes.map((tt, idx) => ({ id: idx, value: Math.abs(tt - value) }));
    differences.sort((a, b) => a.value - b.value);
    return setTemporaryTotim(totalTimes[differences[0].id]);
  };

  const handleAfterChangeSlider = () => {
    const totim = props.totalTimes.indexOf(temporaryTotim);
    return props.onChange({ layer: props.data.layer, totim: totim > -1 ? totim : 0, substance: props.data.substance });
  };

  const { substance, layer } = props.data;

  return (
    <Grid columns={2}>
      <Grid.Row stretched>
        <Grid.Column width={6}>
          <Segment color={'grey'}>
            <Form>
              <Form.Group inline>
                <label>Select substance:</label>
                <Form.Dropdown
                  selection
                  style={{ zIndex: 1002, minWidth: '8em' }}
                  options={substanceOptions()}
                  value={substance}
                  onChange={handleChangeSubstance}
                />
              </Form.Group>
              <Form.Select
                loading={!props.soilmodel}
                style={{ zIndex: 1001 }}
                fluid
                options={layerOptions()}
                value={layer}
                name={'affectedLayers'}
                onChange={handleChangeLayer}
              />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={10}>
          <Segment color={'grey'}>
            <Header textAlign={'center'} as={'h4'}>
              Select total time [days]
            </Header>
            <SliderWithTooltip
              dots={props.totalTimes.length < 20}
              dotStyle={styles.dot}
              trackStyle={styles.track}
              defaultValue={temporaryTotim}
              min={props.totalTimes[0]}
              max={props.totalTimes[props.totalTimes.length - 1]}
              marks={sliderMarks()}
              value={temporaryTotim}
              onAfterChange={handleAfterChangeSlider}
              onChange={handleChangeSlider}
              tipFormatter={() => formatTimestamp(props.totalTimes.indexOf(temporaryTotim))}
            />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ResultsSelectorTransport;
