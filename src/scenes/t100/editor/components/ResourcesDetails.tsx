import { CheckboxProps, Divider, Form, Image, InputProps, List, Radio } from 'semantic-ui-react';
import { FormEvent, useState } from 'react';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import { icons } from '../../assets/images';
import ColorPicker from '../../../shared/complexTools/ColorPicker';
import ResourceSettings from '../../../../core/marPro/ResourceSettings';

interface IProps {
  onChange: (resource: ResourceSettings) => void;
  resource: ResourceSettings;
}

const ResourcesDetails = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleBlur = (isNumeric: boolean, placeholder?: number) => () => {
    if (!activeInput) {
      return;
    }

    const cResource: IResourceSettings = {
      ...props.resource.toObject(),
      [activeInput]: isNumeric ? (activeValue === '' ? placeholder : parseFloat(activeValue)) : activeValue,
    };

    setActiveInput(null);
    props.onChange(ResourceSettings.fromObject(cResource));
  };

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeColor = (color: string) => {
    const cResource: IResourceSettings = {
      ...props.resource.toObject(),
      color,
    };
    props.onChange(ResourceSettings.fromObject(cResource));
  };

  const handleChangeIcon = (_: FormEvent<HTMLInputElement>, { name }: CheckboxProps) => {
    const cResource: IResourceSettings = {
      ...props.resource.toObject(),
      icon: name,
    };
    props.onChange(ResourceSettings.fromObject(cResource));
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(false)}
          label="Name"
          name="name"
          value={activeInput === 'name' ? activeValue : props.resource.name}
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(false)}
          label="Unit"
          name="unit"
          placeholder="No unit"
          value={activeInput === 'unit' ? activeValue : props.resource.unit}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true, 0)}
          label="Start value"
          name="startValue"
          value={activeInput === 'startValue' ? activeValue : props.resource.startValue}
          type="number"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          label="Min"
          name="min"
          placeholder="No min"
          value={activeInput === 'min' ? activeValue : props.resource.min}
          type="number"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          label="Max"
          name="max"
          placeholder="No max"
          value={activeInput === 'max' ? activeValue : props.resource.max}
          type="number"
        />
      </Form.Group>
      <Divider />
      <Form.Group>
        <ColorPicker color={props.resource.color} onChange={handleChangeColor} />
        <Form.Field>
          <label>Icon</label>
          <List horizontal>
            {icons.map((icon, k) => (
              <List.Item key={k}>
                <Image avatar src={icon.img}></Image>
                <List.Content>
                  <Radio name={icon.name} checked={props.resource.icon === icon.name} onChange={handleChangeIcon} />
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Form.Field>
      </Form.Group>
      <Divider />
    </Form>
  );
};

export default ResourcesDetails;
