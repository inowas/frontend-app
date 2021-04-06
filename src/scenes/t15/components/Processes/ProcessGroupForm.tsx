import { Button, DropdownProps, Form, InputProps, Label, Segment } from 'semantic-ui-react';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { ITreatmentProcess } from '../../../../core/model/qmra/TreatmentProcess.type';
import TreatmentProcess from '../../../../core/model/qmra/TreatmentProcess';

interface IProps {
  onChange: (e: TreatmentProcess) => void;
  onRemove: (e: TreatmentProcess) => void;
  readOnly: boolean;
  process: TreatmentProcess;
}

const types = ['uniform'];

const ProcessGroupForm = ({ onChange, onRemove, readOnly, process }: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<ITreatmentProcess>(process.toObject());

  useEffect(() => {
    setElement(process.toObject());
  }, [process]);

  const handleBlur = (type?: string) => () => {
    if (!activeInput) {
      return null;
    }

    const cItem = {
      ...element,
      [activeInput]: type === 'number' ? parseFloat(activeValue) : activeValue,
    };

    setElement(cItem);
    setActiveInput(null);
    onChange(TreatmentProcess.fromObject(cItem));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleRemove = () => onRemove(TreatmentProcess.fromObject(element));

  const handleSelect = (e: SyntheticEvent, { name, value }: DropdownProps) => {
    const cItem = {
      ...element,
      [name]: value,
    };
    setElement(cItem);
    onChange(TreatmentProcess.fromObject(cItem));
  };

  return (
    <Segment raised>
      <Label color='blue' ribbon>
        {element.pathogenGroup}
      </Label>
      <Button circular floated="right" icon='trash' onClick={handleRemove}/>
      <Form>
        <Form.Select
          label="Probability Density Function"
          name="type"
          onAddItem={handleSelect}
          onChange={handleSelect}
          options={types.map((t) => ({ key: t, value: t, text: t }))}
          readOnly={readOnly}
          value={element.type}
        />
        <Form.Group widths="equal">
          <Form.Input
            label="Min"
            name="min"
            onBlur={handleBlur()}
            onChange={handleChange}
            readOnly={readOnly}
            value={activeInput === 'min' ? activeValue : element.min}
            type="number"
          />
          <Form.Input
            label="Max"
            name="max"
            onBlur={handleBlur()}
            onChange={handleChange}
            readOnly={readOnly}
            value={activeInput === 'max' ? activeValue : element.max}
            type="number"
          />
        </Form.Group>
      </Form>
    </Segment>
  );
};

export default ProcessGroupForm;
