import { Button, Dropdown, DropdownProps, Form, InputProps } from 'semantic-ui-react';
import { FormEvent, useState } from 'react';
import { ICost } from '../../../../core/marPro/Tool.type';
import CostsCollection from '../../../../core/marPro/CostsCollections';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

interface IProps {
  onChange: (costs: CostsCollection) => void;
  costs: CostsCollection;
  scenario: Scenario;
}

const CostsEditor = (props: IProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleAddCost = (_: FormEvent, { value }: DropdownProps) => {
    if (typeof value !== 'string') {
      return;
    }

    props.onChange(
      props.costs.add({
        id: uuid.v4(),
        amount: 0,
        resource: value,
      })
    );
  };

  const handleDelete = (id: string) => () => props.onChange(props.costs.removeById(id));

  const handleBlur = (isNumeric: boolean, placeholder?: number) => () => {
    const cost = props.costs.findById(activeId);
    if (!activeInput || !cost) {
      return;
    }

    const cCost = {
      ...cost,
      [activeInput]: isNumeric ? (activeValue === '' ? placeholder : parseFloat(activeValue)) : activeValue,
    };

    setActiveInput(null);
    props.onChange(props.costs.update(cCost));
  };

  const handleChange =
    (id: string) =>
    (_: FormEvent, { name, value }: InputProps) => {
      setActiveId(id);
      setActiveInput(name);
      setActiveValue(value);
    };

  const renderCost = (cost: ICost, key: number) => {
    const resource = props.scenario.resources.filter((r) => r.id === cost.resource);
    if (resource.length === 0) {
      return;
    }

    return (
      <Form.Group key={`cost_${key}`}>
        <Form.Input label="Resource" disabled value={resource[0].name} />
        <Form.Input
          onBlur={handleBlur(true, 1)}
          onChange={handleChange(cost.id)}
          label="Amount"
          name="amount"
          type="number"
          value={activeId === cost.id && activeInput === 'amount' ? activeValue : cost.amount}
        />
        <Form.Input
          onBlur={handleBlur(true)}
          onChange={handleChange(cost.id)}
          label="Refund"
          name="refund"
          placeholder="No refund"
          type="number"
          value={activeId === cost.id && activeInput === 'refund' ? activeValue : cost.refund || ''}
        />
        <Form.Field>
          <label>&nbsp;</label>
          <Button negative onClick={handleDelete(cost.id)} icon="trash" />
        </Form.Field>
      </Form.Group>
    );
  };

  return (
    <Form>
      <Form.Field>
        <label>Costs</label>
      </Form.Field>
      <Dropdown
        className="icon blue"
        fluid
        button
        icon="add"
        labeled
        onChange={handleAddCost}
        options={props.scenario.resources.map((r) => ({
          key: r.id,
          text: r.name,
          value: r.id,
        }))}
        text="Add cost to tool"
        value={1}
      />
      <br />
      {props.costs.all.map((r, k) => renderCost(r, k))}
    </Form>
  );
};

export default CostsEditor;
