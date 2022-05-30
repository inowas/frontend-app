import { Divider, Form, InputProps } from 'semantic-ui-react';
import { FormEvent, useState } from 'react';
import Parameter from '../../../../core/marPro/Parameter';
import RelationsCollection from '../../../../core/marPro/RelationsCollection';
import RelationsEditor from './RelationsEditor';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  scenario: Scenario;
  parameter: Parameter;
  onChange: (parameter: Parameter) => void;
  onChangeId: (id: string) => void;
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

  const handleBlurId = () => {
    setActiveInput(null);
    props.onChangeId(activeValue);
  };

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeIsFixed = () => {
    const cParameter = {
      ...props.parameter.toObject(),
      isFixed: !props.parameter.isFixed,
    };
    props.onChange(Parameter.fromObject(cParameter));
  };

  const handleChangeRelations = (relations: RelationsCollection) => {
    console.log(relations);
    const cParameter = {
      ...props.parameter.toObject(),
      relations: relations.toObject(),
    };
    props.onChange(Parameter.fromObject(cParameter));
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlurId}
          label="ID"
          name="id"
          value={activeInput === 'id' ? activeValue : props.parameter.id}
        />
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
        <Form.Field>
          <label>&nbsp;</label>
          <Form.Checkbox onChange={handleChangeIsFixed} label="Value is fixed" checked={props.parameter.isFixed} />
        </Form.Field>
      </Form.Group>
      <Form.Group>
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          disabled={props.parameter.isFixed}
          label="Min"
          name="min"
          placeholder="No min"
          value={activeInput === 'min' ? activeValue : props.parameter.min}
          type="number"
        />
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(true)}
          disabled={props.parameter.isFixed}
          label="Max"
          name="max"
          placeholder="No max"
          value={activeInput === 'max' ? activeValue : props.parameter.max}
          type="number"
        />
      </Form.Group>
      <Divider />
      <RelationsEditor
        onChange={handleChangeRelations}
        relations={RelationsCollection.fromObject(props.parameter.relations)}
        scenario={props.scenario}
      />
    </Form>
  );
};

export default ParameterEditor;
