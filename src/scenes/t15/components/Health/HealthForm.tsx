import { ChangeEvent, useEffect, useState } from 'react';
import { Form, InputProps } from 'semantic-ui-react';
import Health from '../../../../core/model/qmra/Health';
import IHealth from '../../../../core/model/qmra/Health.type';
import ToggleableInput from '../../../shared/complexTools/ToggleableInput';

interface IProps {
  onChange?: (e: Health) => void;
  readOnly: boolean;
  selectedHealth: Health;
}

const HealthForm = ({ onChange, readOnly, selectedHealth }: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<IHealth>(selectedHealth.toObject());

  useEffect(() => {
    setElement(selectedHealth.toObject());
  }, [selectedHealth]);

  const handleBlur = (type?: string) => () => {
    if (!activeInput || !onChange) {
      return null;
    }

    const cItem = {
      ...element,
      [activeInput]: type === 'number' ? parseFloat(activeValue) : activeValue,
    };

    setElement(cItem);
    setActiveInput(null);
    onChange(Health.fromObject(cItem));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeToggleable = (name: string, value: number | string | null) => {
    if (!onChange) {
      return null;
    }

    const cItem = {
      ...element,
      [name]: value === null ? undefined : value,
    };
    setElement(cItem);
    onChange(Health.fromObject(cItem));
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Input label="Pathogen name" readOnly={true} value={element.pathogenName} />
        </Form.Field>
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field>
          <label>Infection to illness</label>
          <ToggleableInput
            name="infectionToIllness"
            onChange={handleChangeToggleable}
            placeholder="infectionToIllness"
            readOnly={readOnly}
            type="number"
            value={element.infectionToIllness === undefined ? null : element.infectionToIllness}
          />
        </Form.Field>
        <Form.Field>
        <Form.Input
          label="Reference"
          name="reference1"
          onBlur={handleBlur()}
          onChange={handleChange}
          readOnly={readOnly}
          value={activeInput === 'reference1' ? activeValue : element.reference1}
        />
        </Form.Field>
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field>
          <label>DALYS per case</label>
          <ToggleableInput
            name="dalysPerCase"
            onChange={handleChangeToggleable}
            placeholder="dalysPerCase"
            readOnly={readOnly}
            type="number"
            value={element.dalysPerCase === undefined ? null : element.dalysPerCase}
          />
          </Form.Field>
          <Form.Field>
          <Form.Input
            label="Reference"
            name="reference2"
            onBlur={handleBlur()}
            onChange={handleChange}
            readOnly={readOnly}
            value={activeInput === 'reference2' ? activeValue : element.reference2}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default HealthForm;
