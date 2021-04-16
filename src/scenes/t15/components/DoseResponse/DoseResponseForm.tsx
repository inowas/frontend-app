import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { DropdownProps, Form, InputProps } from 'semantic-ui-react';
import DoseResponse from '../../../../core/model/qmra/DoseResponse';
import IDoseResponse from '../../../../core/model/qmra/DoseResponse.type';
import ToggleableInput from '../../../shared/complexTools/ToggleableInput';

interface IProps {
  onChange?: (e: DoseResponse) => void;
  readOnly: boolean;
  selectedDoseResponse: DoseResponse;
}

const bestFitModels = ['beta-Poisson', 'exponential'];

const DoseResponseForm = ({ onChange, readOnly, selectedDoseResponse }: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<IDoseResponse>(selectedDoseResponse.toObject());

  useEffect(() => {
    setElement(selectedDoseResponse.toObject());
  }, [selectedDoseResponse]);

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
    onChange(DoseResponse.fromObject(cItem));
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
    onChange(DoseResponse.fromObject(cItem));
  };

  const handleSelect = (e: SyntheticEvent, { name, value }: DropdownProps) => {
    if (!onChange) {
      return;
    }
    const cItem = {
      ...element,
      [name]: value,
    };
    setElement(cItem);
    onChange(DoseResponse.fromObject(cItem));
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Input label="Pathogen group" readOnly={true} value={element.pathogenGroup} />
        </Form.Field>
        <Form.Field>
          <Form.Input label="Pathogen name" readOnly={true} value={element.pathogenName} />
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <Form.Select
          label="Best-fit model"
          name="bestFitModel"
          onAddItem={handleSelect}
          onChange={handleSelect}
          options={bestFitModels.map((t) => ({ key: t, value: t, text: t }))}
          readOnly={readOnly}
          value={element.bestFitModel}
        />
      </Form.Field>
      <Form.Group widths="equal">
        <Form.Field>
          <label>k</label>
          <ToggleableInput
            name="k"
            onChange={handleChangeToggleable}
            placeholder="k"
            readOnly={readOnly}
            type="number"
            value={element.k === undefined ? null : element.k}
          />
        </Form.Field>
        <Form.Field>
          <label>alpha</label>
          <ToggleableInput
            name="alpha"
            onChange={handleChangeToggleable}
            placeholder="alpha"
            readOnly={readOnly}
            type="number"
            value={element.alpha === undefined ? null : element.alpha}
          />
        </Form.Field>
        <Form.Field>
          <label>N50</label>
          <ToggleableInput
            name="n50"
            onChange={handleChangeToggleable}
            placeholder="n50"
            readOnly={readOnly}
            type="number"
            value={element.n50 === undefined ? null : element.n50}
          />
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <Form.Input
          label="Reference"
          name="reference"
          onBlur={handleBlur()}
          onChange={handleChange}
          readOnly={readOnly}
          value={activeInput === 'reference' ? activeValue : element.reference}
        />
      </Form.Field>
      <Form.Field>
        <Form.Input
          label="Link"
          name="link"
          onBlur={handleBlur()}
          onChange={handleChange}
          readOnly={readOnly}
          value={activeInput === 'link' ? activeValue : element.link}
        />
      </Form.Field>
    </Form>
  );
};

export default DoseResponseForm;
