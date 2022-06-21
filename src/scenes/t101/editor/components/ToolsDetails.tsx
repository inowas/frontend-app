import { BoundaryFactory } from '../../../../core/model/modflow/boundaries';
import { Button, CheckboxProps, Divider, DropdownProps, Form, InputProps } from 'semantic-ui-react';
import { FormEvent, SyntheticEvent, useState } from 'react';
import { ITool, toolCategories } from '../../../../core/marPro/Tool.type';
import CostsCollection from '../../../../core/marPro/CostsCollections';
import CostsEditor from './CostsEditor';
import Scenario from '../../../../core/marPro/Scenario';
import Tool from '../../../../core/marPro/Tool';
import ToolParameters from './ToolParameters';

interface IProps {
  onChange: (tool: Tool) => void;
  scenario: Scenario;
  tool: Tool;
}

const ToolsDetails = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleBlur = (isNumeric: boolean, placeholder?: number) => () => {
    if (!activeInput) {
      return;
    }

    const cTool: ITool = {
      ...props.tool.toObject(),
      [activeInput]: isNumeric ? (activeValue === '' ? placeholder : parseFloat(activeValue)) : activeValue,
    };

    setActiveInput(null);
    props.onChange(Tool.fromObject(cTool));
  };

  const handleBlurVector2D = () => {
    if (!activeInput) {
      return;
    }
    const cTool: ITool = props.tool.toObject();

    if (activeInput === 'sizeX') {
      cTool.size.x = parseInt(activeValue);
    }
    if (activeInput === 'sizeY') {
      cTool.size.y = parseInt(activeValue);
    }

    setActiveInput(null);
    props.onChange(Tool.fromObject(cTool));
  };

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeCheckbox = (_: FormEvent, { name, checked }: CheckboxProps) => {
    if (typeof name !== 'string') {
      return;
    }

    const cTool: ITool = {
      ...props.tool.toObject(),
      [name]: checked,
    };

    props.onChange(Tool.fromObject(cTool));
  };

  const handleChangeCosts = (costs: CostsCollection) => {
    const cTool: ITool = {
      ...props.tool.toObject(),
      costs: costs.toObject(),
    };

    props.onChange(Tool.fromObject(cTool));
  };

  const handleChangeSelect = (_: SyntheticEvent, { name, value }: DropdownProps) => {
    const cTool: ITool = {
      ...props.tool.toObject(),
      [name]: value,
    };

    props.onChange(Tool.fromObject(cTool));
  };

  const handleClearBoundaryType = () => {
    const cTool: ITool = {
      ...props.tool.toObject(),
      boundaryType: undefined,
    };

    props.onChange(Tool.fromObject(cTool));
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          onChange={handleChange}
          onBlur={handleBlur(false)}
          label="Name"
          name="name"
          value={activeInput === 'name' ? activeValue : props.tool.name}
        />
        <Form.Select
          onChange={handleChangeSelect}
          onBlur={handleBlur(false)}
          options={toolCategories.map((c) => ({
            text: c,
            value: c,
            key: c,
          }))}
          label="Category"
          name="category"
          placeholder="Select Category"
          value={props.tool.category}
        />
        <Form.Select
          onChange={handleChangeSelect}
          onBlur={handleBlur(false)}
          options={BoundaryFactory.availableTypes.map((t) => {
            return {
              key: t,
              value: t,
              text: t,
            };
          })}
          label="Link to Boundary Type"
          name="boundaryType"
          placeholder="No link"
          value={props.tool.boundaryType === undefined ? '' : props.tool.boundaryType}
        />
        <Form.Field>
          <label>&nbsp;</label>
          <Button icon="delete" onClick={handleClearBoundaryType} />
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <label>Position</label>
        <Form.Checkbox
          onChange={handleChangeCheckbox}
          label="Position is editable"
          checked={props.tool.editPosition}
          name="editPosition"
        />
      </Form.Field>
      <Form.Group>
        <Form.Input
          onBlur={handleBlurVector2D}
          onChange={handleChange}
          name="sizeX"
          type="number"
          label="Size X"
          value={activeInput === 'sizeX' ? activeValue : props.tool.size.x}
        />
        <Form.Input
          onBlur={handleBlurVector2D}
          onChange={handleChange}
          name="sizeY"
          type="number"
          label="Size Y"
          value={activeInput === 'sizeY' ? activeValue : props.tool.size.y}
        />
        <Form.Field>
          <label>&nbsp;</label>
          <Form.Checkbox
            onChange={handleChangeCheckbox}
            label="Size is editable"
            checked={props.tool.editSize}
            name="editSize"
          />
        </Form.Field>
      </Form.Group>
      <Divider />
      <CostsEditor
        onChange={handleChangeCosts}
        costs={CostsCollection.fromObject(props.tool.costs)}
        scenario={props.scenario}
      />
      <Divider />
      <ToolParameters onChange={props.onChange} scenario={props.scenario} tool={props.tool} />
    </Form>
  );
};

export default ToolsDetails;
