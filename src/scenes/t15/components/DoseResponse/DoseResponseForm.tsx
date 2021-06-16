import {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {DropdownProps, Form, Icon, InputProps} from 'semantic-ui-react';
import DoseResponse from '../../../../core/model/qmra/DoseResponse';
import IDoseResponse from '../../../../core/model/qmra/DoseResponse.type';

interface IProps {
  onChange?: (e: DoseResponse) => void;
  readOnly: boolean;
  selectedDoseResponse: DoseResponse;
}

const bestFitModels = ['beta-Poisson', 'exponential'];

const DoseResponseForm = ({onChange, readOnly, selectedDoseResponse}: IProps) => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleSelectBestFitModel = (e: SyntheticEvent, {value}: DropdownProps) => {
    if (!onChange) {
      return;
    }

    const cItem = {
      ...element,
      reference: '',
      link: ''
    };

    if (value === 'beta-Poisson') {
      cItem.bestFitModel = 'beta-Poisson';
      cItem.k = null;
      cItem.n50 = 0;
      cItem.alpha = 0;
    }

    if (value === 'exponential') {
      cItem.bestFitModel = 'exponential';
      cItem.k = 0;
      cItem.n50 = null;
      cItem.alpha = null;
    }

    setElement(cItem);
    onChange(DoseResponse.fromObject(cItem));
  };

  const handleClickLink = (url: string) => () => window.open(url, '_blank');

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Input label="Pathogen group" readOnly={true} value={element.pathogenGroup}/>
        </Form.Field>
        <Form.Field>
          <Form.Input label="Pathogen name" readOnly={true} value={element.pathogenName}/>
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <Form.Select
          label="Best-fit model"
          name="bestFitModel"
          onChange={handleSelectBestFitModel}
          options={bestFitModels.map((t) => ({key: t, value: t, text: t}))}
          readOnly={readOnly}
          value={element.bestFitModel}
        />
      </Form.Field>
      {element.bestFitModel === 'beta-Poisson' &&
      <Form.Group widths="equal">
        <Form.Field>
          <label>alpha</label>
          <Form.Input
            name="alpha"
            onBlur={handleBlur('number')}
            onChange={handleChange}
            placeholder="alpha"
            readOnly={readOnly}
            type="number"
            value={activeInput === 'alpha' ? activeValue : element.alpha || 0}
          />
        </Form.Field>
        <Form.Field>
          <label>N50</label>
          <Form.Input
            name="n50"
            onBlur={handleBlur('number')}
            onChange={handleChange}
            placeholder="N50"
            readOnly={readOnly}
            type="number"
            value={activeInput === 'n50' ? activeValue : element.n50 || 0}
          />
        </Form.Field>
      </Form.Group>
      }
      {element.bestFitModel === 'exponential' &&
      <Form.Field>
        <label>k</label>
        <Form.Input
          name="k"
          onBlur={handleBlur('number')}
          onChange={handleChange}
          placeholder="k"
          readOnly={readOnly}
          type="number"
          value={activeInput === 'k' ? activeValue : element.k || 0}
        />
      </Form.Field>
      }
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
    </Form>
  );
};

export default DoseResponseForm;
