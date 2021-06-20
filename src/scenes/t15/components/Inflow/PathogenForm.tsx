import {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {DropdownProps, Form, Icon, InputProps} from 'semantic-ui-react';
import {randomDistributions} from '../defaults/distribution';
import IPathogen from '../../../../core/model/qmra/Pathogen.type';
import Pathogen from '../../../../core/model/qmra/Pathogen';
import _ from 'lodash';
import doseResponseDefaults from '../defaults/doseResponse.json';

interface IProps {
  groups?: string[];
  onChange?: (e: Pathogen) => void;
  readOnly: boolean;
  selectedPathogen: Pathogen;
}

const PathogenForm = ({groups, onChange, readOnly, selectedPathogen}: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [element, setElement] = useState<IPathogen>(selectedPathogen.toObject());

  const defaults = doseResponseDefaults.filter((e) => e.pathogenGroup === element.group).map((e) => e.pathogenName);

  if (!defaults.includes(element.name)) {
    defaults.push(element.name);
  }

  useEffect(() => {
    setElement(selectedPathogen.toObject());
  }, [selectedPathogen]);

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
    onChange(Pathogen.fromObject(cItem));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
    if (!onChange) {
      return;
    }

    const cItem = {
      ...element,
      [name]: value,
    };
    setElement(cItem);
    onChange(Pathogen.fromObject(cItem));
  };

  const handleClickLink = (url: string) => () => window.open(url, '_blank');

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Select
            allowAdditions
            label="Group"
            name="group"
            onAddItem={handleSelect}
            onChange={handleSelect}
            options={groups ? groups.map((g) => ({key: g, value: g, text: g})) :
              [{key: selectedPathogen.group, value: selectedPathogen.group, text: selectedPathogen.group}]}
            readOnly={readOnly}
            search
            value={element.group}
          />
        </Form.Field>
        <Form.Field>
          <Form.Select
            allowAdditions
            label="Name"
            name="name"
            onAddItem={handleSelect}
            onChange={handleSelect}
            options={_.orderBy(defaults, ['asc']).map((g) => ({key: g, value: g, text: g}))}
            readOnly={readOnly}
            search
            value={element.name}
          />
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <Form.Select
          label="Probability Density Function"
          name="type"
          onAddItem={handleSelect}
          onChange={handleSelect}
          options={randomDistributions.map((t) => ({key: t, value: t, text: t}))}
          readOnly={readOnly}
          value={element.type}
        />
      </Form.Field>
      <Form.Group widths="equal">
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
            icon={
              element.link !== '' ? <Icon name="external alternate" link onClick={handleClickLink(element.link)}/> :
                undefined
            }
            label="Link"
            name="link"
            onBlur={handleBlur()}
            onChange={handleChange}
            readOnly={readOnly}
            value={activeInput === 'link' ? activeValue : element.link}
          />
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <Form.Input
          label="Notes"
          name="notes"
          onBlur={handleBlur()}
          onChange={handleChange}
          readOnly={readOnly}
          value={activeInput === 'notes' ? activeValue : element.notes}
        />
      </Form.Field>
    </Form>
  );
};

export default PathogenForm;
