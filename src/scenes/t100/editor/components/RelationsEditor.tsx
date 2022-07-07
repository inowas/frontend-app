import { Button, Dropdown, DropdownProps, Form, InputProps } from 'semantic-ui-react';
import { FormEvent, useState } from 'react';
import { IParameterRelation } from '../../../../core/marPro/Parameter.type';
import RelationsCollection from '../../../../core/marPro/RelationsCollection';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

interface IProps {
  onChange: (relations: RelationsCollection) => void;
  relations: RelationsCollection;
  scenario: Scenario;
}

const RelationsEditor = (props: IProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleAddRelation = (_: FormEvent, { value }: DropdownProps) => {
    if (typeof value !== 'string') {
      return;
    }

    props.onChange(
      props.relations.add({
        id: uuid.v4(),
        isStorage: false,
        relation: 1,
        resourceId: value,
      })
    );
  };

  const handleDelete = (id: string) => () => props.onChange(props.relations.removeById(id));

  const handleBlur = (isNumeric: boolean, placeholder?: number) => () => {
    const relation = props.relations.findById(activeId);
    if (!activeInput || !relation) {
      return;
    }

    const cRelation = {
      ...relation,
      [activeInput]: isNumeric ? (activeValue === '' ? placeholder : parseFloat(activeValue)) : activeValue,
    };

    setActiveInput(null);
    props.onChange(props.relations.update(cRelation));
  };

  const handleChange =
    (id: string) =>
    (_: FormEvent, { name, value }: InputProps) => {
      setActiveId(id);
      setActiveInput(name);
      setActiveValue(value);
    };

  const handleChangeStorage = (id: string) => () => {
    const relation = props.relations.findById(id);
    if (!relation) {
      return;
    }
    const cRelation = {
      ...relation,
      isStorage: !relation.isStorage,
    };
    props.onChange(props.relations.update(cRelation));
  };

  const renderRelation = (relation: IParameterRelation, key: number) => {
    const resource = props.scenario.resources.filter((r) => r.id === relation.resourceId);
    if (resource.length === 0) {
      return;
    }

    return (
      <Form.Group key={`relation_${key}`}>
        <Form.Input label="Resource" disabled value={resource[0].name} />
        <Form.Field>
          <label>&nbsp;</label>
          <Form.Checkbox onChange={handleChangeStorage(relation.id)} checked={relation.isStorage} label="Is Storage" />
        </Form.Field>
        <Form.Input
          onBlur={handleBlur(true, 1)}
          onChange={handleChange(relation.id)}
          label={relation.isStorage ? 'Maximum storage' : 'Multiplier'}
          name="relation"
          type="number"
          value={activeId === relation.id && activeInput === 'relation' ? activeValue : relation.relation}
        />
        <Form.Field>
          <label>&nbsp;</label>
          <Button negative onClick={handleDelete(relation.id)} icon="trash" />
        </Form.Field>
      </Form.Group>
    );
  };

  return (
    <Form>
      <Dropdown
        className="icon blue"
        fluid
        button
        icon="add"
        labeled
        onChange={handleAddRelation}
        options={props.scenario.resources.map((r) => ({
          key: r.id,
          text: r.name,
          value: r.id,
        }))}
        text="Add relation to resource"
        value={1}
      />
      <br />
      {props.relations.all.map((r, k) => renderRelation(r, k))}
    </Form>
  );
};

export default RelationsEditor;
