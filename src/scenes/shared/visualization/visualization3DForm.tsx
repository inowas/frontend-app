import { Button, DropdownProps, Form, InputOnChangeData } from 'semantic-ui-react';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { I3DVisualization, colormaps, fileTypes, visualization3DDefaults } from './visualization.type';

interface IActiveInput {
  name: string;
  value: string;
  type?: string;
}

interface IProps {
  onChange: (s: I3DVisualization) => void;
  simData: boolean;
}

const Visualization3DForm = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
  const [settings, setSettings] = useState<I3DVisualization>(visualization3DDefaults);

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
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="X Min"
          name="xmin"
          type="number"
          value={activeInput && activeInput.name === 'xmin' ? activeInput.value : settings.xmin}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="X Max"
          name="xmax"
          type="number"
          value={activeInput && activeInput.name === 'xmax' ? activeInput.value : settings.xmax}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Y Min"
          name="ymin"
          type="number"
          value={activeInput && activeInput.name === 'ymin' ? activeInput.value : settings.ymin}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Y Max"
          name="ymax"
          type="number"
          value={activeInput && activeInput.name === 'ymax' ? activeInput.value : settings.ymax}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Scale bar level"
          name="c"
          type="number"
          value={activeInput && activeInput.name === 'c' ? activeInput.value : settings.c}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Scale bar label"
          name="cbarlabel"
          value={activeInput && activeInput.name === 'cbarlabel' ? activeInput.value : settings.cbarlabel}
        />
      </Form.Group>
      <Form.Input
        fluid
        onBlur={handleBlurInput}
        onChange={handleChangeInput}
        label="Aspect"
        name="aspect"
        type="number"
        value={activeInput && activeInput.name === 'aspect' ? activeInput.value : settings.aspect}
      />
      <Form.Select
        fluid
        onChange={handleChangeSelect}
        placeholder="Choose color map"
        label="Colormap"
        name="cmap"
        options={colormaps.map((r) => ({ key: r, value: r, text: r }))}
        value={settings.cmap}
      />
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Axis label size"
          name="axislabelsize"
          type="number"
          value={activeInput && activeInput.name === 'axislabelsize' ? activeInput.value : settings.axislabelsize}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Tick label size"
          name="ticklabelsize"
          type="number"
          value={activeInput && activeInput.name === 'ticklabelsize' ? activeInput.value : settings.ticklabelsize}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Scale bar label size"
          name="scalebarsize"
          type="number"
          value={activeInput && activeInput.name === 'scalebarsize' ? activeInput.value : settings.scalebarsize}
        />
      </Form.Group>
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

export default Visualization3DForm;
