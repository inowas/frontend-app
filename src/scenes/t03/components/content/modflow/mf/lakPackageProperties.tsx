import {
  Accordion,
  AccordionTitleProps, Button,
  DropdownProps,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label, Segment
} from 'semantic-ui-react';
import {Array2D} from '../../../../../../core/model/geometry/Array2D.type';
import {FlopyModflowMflak} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize, ModflowModel, Soilmodel} from '../../../../../../core/model/modflow';
import {IFlopyModflowMflak} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMflak';
import {ILegendItemDiscrete} from '../../../../../../services/rainbowvis/types';
import {IRootReducer} from '../../../../../../reducers';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {distinct} from '../../../../../modflow/defaults/colorScales';
import {documentation} from '../../../../defaults/flow';
import {useSelector} from 'react-redux';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import InfoPopup from '../../../../../shared/InfoPopup';
import LakeBoundary from '../../../../../../core/model/modflow/boundaries/LakeBoundary';
import React, {ChangeEvent, MouseEvent, SyntheticEvent, useState} from 'react';
import _ from 'lodash';

interface IProps {
  mfPackage: FlopyModflowMflak;
  mfPackages: FlopyModflow;
  onChange: (pck: FlopyModflowMflak) => any;
  onClickEdit: (layer: string, set: string, parameter: string) => void;
  readonly: boolean;
}

const LakPackageProperties = (props: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mfPackage, setMfPackage] = useState<IFlopyModflowMflak>(props.mfPackage.toObject());
  const {readonly} = props;

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
  const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
  const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

  if (!boundaries || !model || !soilmodel) {
    return null;
  }

  const handleChangeStages = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
    const cMfPackage = mfPackage;
    if (value === 1 && !Array.isArray(mfPackage.stages)) {
      cMfPackage.stages = new Array(mfPackage.nlakes).fill(mfPackage.stages);
    }
    if (value === 0 && Array.isArray(mfPackage.stages)) {
      cMfPackage.stages = mfPackage.stages[0];
    }
    setMfPackage(cMfPackage);
    props.onChange(FlopyModflowMflak.fromObject(cMfPackage));
  };

  const handleClickAccordion = (e: MouseEvent, titleProps: AccordionTitleProps) => {
    const {index} = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    if (typeof newIndex === 'number') {
      return setActiveIndex(newIndex);
    }
  };

  const handleClickEdit = (layer: string, set: string, parameter: string) => () =>
    props.onClickEdit(layer, set, parameter);

  const handleClickEnableBdlknc = () => {
    console.log('ENABLE');
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    return setMfPackage({...mfPackage, [name]: value});
  };

  const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
    const {name} = e.target;
    let {value} = e.target;

    if (cast) {
      value = cast(value);
    }

    setMfPackage({...mfPackage, [name]: value});
    props.onChange(FlopyModflowMflak.fromObject({...mfPackage, [name]: value}));
  };

  const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const {name, value} = data;
    setMfPackage({...mfPackage, [name]: value});
    props.onChange(FlopyModflowMflak.fromObject({...mfPackage, [name]: value}));
  };

  const renderBdlknc = (data: Array2D<number>, idx: number) => {
    const layers = soilmodel.layersCollection.all;
    const lakes = boundaries.all.filter((b) => b instanceof LakeBoundary);

    if (layers[idx]) {
      return (
        <Grid.Column key={idx} width={8}>
          <div>
            <Label>{layers[idx].number}: {layers[idx].name}</Label>
            <React.Fragment>
              <Icon
                link={true}
                style={{float: 'right', zIndex: 10000}}
                name="edit"
                onClick={handleClickEdit(layers[idx].id, 'lak', 'bdlknc')}
              />
              <div style={{clear: 'both'}}/>
            </React.Fragment>
          </div>
          <RasterDataImage
            data={data}
            gridSize={Array.isArray(data) ? GridSize.fromData(data) : model.gridSize}
            unit={''}
          />
        </Grid.Column>
      );
    }
    return null;
  };

  const renderLakeArray = (data: Array2D<number>, idx: number) => {
    const layers = soilmodel.layersCollection.all;
    const lakes = boundaries.all.filter((b) => b instanceof LakeBoundary);
    const lakeIds: number[] = _.uniq(lakes.map((b) => b instanceof LakeBoundary ? b.lakeId : 0));

    if (layers[idx]) {
      return (
        <Grid.Column key={idx} width={8}>
          <div>
            <Label>{layers[idx].number}: {layers[idx].name}</Label>
          </div>
          <RasterDataImage
            data={data}
            gridSize={GridSize.fromData(data)}
            unit={''}
            legend={
              lakeIds.map((id, k) => {
                return {value: id, color: distinct.length > k ? distinct[k] : distinct[0], label: `Lake ${id}`};
              }) as ILegendItemDiscrete[]}
            border={'1px dotted black'}
          />
        </Grid.Column>
      );
    }
    return null;
  };

  if (!mfPackage) {
    return null;
  }
  return (
    <React.Fragment>
      <Header as={'h3'} dividing={true}>LAK: Lake Package</Header>
      <Accordion styled={true} fluid={true}>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
          <Icon name="dropdown"/> Lake Array (LAKARR)
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Grid>
            {
              Array.isArray(props.mfPackage.lakarr) ?
                props.mfPackage.lakarr.map((d, idx) => renderLakeArray(d as Array2D<number>, idx)) :
                'NULL'
            }
          </Grid>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClickAccordion}>
          <Icon name="dropdown"/> Lakebed leakance (BDLKNC)
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <Grid>
            <Grid.Row columns={2}>
              {Array.isArray(props.mfPackage.bdlknc) ? props.mfPackage.bdlknc.map((d, idx) =>
                  renderBdlknc(d as Array2D<number>, idx)) :
                <Button fluid={true} onClick={handleClickEnableBdlknc}>Enable data</Button>
              }
            </Grid.Row>
          </Grid>
        </Accordion.Content>
      </Accordion>
      <br/>
      <Form>
        <Form.Field>
          <label>Number of separate lakes (NLAKES)</label>
          <Input
            readOnly={true}
            type={'number'}
            name={'nlakes'}
            value={mfPackage.nlakes}
            icon={<InfoPopup description={documentation.lak.nlakes} title={'NLAKES'}/>}
          />
        </Form.Field>
        <Form.Field>
          <label>Solution for lake stages (THETA)</label>
          <Input
            readOnly={readonly}
            type={'number'}
            name={'theta'}
            value={mfPackage.theta}
            onChange={handleOnChange}
            onBlur={handleOnBlur(parseFloat)}
            icon={<InfoPopup description={documentation.lak.theta} title={'THETA'}/>}
          />
        </Form.Field>
        <Form.Group widths={'equal'}>
          <Form.Field>
            <label>Maximum number of iterations (NSSITR)</label>
            <Input
              readOnly={readonly}
              type={'number'}
              name={'nssitr'}
              value={mfPackage.nssitr}
              onChange={handleOnChange}
              onBlur={handleOnBlur(parseFloat)}
              icon={<InfoPopup description={documentation.lak.nssitr} title={'NSSITR'}/>}
            />
          </Form.Field>
          <Form.Field>
            <label>Undulations in lake-bottom elevations (SURFDEP)</label>
            <Input
              readOnly={readonly}
              type={'number'}
              name={'surfdep'}
              value={mfPackage.surfdep}
              onChange={handleOnChange}
              onBlur={handleOnBlur(parseFloat)}
            />
          </Form.Field>
        </Form.Group>
        <Segment>
          <Form.Group>
            <Form.Select
              fluid={true}
              label='Stages'
              options={[
                {key: 0, value: 0, text: 'Constant value for all lakes'},
                {key: 1, value: 1, text: 'Seperate value for different lakes'}
              ]}
              onChange={handleChangeStages}
              value={Array.isArray(mfPackage.stages) ? 1 : 0}
            />
            {!Array.isArray(mfPackage.stages) &&
            <Form.Field>
              <label>Initial stage</label>
              <Input
                readOnly={readonly}
                type={'number'}
                name={'stages'}
                value={mfPackage.stages}
                onChange={handleOnChange}
                onBlur={handleOnBlur(parseFloat)}
                icon={<InfoPopup description={documentation.lak.stages} title={'STAGES'}/>}
              />
            </Form.Field>
            }
            {Array.isArray(mfPackage.stages) &&
              <Grid>
                {mfPackage.stages.map((s, k) => (
                  <Grid.Column width={4}>
                    <Form.Field>
                      <label>Lake {k + 1}</label>
                      <Input
                        readOnly={readonly}
                        type={'number'}
                        name={'stages'}
                        value={s}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                      />
                    </Form.Field>
                  </Grid.Column>
                ))}
              </Grid>
            }
          </Form.Group>
        </Segment>
        <Form.Group widths={'equal'}>
          <Form.Field>
            <label>Filename extension (EXTENSION)</label>
            <Input
              readOnly={readonly}
              name={'extension'}
              value={mfPackage.extension || ''}
              icon={<InfoPopup description={documentation.evt.extension} title={'EXTENSION'}/>}
            />
          </Form.Field>
          <Form.Field>
            <label>File unit number (UNITNUMBER)</label>
            <Input
              readOnly={readonly}
              type={'number'}
              name={'unitnumber'}
              value={mfPackage.unitnumber || ''}
              icon={<InfoPopup description={documentation.evt.unitnumber} title={'UNITNUMBER'}/>}
            />
          </Form.Field>
          <Form.Field>
            <label>Filenames (FILENAMES)</label>
            <Input
              readOnly={readonly}
              name={'filenames'}
              value={mfPackage.filenames || ''}
              icon={<InfoPopup description={documentation.evt.filenames} title={'FILENAMES'}/>}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </React.Fragment>
  );
};

export default LakPackageProperties;
