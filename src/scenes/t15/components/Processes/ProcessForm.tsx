import { ChangeEvent, useEffect, useState } from 'react';
import { Form, InputProps } from 'semantic-ui-react';
import {ITreatmentProcess} from '../../../../core/model/qmra/TreatmentProcess.type';
import TreatmentProcess from '../../../../core/model/qmra/TreatmentProcess';


interface IProps {
  onChange: (e: TreatmentProcess) => void;
  readOnly: boolean;
  selectedProcess: TreatmentProcess;
}

const ProcessForm = ({ onChange, readOnly, selectedProcess }: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<ITreatmentProcess>(selectedProcess.toObject());

  useEffect(() => {
    setElement(selectedProcess.toObject());
  }, [selectedProcess]);

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

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          label="Treatment Name"
          name="name"
          onBlur={handleBlur()}
          onChange={handleChange}
          readOnly={readOnly}
          value={activeInput === 'name' ? activeValue : element.name}
        />
        <Form.Input
          label="Treatment Group"
          name="group"
          onBlur={handleBlur()}
          onChange={handleChange}
          readOnly={readOnly}
          value={activeInput === 'group' ? activeValue : element.group}
        />
      </Form.Group>
    </Form>
  );
};

export default ProcessForm;
