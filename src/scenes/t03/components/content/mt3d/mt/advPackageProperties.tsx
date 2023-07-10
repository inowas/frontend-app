import {
  Accordion,
  AccordionTitleProps,
  Checkbox, CheckboxProps,
  DropdownProps,
  Form,
  Header,
  Icon,
  Input,
  Segment,
  Select,
} from 'semantic-ui-react';
import { documentation } from '../../../../defaults/transport';
import FlopyMt3dMtadv, { IFlopyMt3dMtAdv } from '../../../../../../core/model/flopy/packages/mt/FlopyMt3dMtadv';
import InfoPopup from '../../../../../shared/InfoPopup';
import React, { ChangeEvent, FormEvent, MouseEvent, SyntheticEvent, useEffect, useState } from 'react';
import FlopyMt3dMtbtn from '../../../../../../core/model/flopy/packages/mt/FlopyMt3dMtbtn';

interface IProps {
  mtPackage: FlopyMt3dMtadv;
  onChange: (p: FlopyMt3dMtadv) => any;
  readOnly: boolean;
}

const AdvPackageProperties = (props: IProps) => {

  const [mtPackage, setMtPackage] = useState<IFlopyMt3dMtAdv>(props.mtPackage.toObject());
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    setMtPackage(props.mtPackage.toObject());
  }, [props.mtPackage]);

  const handleClickAccordion = (e: MouseEvent, titleProps: AccordionTitleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    if (typeof newIndex === 'number') {
      return setActiveIndex(newIndex);
    }
  };

  const handleOnSelect = (e: SyntheticEvent, { name, value }: DropdownProps) => {
    setMtPackage({ ...mtPackage, [name]: value });
    props.onChange(FlopyMt3dMtadv.fromObject({ ...mtPackage, [name]: value }));
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    return setMtPackage({ ...mtPackage, [name]: value });
  };

  const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (cast) {
      value = cast(value);
    }

    setMtPackage({ ...mtPackage, [name]: value });
    props.onChange(FlopyMt3dMtadv.fromObject({ ...mtPackage, [name]: value }));
  };

  const handleOnChangeCheckbox = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {

    const { name, checked } = data;
    if (name === undefined) {
      return;
    }

    setMtPackage({ ...mtPackage, [name]: checked ? 1 : 0 });
    props.onChange(FlopyMt3dMtadv.fromObject({ ...mtPackage, [name]: checked ? 1 : 0 }));
  };

  const { readOnly } = props;

  return (
    <Form>
      <Header as={'h3'}>ADV: Advection Package</Header>
      <Segment>
        <Form.Group>
          <Form.Field width={15}>
            <label className={'headerLabel'}>Advection solution option (MIXELM)</label>
            <Select
              fluid={true}
              name={'mixelm'}
              value={mtPackage.mixelm}
              disabled={readOnly}
              onChange={handleOnSelect}
              options={[
                { key: 0, value: 0, text: '0: Standard finite difference method' },
                { key: 1, value: 1, text: '1: Forward-tracking (MOC)' },
                { key: 2, value: 2, text: '2: Backward-tracking (MMOC)' },
                { key: 3, value: 3, text: '3: Hybrid (HMOC)' },
                { key: 4, value: -1, text: '-1: Third-order TVD (ULTIMATE)' },
              ]}
            />
          </Form.Field>
          <Form.Field width={1}>
            <label>&nbsp;</label>
            <InfoPopup
              description={documentation.adv.mixelm}
              title={'MIXELM'}
              position={'bottom right'}
              iconOutside={true}
            />
          </Form.Field>
        </Form.Group>
      </Segment>

      <Accordion styled={true} fluid={true}>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
          <Icon name={'dropdown'} />
          Advection Parameters and Particle Tracking
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Form.Group>
            <Form.Field width={8}>
              <label>Courant number (PERCEL)</label>
              <Input
                type={'number'}
                name={'percel'}
                value={mtPackage.percel}
                disabled={readOnly}
                onBlur={handleOnBlur(parseFloat)}
                onChange={handleOnChange}
                icon={<InfoPopup
                  description={documentation.adv.percel}
                  title='PERCEL'
                  position='top right'
                />}
              />
            </Form.Field>
            {[0].includes(mtPackage.mixelm) &&
              <Form.Group>
                <Form.Field width={15}>
                  <label>Weighting scheme (NADVFD)</label>
                  <Select
                    fluid={true}
                    name={'nadvfd'}
                    value={mtPackage.nadvfd}
                    disabled={readOnly}
                    onChange={handleOnSelect}
                    options={[
                      { key: 0, value: 1, text: '0 or 1: Upstream weighting (default)' },
                      { key: 1, value: 2, text: '2: Central-in-space weighting' },
                    ]}
                  />
                </Form.Field>
                <Form.Field width={1}>
                  <label>&nbsp;</label>
                  <InfoPopup
                    description={documentation.adv.nadvfd}
                    title={'NADVFD'}
                    position={'top right'}
                  />
                </Form.Field>
              </Form.Group>
            }
            {[1, 3].includes(mtPackage.mixelm) &&
              <Form.Field width={8}>
                <label>Maximum moving particles (MXPART)</label>
                <Input
                  type={'number'}
                  name={'mxpart'}
                  value={mtPackage.mxpart}
                  disabled={readOnly}
                  onBlur={handleOnBlur(parseInt)}
                  onChange={handleOnChange}
                  icon={<InfoPopup
                    description={documentation.adv.mxpart}
                    title='MXPART'
                    position='top right'
                  />}
                />
              </Form.Field>
            }
          </Form.Group>

          {[1, 2, 3].includes(mtPackage.mixelm) &&
            <div>
              <Form.Group widths={'equal'}>
                <Form.Field width={14}>
                  <label>Particle tracking algorithm (ITRACK)</label>
                  <Select
                    fluid={true}
                    name={'itrack'}
                    value={mtPackage.itrack}
                    disabled={readOnly}
                    onChange={handleOnSelect}
                    options={[
                      { key: 0, value: 1, text: '1: First-order Euler' },
                      { key: 1, value: 2, text: '2: Fourth-order Runge-Kutta' },
                      { key: 2, value: 3, text: '3: Hybrid' },
                    ]}
                  />
                </Form.Field>
                <Form.Field width={1}>
                  <label>&nbsp;</label>
                  <InfoPopup
                    description={documentation.adv.itrack}
                    title={'ITRACK'}
                    position={'top right'}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Concentration weighting factor (WD)</label>
                  <Input
                    type={'number'}
                    name={'wd'}
                    value={mtPackage.wd}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseFloat)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.adv.wd}
                      title='WD'
                      position='top right'
                    />}
                  />
                </Form.Field>
              </Form.Group>
            </div>
          }
        </Accordion.Content>

        {[1, 3].includes(mtPackage.mixelm) &&
          <div>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClickAccordion}>
              <Icon name={'dropdown'} />
              Particle Distribution
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label>Small Relative Cell Concentration Gradient (DCEPS)</label>
                  <Input
                    type={'number'}
                    name={'dceps'}
                    value={mtPackage.dceps}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseFloat)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.adv.dceps}
                      title='DCEPS'
                      position='top right'
                    />}
                  />
                </Form.Field>
                <Form.Field width={14}>
                  <label>Particle pattern (NPLANE)</label>
                  <Checkbox
                    toggle={true}
                    name={'nplane'}
                    checked={Boolean(mtPackage.nplane)}
                    disabled={readOnly}
                    icon={<InfoPopup
                      description={documentation.adv.nplane}
                      title='NPLANE'
                      position='top right'
                    />}
                    on
                  />
                </Form.Field>
                <Form.Field width={1}>
                  <label>&nbsp;</label>
                  <InfoPopup
                    description={documentation.adv.nplane}
                    title={'NPLANE'}
                    position={'top right'}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label>Initial particles at cells {'>'} DCEPS (NPL)</label>
                  <Input
                    type={'number'}
                    name={'npl'}
                    value={mtPackage.npl}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup description={documentation.adv.npl} title='NPL' />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Initial particles at cells {'>'} DCEPS (NPH)</label>
                  <Input
                    type={'number'}
                    name={'nph'}
                    value={mtPackage.nph}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.adv.nph}
                      title={'NPH'}
                      position={'top right'}
                    />}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label>Min. no. of particles per cell (NPMIN)</label>
                  <Input
                    type={'number'}
                    name={'npmin'}
                    value={mtPackage.npmin}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.adv.npmin}
                      title={'NPMIN'}
                    />}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Max. no. of particles per cell (NPMAX)</label>
                  <Input
                    type={'number'}
                    name={'npmax'}
                    value={mtPackage.npmax}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.adv.npmax}
                      title='NPMAX'
                      position='top right'
                    />}
                  />
                </Form.Field>
              </Form.Group>
            </Accordion.Content>
          </div>
        }

        {[2, 3].includes(mtPackage.mixelm) &&
          <div>
            <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClickAccordion}>
              <Icon name={'dropdown'} />
              Solution Flags and Critical Concentration
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
              <Form.Group>
                <Form.Field>
                  <label>Particle pattern to approximate sink cells (NLSINK)</label>
                  <Checkbox
                    toggle={true}
                    name={'nlsink'}
                    checked={Boolean(mtPackage.nlsink)}
                    disabled={readOnly}
                    onChange={handleOnChangeCheckbox}
                    // label={mtPackage.nlsink >= 0 ? 'fixed' : 'random'} TODO !!
                  />
                </Form.Field>
                <Form.Field width={1}>
                  <InfoPopup
                    description={documentation.adv.nlsink}
                    title={'NLSINK'}
                    position={'top right'}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  <label>No. of particles used to approximate sink cells (NPSINK)</label>
                  <Input
                    type={'number'}
                    name={'npsink'}
                    value={mtPackage.npsink}
                    disabled={readOnly}
                    onBlur={handleOnBlur(parseInt)}
                    onChange={handleOnChange}
                    icon={<InfoPopup
                      description={documentation.adv.npsink}
                      title='NPSINK'
                      position='top right'
                    />}
                  />
                </Form.Field>
                {mtPackage.mixelm === 3 &&
                  <Form.Field>
                    <label>Critical Relative Concentration Gradient (DCHMOC)</label>
                    <Input
                      type={'number'}
                      name={'dchmoc'}
                      value={mtPackage.dchmoc}
                      disabled={readOnly}
                      onBlur={handleOnBlur(parseFloat)}
                      onChange={handleOnChange}
                      icon={<InfoPopup
                        description={documentation.adv.dchmoc}
                        title='DCHMOC'
                        position='top right'
                      />}
                    />
                  </Form.Field>
                }
              </Form.Group>
            </Accordion.Content>
          </div>
        }
      </Accordion>
    </Form>
  );
};

export default AdvPackageProperties;
