import { ChangeEvent, useEffect, useState } from 'react';
import { Form, InputProps } from 'semantic-ui-react';
import ITreatmentScheme from '../../../../core/model/qmra/TreatmentScheme.type';
import TreatmentScheme from '../../../../core/model/qmra/TreatmentScheme';

interface IProps {
  onChange: (e: TreatmentScheme) => void;
  readOnly: boolean;
  selectedScheme: TreatmentScheme;
}

const SchemeForm = ({ onChange, readOnly, selectedScheme }: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<ITreatmentScheme>(selectedScheme.toObject());

  useEffect(() => {
    setElement(selectedScheme.toObject());
  }, [selectedScheme]);

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
    onChange(TreatmentScheme.fromObject(cItem));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Input
            label="Treatment Process"
            readOnly={true}
            value={element.treatmentName}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Treatment scheme name"
            name="name"
            onBlur={handleBlur()}
            onChange={handleChange}
            readOnly={readOnly}
            value={activeInput === 'name' ? activeValue : element.name}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default SchemeForm;
