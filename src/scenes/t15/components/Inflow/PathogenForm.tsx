import {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {DropdownProps, Form, InputProps} from 'semantic-ui-react';
import IPathogen from '../../../../core/model/qmra/Pathogen.type';
import Pathogen from '../../../../core/model/qmra/Pathogen';

interface IProps {
  groups: string[];
  onChange: (e: Pathogen) => void;
  readOnly: boolean;
  selectedPathogen: Pathogen;
}

const types = ['log10_norm'];

const ExposureForm = ({groups, onChange, readOnly, selectedPathogen}: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<IPathogen>(selectedPathogen.toObject());

  useEffect(() => {
    setElement(selectedPathogen.toObject());
  }, [selectedPathogen]);

  const handleBlur = (type?: string) => () => {
    if (!activeInput) {
      return null;
    }

    const cItem = {
      ...element,
      [activeInput]: type === 'number' ? parseFloat(activeValue) : activeValue
    };

    setElement(cItem);
    setActiveInput(null);
    onChange(Pathogen.fromObject(cItem));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
    const cItem = {
      ...element,
      [name]: value
    };
    setElement(cItem);
    onChange(Pathogen.fromObject(cItem));
  };

  return (
    <Form>
      <Form.Group widths='equal'>
        <Form.Field>
          <Form.Input
            label="Name"
            name="name"
            onBlur={handleBlur()}
            onChange={handleChange}
            readOnly={readOnly}
            value={activeInput === 'name' ? activeValue : element.name}
          />
        </Form.Field>
        <Form.Field>
          <Form.Select
            allowAdditions
            label="Group"
            name="group"
            onAddItem={handleSelect}
            onChange={handleSelect}
            options={groups.map((g) => ({key: g, value: g, text: g}))}
            readOnly={readOnly}
            search
            value={element.group}
          />
        </Form.Field>
      </Form.Group>
      <Form.Field>
          <Form.Select
            label="Probability Density Function"
            name="type"
            onAddItem={handleSelect}
            onChange={handleSelect}
            options={types.map((t) => ({key: t, value: t, text: t}))}
            readOnly={readOnly}
            value={element.type}
          />
        </Form.Field>
        <Form.Group widths='equal'>
          <Form.Field>
            <Form.Input
              label="Min"
              name="min"
              type="number"
              onBlur={handleBlur('number')}
              onChange={handleChange}
              readOnly={readOnly}
              value={activeInput === 'min' ? activeValue : element.min}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="Max"
              name="max"
              type="number"
              onBlur={handleBlur('number')}
              onChange={handleChange}
              readOnly={readOnly}
              value={activeInput === 'max' ? activeValue : element.max}
            />
          </Form.Field>
        </Form.Group>
    </Form>
  );
};

export default ExposureForm;
