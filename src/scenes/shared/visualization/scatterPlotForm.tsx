import { Button, CheckboxProps, DropdownProps, Form, InputOnChangeData } from 'semantic-ui-react';
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react';
import { IScatterPlot, fileTypes, scatterPlotDefaults } from './visualization.type';

interface IActiveInput {
  name: string;
  value: string;
  type?: string;
}

interface IProps {
  onChange: (s: IScatterPlot) => void;
  simData: boolean;
}

const ScatterPlotForm = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
  const [settings, setSettings] = useState<IScatterPlot>(scatterPlotDefaults);

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
      <Form.Checkbox
        checked={settings.trendline}
        name="trendline"
        label="Plot trendline"
        onChange={handleChangeCheckbox}
      />
      {settings.trendline && (
        <Form.Group widths="equal">
          <Form.Input
            onBlur={handleBlurInput}
            onChange={handleChangeInput}
            label="Trendline x"
            name="x"
            type="number"
            value={activeInput && activeInput.name === 'x' ? activeInput.value : settings.x}
          />
          <Form.Input
            onBlur={handleBlurInput}
            onChange={handleChangeInput}
            label="Trendline y"
            name="y"
            type="number"
            value={activeInput && activeInput.name === 'y' ? activeInput.value : settings.y}
          />
          <Form.Input
            onBlur={handleBlurInput}
            onChange={handleChangeInput}
            label="Label rotation"
            name="rotation"
            type="number"
            value={activeInput && activeInput.name === 'rotation' ? activeInput.value : settings.rotation}
          />
        </Form.Group>
      )}
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

export default ScatterPlotForm;
