import {
  Accordion,
  AccordionTitleProps,
  Checkbox, CheckboxProps,
  Form,
  Grid,
  Header,
  Icon,
  Input,
} from 'semantic-ui-react';
import { documentation } from '../../../../defaults/transport';
import FlopyMt3dMtbtn, { IFlopyMt3dMtBtn } from '../../../../../../core/model/flopy/packages/mt/FlopyMt3dMtbtn';
import InfoPopup from '../../../../../shared/InfoPopup';
import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';

interface IProps {
  mtPackage: FlopyMt3dMtbtn;
  onChange: (p: FlopyMt3dMtbtn) => any;
  readOnly: boolean;
}

const BtnPackageProperties = (props: IProps) => {

  const [mtPackage, setMtPackage] = useState<IFlopyMt3dMtBtn>(props.mtPackage.toObject());
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    setMtPackage(props.mtPackage.toObject());
  }, [props.mtPackage]);

  console.log('mtPackage', mtPackage);

  const handleClickAccordion = (e: MouseEvent, titleProps: AccordionTitleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    if (typeof newIndex === 'number') {
      return setActiveIndex(newIndex);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    return setMtPackage({ ...mtPackage, [name]: value });
  };

  const handleOnChangeCheckbox = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {

    const { name, checked } = data;
    if (name === undefined) {
      return;
    }

    setMtPackage({ ...mtPackage, [name]: checked ? 1 : 0 });
    props.onChange(FlopyMt3dMtbtn.fromObject({ ...mtPackage, [name]: checked ? 1 : 0 }));
  };

  const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (cast) {
      value = cast(value);
    }

    setMtPackage({ ...mtPackage, [name]: value });
    props.onChange(FlopyMt3dMtbtn.fromObject({ ...mtPackage, [name]: value }));
  };

  const { readOnly } = props;

  return (
    <Form>
      <Header as={'h3'} dividing={true}>BTN: Basic Transport Package</Header>
      <Accordion styled={true} fluid={true}>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
          <Icon name='dropdown' />
          Basic Transport Parameters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Field>
                  <label>Total species (NCOMP)</label>
                  <Input
                    type={'number'}
                    name={'ncomp'}
                    value={mtPackage.ncomp}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.ncomp}
                      title={'NCOMP'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Mobile species (MCOMP)</label>
                  <Input
                    type={'number'}
                    name={'mcomp'}
                    value={mtPackage.mcomp}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.mcomp}
                      title={'MCOMP'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Starting concentration (SCONC)</label>
                  <Input
                    type={'number'}
                    name={'sconc'}
                    value={mtPackage.sconc}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseFloat)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.sconc}
                      title={'SCONC'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Porosity (PRSITY)</label>
                  <Input
                    type={'number'}
                    name={'prsity'}
                    value={mtPackage.prsity}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseFloat)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.prsity}
                      title={'PRSITY'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Concentration boundary indicator (ICBUND)</label>
                  <Input
                    type={'number'}
                    name={'icbund'}
                    value={mtPackage.icbund}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseFloat)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.icbund}
                      title={'ICBUND'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClickAccordion}>
          <Icon name={'dropdown'} />
          Inactive Cells
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <Form.Group widths={'equal'}>
            <Form.Field>
              <label>Inactive concentration cells (CINACT)</label>
              <Input
                type={'number'}
                name={'cinact'}
                value={mtPackage.cinact}
                readOnly={readOnly}
                onBlur={handleOnBlur((value) => parseFloat(value).toExponential())}
                onChange={handleOnChange}
                icon={<InfoPopup
                  description={documentation.btn.cinact}
                  title={'CINACT'}
                />}
              />
            </Form.Field>
            <Form.Field>
              <label>Minimum saturated thickness (THKMIN)</label>
              <Input
                type={'number'}
                name={'thkmin'}
                value={mtPackage.thkmin}
                disabled={readOnly}
                onBlur={handleOnBlur(parseFloat)}
                onChange={handleOnChange}
                icon={<InfoPopup
                  description={documentation.btn.thkmin}
                  title={'THKMIN'}
                  position={'top right'}
                />}
              />
            </Form.Field>
          </Form.Group>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClickAccordion}>
          <Icon name={'dropdown'} />
          Output Control Options
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Field>
                  <label>Print concentration (IFMTCN)</label>
                  <Input
                    type={'number'}
                    name={'ifmtcn'}
                    value={mtPackage.ifmtcn}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.ifmtcn}
                      title={'IFMTCN'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Print no. of particles (IFMTNP)</label>
                  <Input
                    type={'number'}
                    name={'ifmtnp'}
                    value={mtPackage.ifmtnp}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.ifmtnp}
                      title={'IFMTNP'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Print retardation factor (IFMTRF)</label>
                  <Input
                    type={'number'}
                    name={'ifmtrf'}
                    value={mtPackage.ifmtrf}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.ifmtrf}
                      title={'IFMTRF'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Print dispersion coefficient (IFMTDP)</label>
                  <Input
                    type={'number'}
                    name={'ifmtdp'}
                    value={mtPackage.ifmtdp}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.ifmtdp}
                      title={'IFMTDP'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Group>
                  <Form.Field>
                    <label>Save output (NPRS)</label>
                    <Checkbox
                      toggle={true}
                      disabled={readOnly}
                      name={'nprs'}
                      checked={Boolean(mtPackage.nprs)}
                      onChange={handleOnChangeCheckbox}
                    />
                  </Form.Field>
                  <Form.Field width={1}>
                    <InfoPopup
                      description={documentation.btn.nprs}
                      title={'NPRS'}
                      position={'top right'}
                      iconOutside={true}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Field>
                  <label>Concentration saving frequency (NPROBS)</label>
                  <Input
                    type={'number'}
                    name={'nprobs'}
                    value={mtPackage.nprobs}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.nprobs}
                      title={'NPROBS'}
                      position={'top center'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Mass budget saving frequency (NPRMAS)</label>
                  <Input
                    type={'number'}
                    name={'nprmas'}
                    value={mtPackage.nprmas}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.btn.nprmas}
                      title={'NPRMAS'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 3} index={3} onClick={handleClickAccordion}>
          <Icon name={'dropdown'} />
          Transport steps
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <Form.Group widths={'equal'}>
            <Form.Field>
              <label>Transport step size (Dt0)</label>
              <Input
                type={'number'}
                name={'dt0'}
                value={mtPackage.dt0}
                disabled={readOnly}
                onBlur={handleOnBlur(parseFloat)}
                onChange={handleOnChange}
                icon={<InfoPopup
                  description={documentation.btn.dt0}
                  title={'DT0'}
                  position={'bottom center'}
                />}
              />
            </Form.Field>
            <Form.Field>
              <label>Maximum transport steps (MXSTRN)</label>
              <Input
                type={'number'}
                name={'mxstrn'}
                value={mtPackage.mxstrn}
                disabled={readOnly}
                onBlur={handleOnBlur(parseInt)}
                onChange={handleOnChange}
                icon={<InfoPopup
                  description={documentation.btn.mxstrn}
                  title={'MXSTRN'}
                  position={'top right'}
                />}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths={'equal'}>
            <Form.Field>
              <label>Transport step multiplier (TTSMULT)</label>
              <Input
                type={'number'}
                name={'ttsmult'}
                value={mtPackage.ttsmult}
                disabled={readOnly}
                onBlur={handleOnBlur(parseFloat)}
                onChange={handleOnChange}
                icon={<InfoPopup
                  description={documentation.btn.ttsmult}
                  title={'TTSMULT'}
                />}
              />
            </Form.Field>
            <Form.Field>
              <label>Maximum transport stepsize (TTSMAX)</label>
              <Input
                type={'number'}
                name={'ttsmax'}
                value={mtPackage.ttsmax}
                disabled={readOnly}
                onBlur={handleOnBlur(parseFloat)}
                onChange={handleOnChange}
                icon={<InfoPopup
                  description={documentation.btn.ttsmax}
                  title={'TTSMAX'}
                  position={'top right'}
                />}
              />
            </Form.Field>
          </Form.Group>
        </Accordion.Content>
      </Accordion>
    </Form>
  );
};

export default BtnPackageProperties;
