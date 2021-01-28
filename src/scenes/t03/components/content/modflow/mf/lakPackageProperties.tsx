import {Checkbox, DropdownProps, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMflak} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMflak} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMflak';
import {documentation} from '../../../../defaults/flow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowMfbas from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfbas';
import InfoPopup from '../../../../../shared/InfoPopup';
import React, {ChangeEvent, SyntheticEvent, useState} from 'react';

interface IProps {
  mfPackage: FlopyModflowMflak;
  mfPackages: FlopyModflow;
  onChange: (pck: FlopyModflowMflak) => any;
  readonly: boolean;
}

const LakPackageProperties = (props: IProps) => {
  const [mfPackage, setMfPackage] = useState<IFlopyModflowMflak>(props.mfPackage.toObject());
  const {mfPackages, readonly} = props;
  const basPackage = mfPackages.getPackage('bas');
  if (!basPackage || !(basPackage instanceof FlopyModflowMfbas)) {
    return null;
  }

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

  if (!mfPackage) {
    return null;
  }
  return (
    <Form>
      <Header as={'h3'} dividing={true}>EVT: Evapotranspiration Package</Header>
      <Grid divided={'vertically'}>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Label>Stress period data (SP1)</Label>

          </Grid.Column>
        </Grid.Row>
      </Grid>


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
        <Form.Field width={14}>
          <label>Save cell-by-cell budget data (IPAKCB)</label>
          <Checkbox
            toggle={true}
            disabled={readonly}
            name={'ipakcb'}
            value={mfPackage.ipakcb ? 1 : 0}
          />
        </Form.Field>
        <Form.Field width={1}>
          <InfoPopup
            description={documentation.evt.ipakcb}
            title={'IPAKCB'}
            position={'top right'}
            iconOutside={true}
          />
        </Form.Field>
        <Form.Field>
          <label>ET option (NEVTOP)</label>

        </Form.Field>
        <Form.Field width={1}>
          <label>&nbsp;</label>
          <InfoPopup
            description={documentation.evt.nevtop}
            title={'NEVTOP'}
            position={'top right'}
            iconOutside={true}
          />
        </Form.Field>
      </Form.Group>

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
  );
};

export default LakPackageProperties;
