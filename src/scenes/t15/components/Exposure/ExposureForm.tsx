import {DropdownProps, Form, InputProps, Segment} from 'semantic-ui-react';
import ExposureScenario from '../../../../core/model/qmra/ExposureScenario';
import IExposureScenario from '../../../../core/model/qmra/ExposureScenario.type';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';

interface IProps {
  onChange: (e: ExposureScenario) => void;
  readOnly: boolean;
  selectedExposure: ExposureScenario;
}

const ExposureForm = ({onChange, readOnly, selectedExposure}: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<IExposureScenario>(selectedExposure.toObject());

  useEffect(() => {
    setElement(selectedExposure.toObject());
  }, [selectedExposure]);

  const handleBlur = (type?: string) => () => {
    if (!activeInput || (type === 'number' && activeValue === '')) {
      setActiveInput(null);
      return null;
    }

    let cItem;
    if (activeInput === 'min' || activeInput === 'max' || activeInput === 'mode' || activeInput === 'value') {
      cItem = {
        ...element,
        litresPerEvent: {
          ...element.litresPerEvent,
          [activeInput]: parseFloat(activeValue)
        }
      };
    } else if (activeInput === 'eventsPerYear') {
      cItem = {
        ...element,
        eventsPerYear: {
          ...element.eventsPerYear,
          value: parseFloat(activeValue)
        }
      }
    } else {
      cItem = {
        ...element,
        [activeInput]: type === 'number' ? parseFloat(activeValue) : activeValue
      };
    }

    setElement(cItem);
    setActiveInput(null);
    onChange(ExposureScenario.fromObject(cItem));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleSelect = (e: SyntheticEvent, {value}: DropdownProps) => {
    if (typeof value !== 'string') {
      return;
    }
    const cItem = {
      ...element,
      litresPerEvent: {
        ...element.litresPerEvent,
        type: value
      }
    };
    setElement(cItem);
    onChange(ExposureScenario.fromObject(cItem));
  };

  return (
    <Form>
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
        <Form.Input
          label="Description"
          name="description"
          onBlur={handleBlur()}
          onChange={handleChange}
          readOnly={readOnly}
          value={activeInput === 'description' ? activeValue : element.description}
        />
      </Form.Field>
      <Form.Field>
        <Form.Input
          label="Events per year"
          name="eventsPerYear"
          onBlur={handleBlur('number')}
          onChange={handleChange}
          readOnly={readOnly}
          type="number"
          value={activeInput === 'eventsPerYear' ? activeValue : element.eventsPerYear.value}
        />
      </Form.Field>
      <Segment>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Select
              label="Litres per Event"
              name="type"
              onChange={handleSelect}
              options={[
                {key: 'value', value: 'value', text: 'Value'},
                {key: 'triangle', value: 'triangle', text: 'Triangle'}
              ]}
              readOnly={readOnly}
              value={element.litresPerEvent.type}
            />
          </Form.Field>
        </Form.Group>
        {element.litresPerEvent.type === 'value' &&
        <Form.Field>
          <Form.Input
            label="Value"
            name="value"
            onBlur={handleBlur('number')}
            onChange={handleChange}
            readOnly={readOnly}
            type="number"
            value={activeInput === 'value' ? activeValue : element.litresPerEvent.value}
          />
        </Form.Field>
        }
        {element.litresPerEvent.type === 'triangle' &&
        <React.Fragment>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Input
                label="Min"
                name="min"
                onBlur={handleBlur('number')}
                onChange={handleChange}
                readOnly={readOnly}
                type="number"
                value={activeInput === 'min' ? activeValue : element.litresPerEvent.min}
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
                value={activeInput === 'max' ? activeValue : element.litresPerEvent.max}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <Form.Input
              label="Mode"
              name="mode"
              onBlur={handleBlur('number')}
              onChange={handleChange}
              readOnly={readOnly}
              type="number"
              value={activeInput === 'mode' ? activeValue : element.litresPerEvent.mode}
            />
          </Form.Field>
        </React.Fragment>
        }
      </Segment>
      <Form.Group widths="equal">
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
      </Form.Group>
    </Form>
  );
};

export default ExposureForm;
