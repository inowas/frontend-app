import { Checkbox, DropdownProps, Form, Grid, Header, Input, Label } from 'semantic-ui-react';
import { FlopyModflowMflak } from '../../../../../../core/model/flopy/packages/mf';
import { GridSize } from '../../../../../../core/model/modflow';
import { IFlopyModflowMflak } from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMflak';
import { InfoPopup } from '../../../../../shared';
import { RainbowOrLegend } from '../../../../../../services/rainbowvis/types';
import { RasterDataImage } from '../../../../../shared/rasterData';
import { documentation } from '../../../../defaults/flow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowMfbas from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfbas';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';

interface IProps {
  mfPackage: FlopyModflowMflak;
  mfPackages: FlopyModflow;
  onChange: (pck: FlopyModflowMflak) => any;
  readonly: boolean;
}

const LakPackageProperties = (props: IProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mfPackage, setMfPackage] = useState<IFlopyModflowMflak>(props.mfPackage.toObject());
  const { readonly } = props;

  if (!mfPackage) {
    return null;
  }

  const { mfPackages } = props;

  const basPackage = mfPackages.getPackage('bas');
  if (!basPackage || !(basPackage instanceof FlopyModflowMfbas)) {
    return null;
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    return setMfPackage({ ...mfPackage, [name]: value });
  };

  const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (cast) {
      value = cast(value);
    }

    setMfPackage({ ...mfPackage, [name]: value });
    props.onChange(FlopyModflowMflak.fromObject({ ...mfPackage, [name]: value }));
  };

  const handleOnDropdownChange = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { name, value } = data;
    setMfPackage({ ...mfPackage, [name]: value });
    props.onChange(FlopyModflowMflak.fromObject({ ...mfPackage, [name]: value }));
  };

  return (
    <Form>
      <Header as={'h3'} dividing={true}>LAK: Lake Package</Header>
      <Grid divided={'vertically'}>
        <Grid.Row columns={2}>
          {mfPackage.lakarr?.map((layer: any, idx) => (
            <Grid.Column key={idx}>
              <Label>Layer {idx + 1}</Label>
              <RasterDataImage
                data={layer}
                gridSize={GridSize.fromData(layer)}
                unit={''}
                legend={[
                  { value: 1, color: 'blue', label: 'Lake cells' },
                ] as RainbowOrLegend}
                border={'1px dotted black'}
              />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>

      <Header as={'h4'} dividing={true}></Header>
      <Form.Group>
        <Form.Dropdown
          label={'THETA'}
          options={[
            { key: 0, value: 1.0, text: '1.0' },
            { key: 1, value: 0.5, text: '0.5' },
            { key: 2, value: 0.0, text: '0.0' },
            { key: 3, value: -0.5, text: '-0.5' },
            { key: 4, value: -1.0, text: '-1.0' },
          ]}
          name={'theta'}
          selection={true}
          value={mfPackage.theta}
          disabled={readonly}
          onChange={handleOnDropdownChange}
          width={5}
        />
        <Form.Field width={1}>

          <label>&nbsp;</label>
          <InfoPopup
            description={documentation.lak.theta}
            title={'IHDWET'}
            position={'top right'}
            iconOutside={true}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group widths='equal'>
        <Form.Field>
          <label>NNSITR</label>
          <Input
            readOnly={readonly}
            type={'number'}
            name={'nnsitr'}
            value={mfPackage.nssitr}
            icon={renderInfoPopup(documentation.lak.nssitr, 'NNSITR')}
            onBlur={handleOnBlur(parseInt)}
            onChange={handleOnChange}
            disabled={mfPackage.theta <= 0}
          />
        </Form.Field>
        <Form.Field>
          <label>SSCNCR</label>
          <Input
            readOnly={readonly}
            type={'number'}
            name={'sscncr'}
            value={mfPackage.sscncr}
            icon={renderInfoPopup(documentation.lak.sscncr, 'SSCNCR')}
            onBlur={handleOnBlur(parseFloat)}
            onChange={handleOnChange}
            disabled={mfPackage.theta <= 0}
          />
        </Form.Field>
        <Form.Field>
          <label>SURFDEP</label>
          <Input
            readOnly={readonly}
            type={'number'}
            name={'surfdep'}
            value={mfPackage.surfdep}
            icon={renderInfoPopup(documentation.lak.surfdepth, 'SURFDEP')}
            onBlur={handleOnBlur(parseFloat)}
            onChange={handleOnChange}
            disabled={mfPackage.theta <= 0}
          />
        </Form.Field>
      </Form.Group>
      <Header as={'h4'} dividing={true}></Header>

      <Form.Group widths='equal'>
        <Form.Field>
          <label>Save cell-by-cell budget data (ipakcb)</label>
          <Checkbox
            toggle={true}
            readOnly={readonly}
            name={'ipakcb'}
            value={mfPackage.ipakcb ? 1 : 0}
            icon={renderInfoPopup(documentation.lak.ipakcb, 'IPAKCB')}
          />
        </Form.Field>
      </Form.Group>

      <Form.Group widths='equal'>
        <Form.Field>
          <label>Filename extension</label>
          <Input
            readOnly={readonly}
            name='extension'
            value={mfPackage.extension || ''}
            icon={renderInfoPopup(documentation.lak.extension, 'extension')}
          />
        </Form.Field>
        <Form.Field>
          <label>File unit number</label>
          <Input
            readOnly={readonly}
            type={'number'}
            name='unitnumber'
            value={mfPackage.unitnumber || ''}
            icon={renderInfoPopup(documentation.lak.unitnumber, 'unitnumber')}
          />
        </Form.Field>
        <Form.Field>
          <label>Filenames</label>
          <Input
            readOnly={readonly}
            name='filenames'
            value={mfPackage.filenames || ''}
            icon={renderInfoPopup(documentation.lak.filenames, 'filenames')}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default LakPackageProperties;
