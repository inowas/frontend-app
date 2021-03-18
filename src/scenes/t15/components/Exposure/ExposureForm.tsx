import {DropdownProps, Form, InputProps} from 'semantic-ui-react';
import Exposure from '../../../../core/model/qmra/Exposure';
import IExposure from '../../../../core/model/qmra/Exposure.type';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';

interface IProps {
  onChange: (e: Exposure) => void;
  readOnly: boolean;
  selectedExposure: Exposure;
}

const ExposureForm = ({onChange, readOnly, selectedExposure}: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<IExposure>(selectedExposure.toObject());

  useEffect(() => {
    setElement(selectedExposure.toObject());
  }, [selectedExposure]);

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
    onChange(Exposure.fromObject(cItem));
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
    onChange(Exposure.fromObject(cItem));
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
            label="Type"
            name="type"
            onChange={handleSelect}
            options={[
              {key: 'value', value: 'value', text: 'Value'},
              {key: 'triangle', value: 'triangle', text: 'Triangle'}
            ]}
            readOnly={readOnly}
            value={element.type}
          />
        </Form.Field>
      </Form.Group>
      {element.type === 'value' &&
      <Form.Field>
        <Form.Input
          label="Value"
          name="value"
          onBlur={handleBlur('number')}
          onChange={handleChange}
          readOnly={readOnly}
          type="number"
          value={activeInput === 'value' ? activeValue : element.value}
        />
      </Form.Field>
      }
      {element.type === 'triangle' &&
      <React.Fragment>
        <Form.Group widths='equal'>
          <Form.Field>
            <Form.Input
              label="Min"
              name="min"
              onBlur={handleBlur('number')}
              onChange={handleChange}
              readOnly={readOnly}
              type="number"
              value={activeInput === 'min' ? activeValue : element.min}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="Max"
              name="max"
              onBlur={handleBlur('number')}
              onChange={handleChange}
              readOnly={readOnly}
              type="number"
              value={activeInput === 'max' ? activeValue : element.max}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <Form.Input
              label="Mean"
              name="mean"
              onBlur={handleBlur('number')}
              onChange={handleChange}
              readOnly={readOnly}
              type="number"
              value={activeInput === 'mean' ? activeValue : element.mean}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="Mode"
              name="mode"
              onBlur={handleBlur('number')}
              onChange={handleChange}
              readOnly={readOnly}
              type="number"
              value={activeInput === 'mode' ? activeValue : element.mode}
            />
          </Form.Field>
        </Form.Group>
      </React.Fragment>
      }
    </Form>
  );
};

export default ExposureForm;
