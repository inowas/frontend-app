import { Checkbox, Form, Grid, Header, Input, Label } from 'semantic-ui-react';
import {
  FlopyModflowMfdis,
  FlopyModflowMfdrn,
  FlopyModflowMfghb,
} from '../../../../../../core/model/flopy/packages/mf';
import { GridSize } from '../../../../../../core/model/modflow';
import { IFlopyModflowMfdrn } from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfdrn';
import { RasterDataImage } from '../../../../../shared/rasterData';
import { cloneDeep } from 'lodash';
import { documentation } from '../../../../defaults/flow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import InfoPopup from '../../../../../shared/InfoPopup';
import React, { ChangeEvent, useState } from 'react';

interface IProps {
  mfPackage: FlopyModflowMfdrn;
  mfPackages: FlopyModflow;
  onChange: (pck: FlopyModflowMfdrn) => void;
  readonly: boolean;
}

const DrnPackageProperties = (props: IProps) => {
  const [mfPackage, setMfPackage] = useState<IFlopyModflowMfdrn>(props.mfPackage.toObject());
  const { mfPackages, readonly } = props;

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
    props.onChange(FlopyModflowMfghb.fromObject({ ...mfPackage, [name]: value }));
  };

  const disPackage: FlopyModflowMfdis = mfPackages.getPackage('dis') as FlopyModflowMfdis;

  const emptyValues: Array<Array<Array<number | undefined>>> = [];
  for (let l = 0; l < disPackage.nlay; l++) {
    emptyValues[l] = [];
    for (let r = 0; r < disPackage.nrow; r++) {
      emptyValues[l][r] = [];
      for (let c = 0; c < disPackage.ncol; c++) {
        emptyValues[l][r][c] = undefined;
      }
    }
  }

  const stageValues = cloneDeep(emptyValues);
  const conductanceValues = cloneDeep(emptyValues);


  if (mfPackage.stress_period_data) {
    Object.values(mfPackage.stress_period_data)[0].forEach((spv: number[]) => {
      const [lay, row, col, stage, conductance] = spv;
      stageValues[lay][row][col] = stage;
      conductanceValues[lay][row][col] = conductance;
    });
  }

  return (
    <Form>
      <Header as={'h3'} dividing={true}>DRN: Drain Package</Header>
      <Grid divided={'vertically'}>
        <Grid.Row columns={2}>
          {stageValues.map((layer: any, idx) => (
            <Grid.Column key={idx}>
              <Label>Stage Layer {idx + 1}</Label>
              <RasterDataImage
                data={layer}
                gridSize={GridSize.fromData(layer)}
                unit={''}
                border={'1px dotted black'}
              />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
      <Grid divided={'vertically'}>
        <Grid.Row columns={2}>
          {conductanceValues.map((layer: any, idx) => (
            <Grid.Column key={idx}>
              <Label>Conductance Layer {idx + 1}</Label>
              <RasterDataImage
                data={layer}
                gridSize={GridSize.fromData(layer)}
                unit={''}
                border={'1px dotted black'}
              />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
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
            description={documentation.drn.ipakcb}
            title={'IPAKCB'}
            position={'top right'}
            iconOutside={true}
          />
        </Form.Field>
        <Form.Field>
          <label>Package options (OPTIONS)</label>
          <Input
            readOnly={readonly}
            name='options'
            value={mfPackage.options || ''}
            onChange={handleOnChange}
            onBlur={handleOnBlur(parseFloat)}
            icon={<InfoPopup description={documentation.drn.options} title={'OPTIONS'} />}
          />
        </Form.Field>
      </Form.Group>

      <Form.Group widths={'equal'}>
        <Form.Field>
          <label>Filename extension (EXTENSION)</label>
          <Input
            readOnly={readonly}
            name={'extension'}
            value={mfPackage.extension}
            icon={<InfoPopup description={documentation.drn.extension} title={'EXTENSION'} />}
          />
        </Form.Field>
        <Form.Field>
          <label>File unit number (UNITNUMBER)</label>
          <Input
            readOnly={readonly}
            type={'number'}
            name={'unitnumber'}
            value={mfPackage.unitnumber || ''}
            onChange={handleOnChange}
            onBlur={handleOnBlur(parseFloat)}
            icon={<InfoPopup description={documentation.drn.unitnumber} title={'UNITNUMBER'} />}
          />
        </Form.Field>
        <Form.Field>
          <label>Filenames (FILENAMES)</label>
          <Input
            readOnly={readonly}
            name={'filenames'}
            value={mfPackage.filenames || ''}
            icon={<InfoPopup description={documentation.drn.filenames} title={'FILENAMES'} />}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default DrnPackageProperties;
