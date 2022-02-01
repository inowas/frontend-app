import { Button, CheckboxProps, DropdownProps, Form, InputOnChangeData } from 'semantic-ui-react';
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react';
import { IContourExport, colormaps, contourDefaults, fileTypes } from './visualization.type';

interface IActiveInput {
  name: string;
  value?: string;
  type?: string;
}

interface IProps {
  isFetching: boolean;
  onChange: (s: IContourExport) => void;
}

const ContourForm = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
  const [settings, setSettings] = useState<IContourExport>(contourDefaults);

  const handleClickButton = () => props.onChange(settings);

  const handleBlurInput = () => {
    if (activeInput) {
      let value: any = activeInput.value;
      if (activeInput.value !== undefined && activeInput.type === 'number') {
        value = parseFloat(activeInput.value);
      }

      setSettings({
        ...settings,
        [activeInput.name]: value,
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
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="X Label"
          name="xlabel"
          value={activeInput && activeInput.name === 'xlabel' ? activeInput.value : settings.xlabel}
        />
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
          label="Y Label"
          name="ylabel"
          value={activeInput && activeInput.name === 'ylabel' ? activeInput.value : settings.ylabel}
        />
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
          label="Z Min"
          name="zmin"
          type="number"
          value={activeInput && activeInput.name === 'zmin' ? activeInput.value : settings.zmin}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Z Max"
          name="zmax"
          type="number"
          value={activeInput && activeInput.name === 'zmax' ? activeInput.value : settings.zmax}
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
          name="clblabel"
          value={activeInput && activeInput.name === 'clblabel' ? activeInput.value : settings.clblabel}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Label rotation"
          name="rotation"
          type="number"
          value={activeInput && activeInput.name === 'rotation' ? activeInput.value : settings.rotation}
        />
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Label distance from scale bar"
          name="distance"
          type="number"
          value={activeInput && activeInput.name === 'distance' ? activeInput.value : settings.distance}
        />
      </Form.Group>
      <Form.Select
        fluid
        onChange={handleChangeSelect}
        placeholder="Choose color map"
        label="Colormap"
        name="cmap"
        options={colormaps.map((r) => ({ key: r, value: r, text: r }))}
        value={settings.cmap}
      />
      <Form.Checkbox checked={settings.ask} name="ask" label="Export raster" onChange={handleChangeCheckbox} />
      {settings.ask && (
        <Form.Input
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Raster file name"
          name="tifname"
          value={activeInput && activeInput.name === 'tifname' ? activeInput.value : settings.tifname}
        />
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
      <Button primary fluid loading={props.isFetching} onClick={handleClickButton}>
        Apply
      </Button>
    </Form>
  );
};

export default ContourForm;
