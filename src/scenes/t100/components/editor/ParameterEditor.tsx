import { Form, InputProps } from 'semantic-ui-react';
import { FormEvent, useState } from 'react';
import Parameter from '../../../../core/marPro/Parameter';

interface IProps {
  parameter: Parameter;
  onChange: (parameter: Parameter) => void;
}

const ParameterEditor = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleBlur = (isNumeric: boolean, placeholder?: number) => () => {
    if (!activeInput) {
      return;
    }

    const cParameter = {
      ...props.parameter.toObject(),
      [activeInput]: isNumeric ? (activeValue === '' ? placeholder : parseFloat(activeValue)) : activeValue,
    };

    setActiveInput(null);
    props.onChange(Parameter.fromObject(cParameter));
  };

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(false)}
          label="Name"
          name="name"
          value={activeInput === 'name' ? activeValue : props.parameter.name}
        />
        {props.parameter.valuePropertyKey !== undefined && (
          <Form.Input disabled label="Linked to property key" value={props.parameter.valuePropertyKey} />
        )}
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true, 0)}
          label="Value"
          name="value"
          value={activeInput === 'value' ? activeValue : props.parameter.value}
          type="number"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          label="Min"
          name="min"
          placeholder="No min"
          value={activeInput === 'min' ? activeValue : props.parameter.min}
          type="number"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          label="Max"
          name="max"
          placeholder="No max"
          value={activeInput === 'max' ? activeValue : props.parameter.max}
          type="number"
        />
      </Form.Group>
    </Form>
  );
};

export default ParameterEditor;
