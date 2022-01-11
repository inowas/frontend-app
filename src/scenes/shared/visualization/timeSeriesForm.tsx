import { Button, CheckboxProps, DropdownProps, Form, InputOnChangeData } from 'semantic-ui-react';
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react';
import { ITimeSeries, fileTypes, legendLocations, timeSeriesDefaults } from './visualization.type';

interface IActiveInput {
  name: string;
  value: string;
  type?: string;
}

interface IProps {
  onChange: (s: ITimeSeries) => void;
  simData: boolean;
}

const TimeSeriesForm = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
  const [settings, setSettings] = useState<ITimeSeries>(timeSeriesDefaults);

  const timeOptions = [{ key: 'datetime', value: 'Datetime', text: 'Datetime' }];

  const handleClickButton = () => props.onChange(settings);

  const handleBlurInput = () => {
    if (activeInput) {
      setSettings({
        ...settings,
        [activeInput.name]: activeInput.type === 'number' ? parseFloat(activeInput.value) : activeInput.value,
      });
    }
    setActiveInput(null);
  };

  const handleChangeCheckbox = (e: FormEvent<HTMLInputElement>, { name, checked }: CheckboxProps) => {
    if (name) {
      setSettings({
        ...settings,
        [name]: checked,
      });
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, { name, type, value }: InputOnChangeData) => {
    setActiveInput({
      name,
      value,
      type,
    });
  };

  const handleChangeSelect = (e: SyntheticEvent, { name, value }: DropdownProps) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  return (
    <Form>
      <Form.Input
        onBlur={handleBlurInput}
        onChange={handleChangeInput}
        label="Graph title"
        name="title"
        value={activeInput && activeInput.name === 'title' ? activeInput.value : settings.title}
      />
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Label of x axis"
          name="xlabel"
          value={activeInput && activeInput.name === 'xlabel' ? activeInput.value : settings.xlabel}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Label of y axis"
          name="ylabel"
          value={activeInput && activeInput.name === 'ylabel' ? activeInput.value : settings.ylabel}
        />
      </Form.Group>
      {props.simData && (
        <Form.Checkbox
          checked={settings.asksti}
          name="asksti"
          label="Display simulated data"
          onChange={handleChangeCheckbox}
        />
      )}
      <Form.Group widths="equal">
        <Form.Select
          fluid
          onChange={handleChangeSelect}
          placeholder="Choose x axis"
          label="X axis"
          name="time"
          options={timeOptions}
          value={settings.time}
        />
        {settings.time === 'Datetime' && (
          <Form.Input
            onBlur={handleBlurInput}
            onChange={handleChangeInput}
            label="Format of x axis"
            name="Xaxisformat"
            value={activeInput && activeInput.name === 'Xaxisformat' ? activeInput.value : settings.Xaxisformat}
          />
        )}
      </Form.Group>
      <Form.Select
        fluid
        name="leglocation"
        onChange={handleChangeSelect}
        options={legendLocations.map((e) => ({ key: e, value: e, text: e }))}
        placeholder="Choose legend location"
        label="Legend location"
        value={settings.leglocation}
      />
      <Form.Checkbox checked={settings.grid} name="grid" label="Show grid" onChange={handleChangeCheckbox} />
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          placeholder="Enter file name"
          label="File name"
          name="name"
          value={activeInput && activeInput.name === 'name' ? activeInput.value : settings.name}
        />
        <Form.Select
          fluid
          name="filetype"
          onChange={handleChangeSelect}
          options={fileTypes.map((e) => ({ key: e, value: e, text: e }))}
          placeholder="Select file type"
          label="File type"
          value={settings.filetype}
        />
      </Form.Group>
      <Form.Input
        onBlur={handleBlurInput}
        onChange={handleChangeInput}
        placeholder="Enter dpi"
        label="dpi"
        name="dpi"
        type="number"
        value={activeInput && activeInput.name === 'dpi' ? activeInput.value : settings.dpi}
      />
      <Button primary fluid onClick={handleClickButton}>
        Apply
      </Button>
    </Form>
  );
};

export default TimeSeriesForm;
