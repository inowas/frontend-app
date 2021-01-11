import {Form, InputOnChangeData, Modal} from 'semantic-ui-react';
import React, {ChangeEvent, useState} from 'react';

export interface ISettings {
  colorScale: string[];
  percentQuantile: number;
}

interface IProps {
  onChange: (settings: ISettings) => void;
}

const FlowResultsSettings = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const [colorScale, setColorScale] = useState<ISettings['colorScale']>(
    ['#800080', '#ff2200', '#fcff00', '#45ff8e', '#15d6ff', '#0000FF']
  );
  const [percentQuantile, setPercentQuantile] = useState<ISettings['percentQuantile']>(1);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangePercentQuantile = () => {
    const parsedValue = parseFloat(activeValue);
    const v = parsedValue > 1 ? 1 : (parsedValue < 0 ? 0 : parsedValue);
    setPercentQuantile(v);
  };

  return (
    <Modal>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            label="Quantile"
            name="percentQuantile"
            onBlur={handleChangePercentQuantile}
            onChange={handleChangeInput}
            type="number"
            value={activeInput === 'percentQuantile' ? activeValue : percentQuantile}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>

      </Modal.Actions>
    </Modal>
  );
};

export default FlowResultsSettings;
