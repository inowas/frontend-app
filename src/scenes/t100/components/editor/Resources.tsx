import { ColorChangeHandler, SketchPicker } from 'react-color';
import { Divider, Form, InputProps } from 'semantic-ui-react';
import { FormEvent, useState } from 'react';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import uuid from 'uuid';

interface IProps {
  resource?: IResourceSettings;
}

const initialState: IResourceSettings = {
  id: uuid.v4(),
  name: 'New Resource',
  startValue: 0,
};

const Resources = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const [resource, setResource] = useState<IResourceSettings>(props.resource || initialState);

  const handleBlur = (isNumeric: boolean, placeholder?: number) => () => {
    if (!activeInput) {
      return;
    }
    setResource({
      ...resource,
      [activeInput]: isNumeric ? (activeValue === '' ? placeholder : parseFloat(activeValue)) : activeValue,
    });
  };

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeColor: ColorChangeHandler = (res) => {
    setResource({
      ...resource,
      color: res.hex,
    });
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(false)}
          label="Name"
          name="name"
          value={activeInput === 'name' ? activeValue : resource.name}
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(false)}
          label="Unit"
          name="unit"
          placeholder="No unit"
          value={activeInput === 'unit' ? activeValue : resource.unit}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true, 0)}
          label="Start value"
          name="startValue"
          value={activeInput === 'startValue' ? activeValue : resource.startValue}
          type="number"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          label="Min"
          name="min"
          placeholder="No min"
          value={activeInput === 'min' ? activeValue : resource.min}
          type="number"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          label="Max"
          name="max"
          placeholder="No max"
          value={activeInput === 'max' ? activeValue : resource.max}
          type="number"
        />
      </Form.Group>
      <Divider />
      <Form.Group widths="equal">
        <SketchPicker disableAlpha={true} color={resource.color} onChange={handleChangeColor} />
      </Form.Group>
    </Form>
  );
};

export default Resources;

/*color?: string;
  id: string;
  max?: number;
  min?: number;
  name: string;
  needsStorage?: boolean;
  startValue: number;
  unit?: string;
*/
